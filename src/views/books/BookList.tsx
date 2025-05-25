'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// material-ui
import {
  Box,
  Card,
  CardContent,
  Grid,
  Rating,
  Typography,
  Button,
  Container,
  Stack
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// project import
import MainCard from 'components/MainCard';

// mock data
const mockBooks = [
  {
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
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    rating: 4.8,
    description: 'The story of racial injustice and the loss of innocence in the American South.',
    publishedYear: 1960,
    genre: 'Fiction',
    pages: 281,
    language: 'English',
    publisher: 'J. B. Lippincott & Co.'
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    rating: 4.3,
    description: 'A dystopian social science fiction novel and cautionary tale.',
    publishedYear: 1949,
    genre: 'Science Fiction',
    pages: 328,
    language: 'English',
    publisher: 'Secker & Warburg'
  }
];

export default function BookList() {
  const router = useRouter();
  const [books] = useState(mockBooks);

  const handleViewBook = (bookId: number) => {
    router.push(`/books/view?id=${bookId}`);
  };

  return (
    <MainCard title="Book List">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText'
                }}>
                  <MenuBookIcon sx={{ fontSize: 100 }} />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {book.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {book.author}
                  </Typography>
                  <Stack spacing={1} sx={{ my: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={book.rating} precision={0.5} readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {book.rating}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Published: {book.publishedYear}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Genre: {book.genre}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {book.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleViewBook(book.id)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </MainCard>
  );
}