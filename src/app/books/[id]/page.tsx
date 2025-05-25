import { notFound } from 'next/navigation';
import mockBooks from '@/data/mockBooks';

interface Props {
  params: { id: string };
}

export default function BookDetailPage({ params }: Props) {
  const book = mockBooks.find((b) => b.id === params.id);

  if (!book) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-64 h-auto rounded mb-4"
      />
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Year:</strong> {book.year}</p>
      <p className="mt-4">{book.description}</p>
    </div>
  );
}
