'use client';

import { useState } from 'react';

export type BookFormData = {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description: string;
  imageUrl: string;
};

type Props = {
  onSubmit: (data: BookFormData) => void;
};

export default function BookForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    description: '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Author</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Genre</label>
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">ISBN</label>
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Image URL</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}
