'use client';

import { useState } from 'react';
import BookForm, { BookFormData } from '@/components/BookForm';
import { useRouter } from 'next/navigation';

export default function CreateBookPage() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = (data: BookFormData) => {
    console.log('Mock submit:', data);
    setSubmitted(true);
    // TODO: Replace this with actual API call to create a book
    setTimeout(() => {
      router.push('/books');
    }, 1000);
  };

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Create a New Book</h1>
      {submitted ? (
        <p className="text-green-600 font-medium">Book submitted! Redirecting...</p>
      ) : (
        <BookForm onSubmit={handleSubmit} />
      )}
    </main>
  );
}
