'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Divider, 
  Snackbar, 
  Alert, 
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Share as ShareIcon,
  BookmarkBorder as BookmarkIcon,
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { Book } from '@/types/book';

export default function BookView() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [book, setBook] = useState<Book | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    const lastViewedBook = localStorage.getItem('lastViewedBook');
    if (lastViewedBook) {
      const bookData = JSON.parse(lastViewedBook);
      setBook(bookData);
      const savedRating = localStorage.getItem(`book_rating_${bookData.isbn13}`);
      setUserRating(savedRating ? parseFloat(savedRating) : bookData.average_rating || 0);
    } else {
      router.push('/books/list');
    }
  }, [router]);

  const handleRatingChange = async (event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null && book) {
      setIsUpdating(true);
      try {
        localStorage.setItem(`book_rating_${book.isbn13}`, newValue.toString());
        setUserRating(newValue);
        
        setNotification({
          open: true,
          message: 'Rating updated successfully!',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error updating rating:', error);
        setNotification({
          open: true,
          message: 'Failed to update rating. Please try again.',
          severity: 'error'
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share && book) {
      navigator.share({
        title: book.title,
        text: `Check out ${book.title} by ${book.authors}`,
        url: window.location.href
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (!book) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <MainCard>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Book Cover */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3}
              sx={{ 
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                '&:hover': {
                  '& .overlay': {
                    opacity: 1
                  }
                }
              }}
            >
              <Box
                component="img"
                src={book.image_url || '/placeholder-book.jpg'}
                alt={book.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover'
                }}
              />
              <Box
                className="overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s'
                }}
              >
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Save for later">
                    <IconButton sx={{ color: 'white' }}>
                      <BookmarkIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton onClick={handleShare} sx={{ color: 'white' }}>
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Book Details */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  by {book.authors}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip label={`ISBN: ${book.isbn13}`} />
                  <Chip label={`Published: ${book.original_publication_year}`} />
                </Stack>
              </Box>

              <Divider />

              {/* Rating Section */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Rate this book
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Rating
                    value={userRating}
                    onChange={handleRatingChange}
                    precision={0.5}
                    size="large"
                    disabled={isUpdating}
                    icon={<StarIcon fontSize="inherit" />}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  />
                  {isUpdating && <CircularProgress size={24} />}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {book.ratings_count.toLocaleString()} ratings
                </Typography>
              </Box>

              <Divider />

              {/* Rating Distribution */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Rating Distribution
                </Typography>
                <Stack spacing={1}>
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const ratingKey = `ratings_${rating}` as keyof Book;
                    const ratingCount = book[ratingKey] as number;
                    return (
                      <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ minWidth: 20 }}>
                          {rating}
                        </Typography>
                        <Box
                          sx={{
                            flexGrow: 1,
                            height: 8,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              bgcolor: 'primary.main',
                              width: `${(ratingCount / book.ratings_count) * 100}%`
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                          {ratingCount.toLocaleString()}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
