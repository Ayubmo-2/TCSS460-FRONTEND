'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, Rating, Paper, Grid, Button, TextField } from '@mui/material';
import { mockBooks } from '../../utils/mockBooks';

const BookDetail = () => {
  const params = useParams();
  const router = useRouter();
  const book = mockBooks.find((b) => b.id === (params as { id: string }).id);
  const [rating, setRating] = useState(book?.rating || 0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!book) {
      router.push('/books');
    }
  }, [book, router]);

  if (!book) {
    return null;
  }

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      setRating(newValue);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, this would update the rating on the server
    console.log('Rating updated:', rating);
    console.log('Comment:', comment);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button variant="outlined" onClick={() => router.push('/books')} sx={{ mb: 3 }}>
        Back to Books
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <img
              src={book.coverImage}
              alt={book.title}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {book.title}
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={book.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({book.rating} average rating)
              </Typography>
            </Box>

            <Typography variant="body1" paragraph>
              {book.description}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Genre
                </Typography>
                <Typography variant="body1">{book.genre}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Published Year
                </Typography>
                <Typography variant="body1">{book.publishedYear}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  ISBN
                </Typography>
                <Typography variant="body1">{book.isbn}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Pages
                </Typography>
                <Typography variant="body1">{book.pageCount}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Language
                </Typography>
                <Typography variant="body1">{book.language}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Publisher
                </Typography>
                <Typography variant="body1">{book.publisher}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Rate this Book
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Your Rating</Typography>
            <Rating value={rating} precision={0.5} onChange={handleRatingChange} />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit Review
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default BookDetail;
