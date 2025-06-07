'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import BookDetail from '@/views/books/BookDetail';
import { Box, Typography, Container, CircularProgress, Button } from '@mui/material';
import { useIntl } from 'react-intl';
import { Book } from '@/types/book';

const publicAxios = axios.create({
  baseURL: 'https://group4-tcss460-web-api-88aed6dd5161.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const intl = useIntl();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        console.log('Fetching book with ISBN:', params.id);
        const response = await publicAxios.get(`/isbn/${params.id}`);
        console.log('API Response:', response.data);
        
        if (response.data && response.data.Book) {
          const bookData = response.data.Book;
          setBook({
            book_id: bookData.isbn13,
            isbn13: bookData.isbn13,
            authors: bookData.authorname || bookData.authors,
            original_publication_year: bookData.publication_year || bookData.publication,
            original_title: bookData.original_title,
            title: bookData.title,
            average_rating: parseFloat(bookData.ratings?.average || 0),
            ratings_count: parseInt(bookData.ratings?.count || 0),
            ratings_1: parseInt(bookData.ratings?.rating_1 || 0),
            ratings_2: parseInt(bookData.ratings?.rating_2 || 0),
            ratings_3: parseInt(bookData.ratings?.rating_3 || 0),
            ratings_4: parseInt(bookData.ratings?.rating_4 || 0),
            ratings_5: parseInt(bookData.ratings?.rating_5 || 0),
            image_url: bookData.icon?.large || '/placeholder-book.jpg',
            small_image_url: bookData.icon?.small || '/placeholder-book.jpg'
          });
        } else {
          setError('Book not found. Please check the ISBN and try again.');
        }
      } catch (err: any) {
        console.error('Error fetching book:', err);
        if (err.response) {
          if (err.response.status === 404) {
            setError('Book not found. Please check the ISBN and try again.');
          } else if (err.response.status === 401) {
            setError('Please log in to view book details.');
          } else {
            setError(`Error loading book: ${err.response.data?.message || 'Unknown error'}`);
          }
        } else if (err.request) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchBook();
    }
  }, [params.id, status]);

  if (status === 'loading' || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px" gap={2}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button variant="contained" onClick={() => router.push('/books/list')}>
          Back to Book List
        </Button>
      </Box>
    );
  }

  if (!book) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px" gap={2}>
        <Typography variant="h6">Book not found</Typography>
        <Button variant="contained" onClick={() => router.push('/books/list')}>
          Back to Book List
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <BookDetail book={book} />
    </Container>
  );
}
