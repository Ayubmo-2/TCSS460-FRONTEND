import Link from 'next/link';
import mockBooks from '@/data/mockBooks';

export default function BooksPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockBooks.map((book) => (
          <div key={book.id} className="border rounded-lg p-4 shadow">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="text-sm text-gray-600">{book.author}</p>
            <Link
              href={`/books/${book.id}`}
              className="text-blue-600 hover:underline mt-2 inline-block text-sm"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
