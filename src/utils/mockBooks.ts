import { Book } from '../types/book';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.5,
    publishedYear: 1925,
    genre: 'Fiction',
    isbn: '978-0743273565',
    pageCount: 180,
    language: 'English',
    publisher: 'Scribner'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'The story of racial injustice and the loss of innocence in the American South.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9va3xlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.8,
    publishedYear: 1960,
    genre: 'Fiction',
    isbn: '978-0446310789',
    pageCount: 281,
    language: 'English',
    publisher: 'Grand Central Publishing'
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel and cautionary tale.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.7,
    publishedYear: 1949,
    genre: 'Science Fiction',
    isbn: '978-0451524935',
    pageCount: 328,
    language: 'English',
    publisher: 'Signet Classic'
  }
]; 