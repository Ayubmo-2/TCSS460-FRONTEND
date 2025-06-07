'use client';

import { useState } from 'react';
import { Box, Typography, Container, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
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
          endpoint = `/author/${encodeURIComponent(searchTerm.trim())}`; // Fixed URL
          break;
        case 'year':
          endpoint = `/books/year/${encodeURIComponent(searchTerm.trim())}`;
          break;
        case 'rating':
          endpoint = `/books/retrieveRating/${encodeURIComponent(searchTerm.trim())}`; // Fixed URL
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
              booksData = [{
                Book: book
              }];
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
        } else if (searchType === 'author') {
          // Author search returns Books array (capital B)
          booksData = response.data.Books || [];
          console.log('Author search found books:', booksData.length);
        } else if (searchType === 'year') {
          booksData = response.data.entries || [];
          console.log('Year search found entries:', booksData.length);
        } else if (searchType === 'rating') {
          booksData = response.data.Books || [];
          console.log('Rating search found books:', booksData.length);
        }

        console.log('Processed books data:', booksData);

        // Process the books data according to the API response structure

        const processedBooks = booksData.map((bookWrapper: any, index: number) => {
          console.log('Full bookWrapper object:', bookWrapper);

          // The actual book data is nested inside a "Book" property
          const book = bookWrapper.Book || bookWrapper;
          console.log('Extracted book object:', book);

          // Let's see what properties are actually available
          console.log('Book properties:', Object.keys(book));

          // Safely extract title, handling undefined/null values
          const title = book.original_title || book.title || 'Untitled';
          const originalTitle = book.original_title || book.title || '';

          // Better extraction of publication year - try multiple fields
          const publicationYear = book.publication || book.publication_year || book.original_publication_year || book.year || 'Year unknown';

          // Fix author extraction - try both 'authors' and 'authorname'
          const authors = book.authors || book.authorname || 'Unknown Author';

          // Log what we extracted
          console.log('Extracted values:', {
            title,
            authors,
            publication: book.publication,
            publication_year: book.publication_year,
            year: publicationYear
          });

          // Generate a unique ID if isbn13 is missing
          const bookId = book.isbn13 || book.isbn || `book-${Date.now()}-${index}`;

          return {
            book_id: bookId,
            isbn13: bookId,
            authors: authors, // This now handles both formats
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


        // Filter out any books where the title doesn't match the search term
        const filteredBooks = processedBooks.filter((book: Book) => {
          const searchTermLower = searchTerm.toLowerCase();

          let matches = false;

          switch (searchType) {
            case 'title':
              // For title search, match against book titles
              const bookTitleLower = (book.title || '').toLowerCase();
              const originalTitleLower = (book.original_title || '').toLowerCase();
              matches = bookTitleLower.includes(searchTermLower) || originalTitleLower.includes(searchTermLower);
              break;

            case 'author':
              const authorsLower = (book.authors || '').toLowerCase();
              matches = authorsLower.includes(searchTermLower);
              break;

            case 'year':
              // For year search, match against publication year
              const bookYear = String(book.original_publication_year || '');
              matches = bookYear.includes(searchTerm);
              break;

            case 'rating':
              const bookRating = Number(book.average_rating || 0);
              const searchRating = Number(searchTerm);
              matches = bookRating >= searchRating;
              break;

            default:
              matches = true; // If unknown search type, include all books
          }

          console.log('Book match check:', {
            searchType,
            searchTerm: searchTermLower,
            bookTitle: book.title,
            bookAuthor: book.authors,
            bookYear: book.original_publication_year,
            bookRating: book.average_rating,
            matches
          });

          return matches;
        });

        console.log('Final processed books:', filteredBooks);
        
        setBooks(filteredBooks);
        setTotalBooks(filteredBooks.length);
        
        if (filteredBooks.length === 0) {
          setError("No books found matching your search criteria");
        }
      } else {
        console.log('No data in response');
        setError("No books found matching your search criteria");
      }
    } catch (err: any) {
      console.error('Error searching books:', err);
      console.error('Full error object:', JSON.stringify(err, null, 2));

      // Log the actual request details
      console.error('Request details:', {
        url: err.config?.url,
        method: err.config?.method,
        baseURL: err.config?.baseURL,
        fullURL: `${err.config?.baseURL}${err.config?.url}`
      });

      // Log response details if available
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        console.error('Response data:', err.response.data);

        // Check if it's a CORS issue
        if (err.response.status === 0) {
          setError('Network error - possible CORS issue');
        } else if (err.response.status === 404) {
          setError(`No books found for ${searchType}: "${searchTerm}"`);
        } else if (err.response.status === 400) {
          setError(`Invalid search parameter: ${err.response.data?.message || 'Bad request'}`);
        } else if (err.response.status >= 500) {
          setError('Server error - please try again later');
        } else {
          setError(`API Error (${err.response.status}): ${err.response.data?.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Network error - no response from server');
      } else {
        console.error('Request setup error:', err.message);
        setError(`Request error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Books
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            label= "Search By"
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
            label={"Search Term "}
            placeholder={
              searchType === 'year'
                ? 'Enter publication year (e.g., 1990)'
                : searchType === 'rating'
                  ? 'Enter minimum rating (1-5)'
                  : 'Enter search term'
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
                {"Loading..."}
              </>
            ) : (
              "Search"
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
          {`Found ${totalBooks} books`}
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