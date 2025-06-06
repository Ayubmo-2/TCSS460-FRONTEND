import React from 'react';
import { Book } from '../types/book';
import Image from 'next/image';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={book.image_url || '/placeholder-book.jpg'}
          alt={book.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">by {book.authors}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-600">{book.average_rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-500">{book.original_publication_year}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard; 