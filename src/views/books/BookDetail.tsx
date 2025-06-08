'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Rating, Paper, Grid, Button, TextField } from '@mui/material';
import Image from 'next/image';
import { Book } from '@/types/book';
import { useIntl } from 'react-intl';

interface BookDetailProps {
  book: Book;
}

const BookDetail = ({ book }: BookDetailProps) => {
  const router = useRouter();
  const intl = useIntl();
  const [rating, setRating] = useState(book.average_rating || 0);
  const [comment, setComment] = useState('');

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
      <Button variant="outlined" onClick={() => router.push('/books/list')} sx={{ mb: 3 }}>
        {intl.formatMessage({ id: 'books.back-to-list' })}
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Image
              src={book.image_url || '/placeholder-book.jpg'}
              alt={book.title}
              width={500}
              height={600}
              priority
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
              by {book.authors}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={book.average_rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({book.ratings_count} ratings)
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  {intl.formatMessage({ id: 'books.published-year' })}
                </Typography>
                <Typography variant="body1">{book.original_publication_year}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  {intl.formatMessage({ id: 'books.fields.isbn' })}
                </Typography>
                <Typography variant="body1">{book.isbn13}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  {intl.formatMessage({ id: 'books.original-title' })}
                </Typography>
                <Typography variant="body1">{book.original_title}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          {intl.formatMessage({ id: 'books.your-rating' })}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">{intl.formatMessage({ id: 'books.your-rating' })}</Typography>
            <Rating value={rating} precision={0.5} onChange={handleRatingChange} />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={intl.formatMessage({ id: 'books.your-review' })}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary">
            {intl.formatMessage({ id: 'books.submit-review' })}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default BookDetail;
