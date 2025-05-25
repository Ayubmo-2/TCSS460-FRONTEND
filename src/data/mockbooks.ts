export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  year: number;
  genre: string;
}

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A novel about the American dream...',
    coverImage: '/assets/images/landing/gatsby.jpg',
    year: 1925,
    genre: 'Classic',
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian novel set in a totalitarian regime...',
    coverImage: '/assets/images/landing/1984.jpg',
    year: 1949,
    genre: 'Dystopian',
  },
];

export default mockBooks;
