'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Rating, 
  Box, 
  Chip,
  Skeleton,
  IconButton,
  Tooltip,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { Book } from '@/types/book';

// material-ui
import { Box as MuiBox, Container, Stack } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// project import
import MainCard from '@/components/MainCard';

interface BookListProps {
  books: Book[];
  loading?: boolean;
}

const BookList = ({ books, loading = false }: BookListProps) => {
  const router = useRouter();
  const intl = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Remove duplicates based on ISBN
  const uniqueBooks = books.filter((book, index, self) =>
    index === self.findIndex((b) => b.isbn13 === book.isbn13)
  );

  const handleBookClick = (book: Book) => {
    if (book.isbn13) {
      localStorage.setItem('lastViewedBook', JSON.stringify(book));
      router.push(`/books/view`);
    }
  };

  const handleShare = (book: Book) => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out ${book.title} by ${book.authors}`,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={24} width="60%" />
                <Box sx={{ mt: 1 }}>
                  <Skeleton variant="text" height={20} width="40%" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!uniqueBooks || uniqueBooks.length === 0) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="400px"
        textAlign="center"
      >
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {intl.formatMessage({ id: 'books.no-books-found' })}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Try adjusting your search criteria or browse our collection
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {uniqueBooks.map((book) => (
        <Grid item xs={12} sm={6} md={4} key={book.isbn13}>
          <Fade in timeout={500}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  cursor: 'pointer'
                }
              }}
              onClick={() => handleBookClick(book)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={book.image_url || '/placeholder-book.jpg'}
                  alt={book.title}
                  sx={{ objectFit: 'cover' }}
                />
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    display: 'flex', 
                    gap: 1 
                  }}
                >
                  <Tooltip title="Save for later">
                    <IconButton 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
                      }}
                    >
                      <BookmarkIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(book);
                      }}
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.3
                  }}
                >
                  {book.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  by {book.authors}
                </Typography>
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                      value={book.average_rating} 
                      precision={0.5} 
                      size="small" 
                      readOnly 
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({book.ratings_count.toLocaleString()})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={book.original_publication_year} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={`ISBN: ${book.isbn13}`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
};

export default BookList;
