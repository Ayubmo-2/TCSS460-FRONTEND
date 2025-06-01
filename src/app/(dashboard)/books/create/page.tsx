'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, Grid, TextField, MenuItem } from '@mui/material';
import { useIntl } from 'react-intl';

// project import
import MainCard from '@/components/MainCard';

interface BookFormData {
  title: string;
  authors: string;
  isbn13: string;
  original_publication_year: number;
  image_url: string;
  description: string;
  genre: string;
  language: string;
  publisher: string;
}

function CreateBookPage() {
  const router = useRouter();
  const intl = useIntl();
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    authors: '',
    isbn13: '',
    original_publication_year: new Date().getFullYear(),
    image_url: '',
    description: '',
    genre: '',
    language: 'English',
    publisher: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'original_publication_year' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For this sprint, we'll just log the data and redirect
    console.log('Book data to be created:', formData);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/books/list');
  };

  const genres = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Thriller',
    'Biography',
    'History',
    'Science',
    'Technology',
    'Philosophy',
    'Poetry',
    'Drama'
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Chinese',
    'Japanese',
    'Korean'
  ];

  return (
    <MainCard title={intl.formatMessage({ id: 'create-book' })}>
      <Container maxWidth="md">
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label={intl.formatMessage({ id: 'book.title' })}
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label={intl.formatMessage({ id: 'book.authors' })}
                name="authors"
                value={formData.authors}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label={intl.formatMessage({ id: 'book.isbn' })}
                name="isbn13"
                value={formData.isbn13}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label={intl.formatMessage({ id: 'book.publication-year' })}
                name="original_publication_year"
                value={formData.original_publication_year}
                onChange={handleChange}
                inputProps={{ min: 1000, max: new Date().getFullYear() }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={intl.formatMessage({ id: 'book.image-url' })}
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                helperText={intl.formatMessage({ id: 'book.image-url-help' })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={intl.formatMessage({ id: 'book.description' })}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label={intl.formatMessage({ id: 'book.genre' })}
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              >
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label={intl.formatMessage({ id: 'book.language' })}
                name="language"
                value={formData.language}
                onChange={handleChange}
              >
                {languages.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={intl.formatMessage({ id: 'book.publisher' })}
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/books/list')}
                >
                  {intl.formatMessage({ id: 'cancel' })}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {intl.formatMessage({ id: 'create' })}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </MainCard>
  );
}

export default CreateBookPage; 