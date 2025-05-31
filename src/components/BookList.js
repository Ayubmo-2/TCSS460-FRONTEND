const handleSearch = async (searchType, searchValue) => {
  try {
    setLoading(true);
    setError(null);
    let url = '';

    switch (searchType) {
      case 'title':
        url = `${API_BASE_URL}/books/retrieveTitle/${encodeURIComponent(searchValue)}`;
        break;
      case 'author':
        url = `${API_BASE_URL}/books/retrieveAuthor/${encodeURIComponent(searchValue)}`;
        break;
      case 'year':
        url = `${API_BASE_URL}/books/retrieveYear/${encodeURIComponent(searchValue)}`;
        break;
      case 'rating':
        url = `${API_BASE_URL}/books/retrieveRating/${encodeURIComponent(searchValue)}`;
        break;
      default:
        throw new Error('Invalid search type');
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const data = await response.json();
    
    // Process the books data
    const processedBooks = data.map(book => ({
      isbn13: book.isbn13,
      title: book.title,
      originalTitle: book.original_title,
      authors: book.authors,
      publicationYear: book.publication,
      averageRating: parseFloat(book.ratings.average),
      ratingCount: book.ratings.count,
      coverImage: book.icon.large || book.icon.small
    }));

    setBooks(processedBooks);
    setTotalBooks(processedBooks.length);
  } catch (err) {
    setError(err.message);
    setBooks([]);
    setTotalBooks(0);
  } finally {
    setLoading(false);
  }
}; 