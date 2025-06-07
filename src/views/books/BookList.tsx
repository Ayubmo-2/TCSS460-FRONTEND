'use client';

import { useRouter } from 'next/navigation';
import { Grid, Card, CardContent, CardMedia, Typography, Rating, Box } from '@mui/material';
import { useIntl } from 'react-intl';
import { Book } from '@/types/book';

// material-ui
import { Box as MuiBox, Container, Stack } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// project import
import MainCard from '@/components/MainCard';

interface BookListProps {
  books: Book[];
}

const BookList = ({ books }: BookListProps) => {
  const router = useRouter();
  const intl = useIntl();

  // Remove duplicates based on ISBN
  const uniqueBooks = books.filter((book, index, self) =>
    index === self.findIndex((b) => b.isbn13 === book.isbn13)
  );

  if (!uniqueBooks || uniqueBooks.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        {intl.formatMessage({ id: 'books.no-books-found' })}
      </Typography>
    );
  }

  const handleBookClick = (book: Book) => {
    if (book.isbn13) {
      router.push(`/books/${book.isbn13}`);
    } else {
      console.error('No ISBN available for book:', book);
    }
  };

  return (
    <Grid container spacing={3}>
      {uniqueBooks.map((book, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={book.isbn13}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.2s ease-in-out',
                boxShadow: 3
              }
            }}
            onClick={() => handleBookClick(book)}
          >
            <CardMedia
              component="img"
              height="200"
              image={book.image_url || '/placeholder-book.jpg'}
              alt={book.title || 'Book cover'}
              sx={{ 
                objectFit: 'contain', 
                bgcolor: 'grey.100',
                p: 2
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-book.jpg';
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="h2" noWrap>
                {book.title || 'Untitled'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                {book.authors || 'Unknown Author'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating 
                  value={book.average_rating || 0} 
                  precision={0.5} 
                  readOnly 
                  size="small" 
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({(book.average_rating || 0).toFixed(1)})
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {book.original_publication_year || 'Year unknown'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BookList;
