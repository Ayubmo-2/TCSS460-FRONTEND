import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';
import BookDetail from '@/views/books/BookDetail';

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(`/books/${params.id}`);
        setBook(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch book details');
        setLoading(false);
      }
    };

    if (session) {
      fetchBook();
    }
  }, [session, params.id]);

  const handleRatingUpdate = async (rating: number) => {
    try {
      const response = await axiosInstance.put(`/books/${params.id}/rating`, { rating });
      setBook(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update rating');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>Book not found</div>;

  return <BookDetail book={book} onRatingUpdate={handleRatingUpdate} />;
}
