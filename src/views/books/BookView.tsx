'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// material-ui
import { Box, Card, CardContent, Grid, Rating, Typography, Container, Button, Stack, Divider } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// project import
import MainCard from 'components/MainCard';
import { Book } from '@/types/book';

export default function BookView() {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [userRating, setUserRating] = useState<number>(0);

  useEffect(() => {
    const lastViewedBook = localStorage.getItem('lastViewedBook');
    if (lastViewedBook) {
      const bookData = JSON.parse(lastViewedBook);
      setBook(bookData);
      setUserRating(bookData.average_rating || 0);
    } else {
      router.push('/books/list');
    }
  }, [router]);

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      setUserRating(newValue);
      // In a real application, this would update the rating in the backend
    }
  };

  if (!book) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading book details...</Typography>
      </Box>
    );
  }

  return (
    <MainCard title={book.title}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
              {book.image_url ? (
                <img 
                  src={book.image_url} 
                  alt={book.title}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <MenuBookIcon sx={{ fontSize: 200, color: 'primary.main' }} />
              )}
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  by {book.authors}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mr: 1 }}>
                    Your Rating:
                  </Typography>
                  <Rating value={userRating} precision={0.5} onChange={handleRatingChange} size="large" />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Published Year:</Typography>
                      <Typography variant="body2">{book.original_publication_year}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">ISBN:</Typography>
                      <Typography variant="body2">{book.isbn13}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Original Title:</Typography>
                      <Typography variant="body2">{book.original_title}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Average Rating:</Typography>
                      <Typography variant="body2">{book.average_rating?.toFixed(2)} ({book.ratings_count} ratings)</Typography>
                    </Grid>
                  </Grid>
                </Stack>
                <Box sx={{ mt: 3 }}>
                  <Button variant="contained" color="primary" onClick={() => router.push('/books/list')}>
                    Back to Book List
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainCard>
  );
}
