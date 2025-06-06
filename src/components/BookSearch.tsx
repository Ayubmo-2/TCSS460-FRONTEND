'use client';

import { useState } from 'react';
import { TextField, Button, Card, CardContent, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';

export function BookSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [genre, setGenre] = useState(searchParams?.get('genre') || '');
  const [author, setAuthor] = useState(searchParams?.get('author') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (genre) params.set('genre', genre);
    if (author) params.set('author', author);
    router.push(`/books/search?${params.toString()}`);
  };

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent sx={{ pt: 3 }}>
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Genre</InputLabel>
              <Select
                value={genre}
                label="Genre"
                onChange={(e) => setGenre(e.target.value)}
              >
                <MenuItem value="">All Genres</MenuItem>
                <MenuItem value="fiction">Fiction</MenuItem>
                <MenuItem value="non-fiction">Non-Fiction</MenuItem>
                <MenuItem value="mystery">Mystery</MenuItem>
                <MenuItem value="science-fiction">Science Fiction</MenuItem>
                <MenuItem value="fantasy">Fantasy</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Search />}
              sx={{ minWidth: 120 }}
            >
              Search
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
} 