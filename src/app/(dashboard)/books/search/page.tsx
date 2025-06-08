'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  TextField, 
  Button, 
  MenuItem, 
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Alert
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import BookList from '@/views/books/BookList';
import axios from 'axios';
import { Book } from '@/types/book';

const publicAxios = axios.create({
  baseURL: 'https://group4-tcss460-web-api-88aed6dd5161.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function SearchPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchType, setSearchType] = useState('title');
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalBooks, setTotalBooks] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    // Add to recent searches
    setRecentSearches(prev => {
      const newSearches = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      return newSearches;
    });

    try {
      let endpoint = '';
      
      switch (searchType) {
        case 'title':
          endpoint = `/books/title/${encodeURIComponent(searchTerm.trim())}`;
          break;
        case 'author':
          endpoint = `/author/${encodeURIComponent(searchTerm.trim())}`;
          break;
        case 'year':
          endpoint = `/books/year/${encodeURIComponent(searchTerm.trim())}`;
          break;
        case 'rating':
          endpoint = `/books/retrieveRating/${encodeURIComponent(searchTerm.trim())}`;
          break;
      }

      const response = await publicAxios.get(endpoint);
      
      if (response.data) {
        let booksData = [];
        
        if (searchType === 'title') {
          if (response.data.Book) {
            const book = response.data.Book;
            const searchTermLower = searchTerm.toLowerCase();
            const bookTitleLower = (book.original_title || book.title || '').toLowerCase();

            if (bookTitleLower.includes(searchTermLower)) {
              booksData = [{
                Book: book
              }];
            }
          } else if (response.data.entries) {
            booksData = response.data.entries;
          }
        } else if (searchType === 'author') {
          booksData = response.data.Books || [];
        } else if (searchType === 'year') {
          booksData = response.data.entries || [];
        } else if (searchType === 'rating') {
          booksData = response.data.Books || [];
        }

        const processedBooks = booksData.map((bookWrapper: any) => {
          const book = bookWrapper.Book || bookWrapper;
          const title = book.original_title || book.title || 'Untitled';
          const originalTitle = book.original_title || book.title || '';
          const publicationYear = book.publication || book.publication_year || book.original_publication_year || book.year || 'Year unknown';
          const authors = book.authors || book.authorname || 'Unknown Author';
          const bookId = book.isbn13 || book.isbn || `book-${Date.now()}`;

          return {
            book_id: bookId,
            isbn13: bookId,
            authors: authors,
            original_publication_year: publicationYear,
            original_title: originalTitle,
            title: title,
            average_rating: parseFloat(book.ratings?.average || 0),
            ratings_count: parseInt(book.ratings?.count || 0),
            ratings_1: parseInt(book.ratings?.rating_1 || 0),
            ratings_2: parseInt(book.ratings?.rating_2 || 0),
            ratings_3: parseInt(book.ratings?.rating_3 || 0),
            ratings_4: parseInt(book.ratings?.rating_4 || 0),
            ratings_5: parseInt(book.ratings?.rating_5 || 0),
            image_url: book.icon?.large || '/placeholder-book.jpg',
            small_image_url: book.icon?.small || '/placeholder-book.jpg'
          };
        });

        const filteredBooks = processedBooks.filter((book: Book) => {
          const searchTermLower = searchTerm.toLowerCase();

          switch (searchType) {
            case 'title':
              const bookTitleLower = (book.title || '').toLowerCase();
              const originalTitleLower = (book.original_title || '').toLowerCase();
              return bookTitleLower.includes(searchTermLower) || originalTitleLower.includes(searchTermLower);

            case 'author':
              const authorsLower = (book.authors || '').toLowerCase();
              return authorsLower.includes(searchTermLower);

            case 'year':
              const bookYear = String(book.original_publication_year || '');
              return bookYear.includes(searchTerm);

            case 'rating':
              const bookRating = Number(book.average_rating || 0);
              const searchRating = Number(searchTerm);
              return bookRating >= searchRating;

            default:
              return true;
          }
        });

        // Sort books based on selected sort option
        const sortedBooks = [...filteredBooks].sort((a, b) => {
          switch (sortBy) {
            case 'title':
              return (a.title || '').localeCompare(b.title || '');
            case 'author':
              return (a.authors || '').localeCompare(b.authors || '');
            case 'year':
              return (b.original_publication_year || 0) - (a.original_publication_year || 0);
            case 'rating':
              return (b.average_rating || 0) - (a.average_rating || 0);
            default:
              return 0;
          }
        });
        
        setBooks(sortedBooks);
        setTotalBooks(sortedBooks.length);
        
        if (sortedBooks.length === 0) {
          setError("No books found matching your search criteria");
        }
      } else {
        setError("No books found matching your search criteria");
      }
    } catch (err: any) {
      console.error('Error searching books:', err);
      
      if (err.response) {
        if (err.response.status === 404) {
          setError(`No books found for ${searchType}: "${searchTerm}"`);
        } else if (err.response.status === 400) {
          setError(`Invalid search parameter: ${err.response.data?.message || 'Bad request'}`);
        } else if (err.response.status >= 500) {
          setError('Server error - please try again later');
        } else {
          setError(`API Error (${err.response.status}): ${err.response.data?.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        setError('Network error - no response from server');
      } else {
        setError(`Request error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setBooks([]);
    setError(null);
    setTotalBooks(0);
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    // Trigger search
    const event = new Event('submit');
    document.querySelector('form')?.dispatchEvent(event);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4,
          bgcolor: 'background.paper',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Search Books
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
          <Stack spacing={2}>
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <TextField
                select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                label="Search By"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="author">Author</MenuItem>
                <MenuItem value="year">Publication Year</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </TextField>

              <TextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                label="Search Term"
                placeholder={
                  searchType === 'year'
                    ? 'Enter publication year (e.g., 1990)'
                    : searchType === 'rating'
                      ? 'Enter minimum rating (1-5)'
                      : 'Enter search term'
                }
                type={searchType === 'year' || searchType === 'rating' ? 'number' : 'text'}
                sx={{ flexGrow: 1 }}
                InputProps={{
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch} edge="end">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading || !searchTerm.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                {loading ? "Searching..." : "Search"}
              </Button>

              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </Box>

            {showFilters && (
              <Fade in={showFilters}>
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      select
                      label="Sort By"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{ minWidth: 200 }}
                    >
                      <MenuItem value="relevance">Relevance</MenuItem>
                      <MenuItem value="title">Title</MenuItem>
                      <MenuItem value="author">Author</MenuItem>
                      <MenuItem value="year">Publication Year</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                    </TextField>
                  </Stack>
                </Box>
              </Fade>
            )}

            {recentSearches.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Recent Searches
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {recentSearches.map((term) => (
                    <Chip
                      key={term}
                      label={term}
                      onClick={() => handleRecentSearchClick(term)}
                      onDelete={() => {
                        setRecentSearches(prev => {
                          const newSearches = prev.filter(s => s !== term);
                          localStorage.setItem('recentSearches', JSON.stringify(newSearches));
                          return newSearches;
                        });
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {books.length > 0 && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {`Found ${totalBooks} books`}
          </Typography>
        )}

        <BookList books={books} loading={loading} />
      </Paper>
    </Container>
  );
} 