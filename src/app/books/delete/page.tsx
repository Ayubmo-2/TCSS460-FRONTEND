'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteBookDesign() {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setConfirming(true);
  };

  const handleCancel = () => {
    setConfirming(false);
  };

  const handleConfirm = () => {
    // Placeholder: no actual delete functionality
    alert('Delete confirmed (design only — no backend call made).');
    router.push('/books');
  };

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Delete Book (Design Only)</h1>
      {!confirming ? (
        <button
          onClick={handleDeleteClick}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Book
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-red-700 font-semibold">Are you sure you want to delete this book?</p>
          <div className="flex space-x-4">
            <button
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Confirm
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
