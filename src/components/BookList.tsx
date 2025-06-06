import React from 'react';
import Link from 'next/link';
import { Book } from '../types/book';
import Image from 'next/image';

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <div key={book.book_id} className="border p-4 rounded shadow">
          <div className="relative h-48 w-full mb-4">
            <Image
              src={book.image_url || '/placeholder-book.jpg'}
              alt={book.title}
              fill
              className="object-cover rounded"
            />
          </div>
          <h2 className="text-xl font-bold">{book.title}</h2>
          <p className="text-gray-600">by {book.authors}</p>
          <p className="text-gray-600">Published: {book.original_publication_year}</p>
          <div className="flex items-center mt-2">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-gray-600">
              {book.average_rating.toFixed(1)} ({book.ratings_count.toLocaleString()} reviews)
            </span>
          </div>
          <Link href={`/books/${book.book_id}`} className="text-blue-500 hover:underline mt-2 inline-block">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BookList; 