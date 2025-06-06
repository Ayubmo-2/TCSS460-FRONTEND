'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';
import BookDetail from '@/views/books/BookDetail';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { useIntl } from 'react-intl';
import { Book } from '@/types/book';

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
        const response = await axiosInstance.get(`/books/all?isbn=${params.id}`);
        if (response.data && response.data.Books && response.data.Books.length > 0) {
          const bookData = response.data.Books[0];
          setBook({
            book_id: bookData.isbn13,
            isbn13: bookData.isbn13,
            authors: bookData.authorname,
            original_publication_year: bookData.publication_year,
            original_title: bookData.original_title,
            title: bookData.title,
            average_rating: bookData.ratings.average,
            ratings_count: bookData.ratings.count,
            ratings_1: bookData.ratings.rating_1,
            ratings_2: bookData.ratings.rating_2,
            ratings_3: bookData.ratings.rating_3,
            ratings_4: bookData.ratings.rating_4,
            ratings_5: bookData.ratings.rating_5,
            image_url: bookData.icon.large,
            small_image_url: bookData.icon.small
          });
        } else {
          setError(intl.formatMessage({ id: 'books.messages.noResults' }));
        }
      } catch (err) {
        console.error('Error fetching book:', err);
        setError(intl.formatMessage({ id: 'books.messages.loadError' }));
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchBook();
    }
  }, [params.id, status, intl]);

  if (status === 'loading' || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!book) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>{intl.formatMessage({ id: 'books.messages.noResults' })}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <BookDetail book={book} />
    </Container>
  );
}
