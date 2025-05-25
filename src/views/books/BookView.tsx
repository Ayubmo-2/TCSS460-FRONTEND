'use client';

import { useState } from 'react';

// material-ui
import {
  Box,
  Card,
  CardContent,
  Grid,
  Rating,
  Typography,
  Container,
  Button,
  Stack,
  Divider
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// project import
import MainCard from 'components/MainCard';

// mock data for a single book
const book = {
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  rating: 4.5,
  description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
  publishedYear: 1925,
  genre: 'Fiction',
  pages: 180,
  language: 'English',
  publisher: 'Scribner'
};

export default function BookView() {
  const [userRating, setUserRating] = useState<number>(book.rating);

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      setUserRating(newValue);
      // In a real application, this would update the rating in the backend
    }
  };

  return (
    <MainCard title={book.title}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
              <MenuBookIcon sx={{ fontSize: 200, color: 'primary.main' }} />
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  by {book.author}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mr: 1 }}>
                    Your Rating:
                  </Typography>
                  <Rating
                    value={userRating}
                    precision={0.5}
                    onChange={handleRatingChange}
                    size="large"
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" paragraph>
                  {book.description}
                </Typography>
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Published Year:</Typography>
                      <Typography variant="body2">{book.publishedYear}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Genre:</Typography>
                      <Typography variant="body2">{book.genre}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Pages:</Typography>
                      <Typography variant="body2">{book.pages}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Language:</Typography>
                      <Typography variant="body2">{book.language}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Publisher:</Typography>
                      <Typography variant="body2">{book.publisher}</Typography>
                    </Grid>
                  </Grid>
                </Stack>
                <Box sx={{ mt: 3 }}>
                  <Button variant="contained" color="primary" href="/books/list">
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