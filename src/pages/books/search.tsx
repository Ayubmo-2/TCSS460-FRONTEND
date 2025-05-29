import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import BookList from '../../components/BookList';
import { Book } from '../../types/book';

const BookSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const router = useRouter();

  const transformBookData = (data: any): Book => {
    return {
      book_id: parseInt(data.isbn13),
      isbn13: data.isbn13,
      authors: data.authors,
      original_publication_year: data.publication,
      original_title: data.original_title,
      title: data.title,
      average_rating: data.ratings.average,
      ratings_count: data.ratings.count,
      ratings_1: data.ratings.rating_1,
      ratings_2: data.ratings.rating_2,
      ratings_3: data.ratings.rating_3,
      ratings_4: data.ratings.rating_4,
      ratings_5: data.ratings.rating_5,
      image_url: data.icon.large,
      small_image_url: data.icon.small
    };
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let url = 'https://group4-tcss460-web-api-88aed6dd5161.herokuapp.com/books';
      
      // Add specific endpoint based on search type
      if (searchType !== 'all' && searchTerm) {
        switch(searchType) {
          case 'title':
            url += `/title/${encodeURIComponent(searchTerm)}`;
            break;
          case 'author':
            url += `/author/${encodeURIComponent(searchTerm)}`;
            break;
          case 'year':
            url += `/year?year=${searchTerm}`;
            break;
          case 'rating':
            url += `/retrieveRating/${searchTerm}`;
            break;
          default:
            url += '/all?limit=10';
            break;
        }
      } else {
        url += '/all?limit=10';
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch books');
      }

      // Handle different response formats
      if (data.Book) {
        setBooks([transformBookData(data.Book)]);
      } else if (data.entries) {
        setBooks(data.entries.map((entry: any) => transformBookData(entry.Book)));
      } else if (Array.isArray(data)) {
        setBooks(data.map(book => transformBookData(book)));
      } else if (data.books) {
        setBooks(data.books.map((book: any) => transformBookData(book)));
      } else if (data.message === "Book not found") {
        setBooks([]);
        setError("No books found matching your search criteria");
      } else {
        setBooks([]);
        setError("No books found");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Books</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Books</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="year">Publication Year</option>
            <option value="rating">Rating</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search term..."
            className="p-2 border rounded flex-grow"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Search
          </button>
        </div>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {books.length > 0 ? (
        <BookList books={books} />
      ) : !loading && !error && (
        <p>No books found. Try a different search term.</p>
      )}
    </div>
  );
};

export default BookSearch; 