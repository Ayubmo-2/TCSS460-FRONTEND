'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Container, Button, CircularProgress } from '@mui/material';
import BookList from '@/views/books/BookList';
import axiosInstance from '@/utils/axios';
import { useIntl } from 'react-intl';
import { Book } from '@/types/book';

export default function ListBooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const intl = useIntl();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentCursor, setCurrentCursor] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const scrollPositionRef = useRef<number>(0);

  const loadBooks = async (cursor: number = 0) => {
    try {
      if (cursor === 0) {
        setLoading(true);
      }
      setError(null);
      const response = await axiosInstance.get(`/books/all?cursor=${cursor}`);
      
      if (response.data && response.data.Books) {
        // Process the books data
        const processedBooks = response.data.Books.map((book: any) => ({
          book_id: book.isbn13,
          isbn13: book.isbn13,
          authors: book.authorname || book.authors,
          original_publication_year: book.publication_year || book.publication,
          original_title: book.original_title,
          title: book.title,
          average_rating: parseFloat(book.ratings?.average || 0),
          ratings_count: parseInt(book.ratings?.count || 0),
          ratings_1: parseInt(book.ratings?.rating_1 || 0),
          ratings_2: parseInt(book.ratings?.rating_2 || 0),
          ratings_3: parseInt(book.ratings?.rating_3 || 0),
          ratings_4: parseInt(book.ratings?.rating_4 || 0),
          ratings_5: parseInt(book.ratings?.rating_5 || 0),
          image_url: book.icon?.large || '/placeholder-book.jpg',
          small_image_url: book.icon?.small || '/placeholder-book.jpg'
        }));

        if (cursor === 0) {
          setBooks(processedBooks);
          setTotalBooks(response.data.pagination?.totalRecords || processedBooks.length);
        } else {
          setBooks(prevBooks => [...prevBooks, ...processedBooks]);
        }

        // Update cursor for next page
        const nextCursor = cursor + processedBooks.length;
        setCurrentCursor(nextCursor);
        setHasMore(nextCursor < (response.data.pagination?.totalRecords || 0));
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      setError('Failed to load books');
      console.error('Error loading books:', err);
    } finally {
      if (cursor === 0) {
        setLoading(false);
      }
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadBooks(0);
    }
  }, [status]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      loadBooks(currentCursor);
    }
  };

  if (status === 'loading' || (loading && books.length === 0)) {
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {intl.formatMessage({ id: 'navigation.list-books' })}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {intl.formatMessage({ id: 'books.total-books' }, { count: totalBooks })}
      </Typography>
      
      <BookList books={books} />
      
      {hasMore && (
        <Box display="flex" justifyContent="center" mt={4} mb={4}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                {intl.formatMessage({ id: 'books.loading' })}
              </>
            ) : (
              intl.formatMessage({ id: 'books.load-more' })
            )}
          </Button>
        </Box>
      )}
    </Container>
  );
}
