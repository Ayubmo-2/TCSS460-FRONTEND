'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Container, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import BookList from '@/views/books/BookList';
import axios from 'axios';
import { useIntl } from 'react-intl';
import { Book } from '@/types/book';

const publicAxios = axios.create({
  baseURL: 'https://group4-tcss460-web-api-88aed6dd5161.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function SearchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const intl = useIntl();
  const [searchType, setSearchType] = useState('title');
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalBooks, setTotalBooks] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      
      // Use specific endpoints for each search type based on API documentation
      switch (searchType) {
        case 'title':
          endpoint = `/books/title/${encodeURIComponent(searchTerm.trim())}`;
          break;
        case 'author':
          endpoint = `/books/author/${encodeURIComponent(searchTerm.trim())}`;
          break;
        case 'year':
          endpoint = `/books/year/${encodeURIComponent(searchTerm.trim())}`;
          break;
        case 'rating':
          endpoint = `/books/rating/${encodeURIComponent(searchTerm.trim())}`;
          break;
      }

      console.log('Making API request to:', endpoint);
      
      const response = await publicAxios.get(endpoint);
      console.log('Raw API response:', response);
      console.log('Response data:', response.data);
      
      if (response.data) {
        let booksData = [];
        
        // Handle different response structures based on search type
        if (searchType === 'title') {
          // For title search, the response has a single Book object
          if (response.data.Book) {
            const book = response.data.Book;
            console.log('Title search found book:', book);
            
            // Verify the book matches our search term
            const searchTermLower = searchTerm.toLowerCase();
            const bookTitleLower = (book.original_title || book.title || '').toLowerCase();
            
            if (bookTitleLower.includes(searchTermLower)) {
              booksData = [book];
              console.log('Book matches search term');
            } else {
              console.log('Book does not match search term:', {
                searchTerm: searchTermLower,
                bookTitle: bookTitleLower
              });
            }
          } else if (response.data.entries) {
            booksData = response.data.entries;
            console.log('Title search found entries:', booksData.length);
          } else {
            console.log('No book found in title search response:', response.data);
          }
        } else if (searchType === 'author' || searchType === 'year') {
          booksData = response.data.entries || [];
          console.log('Author/Year search found entries:', booksData.length);
        } else if (searchType === 'rating') {
          booksData = response.data.Books || [];
          console.log('Rating search found books:', booksData.length);
        }

        console.log('Processed books data:', booksData);

        // Process the books data according to the API response structure
        const processedBooks = booksData.map((book: any) => {
          console.log('Processing book:', book);
          // Ensure we're using the correct title from the API response
          const title = book.original_title || book.title;
          return {
            book_id: book.isbn13,
            isbn13: book.isbn13,
            authors: book.authors,
            original_publication_year: book.publication,
            original_title: book.original_title,
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

        // Filter out any books where the title doesn't match the search term
        const filteredBooks = processedBooks.filter((book: Book) => {
          const searchTermLower = searchTerm.toLowerCase();
          const bookTitleLower = book.title.toLowerCase();
          const originalTitleLower = book.original_title?.toLowerCase() || '';
          
          const matches = bookTitleLower.includes(searchTermLower) || 
                 originalTitleLower.includes(searchTermLower);
          
          console.log('Book match check:', {
            searchTerm: searchTermLower,
            bookTitle: bookTitleLower,
            originalTitle: originalTitleLower,
            matches
          });
          
          return matches;
        });

        console.log('Final processed books:', filteredBooks);
        
        setBooks(filteredBooks);
        setTotalBooks(filteredBooks.length);
        
        if (filteredBooks.length === 0) {
          setError(intl.formatMessage({ id: 'books.search.noResults' }));
        }
      } else {
        console.log('No data in response');
        setError(intl.formatMessage({ id: 'books.search.noResults' }));
      }
    } catch (err: any) {
      console.error('Error searching books:', err);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
        config: err.config
      });
      
      // Handle specific error messages from the API
      if (err.response?.status === 404) {
        setError(intl.formatMessage({ id: 'books.search.noResults' }));
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || intl.formatMessage({ id: 'books.search.invalidInput' }));
      } else {
        setError(intl.formatMessage({ id: 'books.search.error' }));
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {intl.formatMessage({ id: 'books.search.title' })}
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            label={intl.formatMessage({ id: 'books.search.searchBy' })}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="title">{intl.formatMessage({ id: 'books.search.byTitle' })}</MenuItem>
            <MenuItem value="author">{intl.formatMessage({ id: 'books.search.byAuthor' })}</MenuItem>
            <MenuItem value="year">{intl.formatMessage({ id: 'books.search.byYear' })}</MenuItem>
            <MenuItem value="rating">{intl.formatMessage({ id: 'books.search.byRating' })}</MenuItem>
          </TextField>

          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            label={intl.formatMessage({ id: 'books.search.searchTerm' })}
            placeholder={
              searchType === 'year' 
                ? intl.formatMessage({ id: 'books.search.enterYear' })
                : searchType === 'rating'
                ? intl.formatMessage({ id: 'books.search.enterRating' })
                : intl.formatMessage({ id: 'books.search.enterSearchTerm' })
            }
            type={searchType === 'year' || searchType === 'rating' ? 'number' : 'text'}
            sx={{ flexGrow: 1 }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !searchTerm.trim()}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                {intl.formatMessage({ id: 'books.loading' })}
              </>
            ) : (
              intl.formatMessage({ id: 'books.search.search' })
            )}
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {books.length > 0 && (
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {intl.formatMessage({ id: 'books.total-books' }, { count: totalBooks })}
        </Typography>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <BookList books={books} />
      )}
    </Container>
  );
} 