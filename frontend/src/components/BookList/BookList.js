import { useSelector, useDispatch } from 'react-redux';
import { BsBookmarkStar, BsBookmarkStarFill } from 'react-icons/bs';
import {
    deleteBook,
    toggleFavorite,
    selectBooks,
} from '../../redux/slices/booksSlice';
import './BookList.css';
import {
    selectTitleFilter,
    selectAuthorFilter,
    selectOnlyFavoriteFilter,
} from '../../redux/slices/filterSlice';

const BookList = () => {
    // Здесь мы подписываемся на состояние "books" и др.
    const books = useSelector(selectBooks);
    const titleFilter = useSelector(selectTitleFilter);
    const authorFilter = useSelector(selectAuthorFilter);
    const onlyfavoriteFilter = useSelector(selectOnlyFavoriteFilter);

    const dispatch = useDispatch();

    const handleTggleFavorite = (id) => {
        dispatch(toggleFavorite(id));
    };

    const handleDeleteBook = (id) => {
        dispatch(deleteBook(id));
    };

    const filteredBooks = books.filter((book) => {
        const matchesTitle = book.title
            .toLowerCase()
            .includes(titleFilter.toLowerCase());
        const matchesAuthor = book.author
            .toLowerCase()
            .includes(authorFilter.toLowerCase());
        const matchesFavorite = onlyfavoriteFilter ? book.isFavorite : true;

        return matchesTitle && matchesAuthor && matchesFavorite;
    });

    // Ф=ция подсветки текста, введенного в поля фильтра
    const highlightMatch = (text, filter) => {
        if (!filter) return text;
        // регулярное выражение (filter - это та часть строки,
        // которую мы ищем в тексте, (gi), g - означает "глобально", т..е.
        // все найденные совпадения, i- не обращая на регистр)
        // regex - возвращает массив, разделенный по условию split(regex)
        const regex = new RegExp(`(${filter})`, 'gi');
        // подсветка текста выполняется за счет map
        return text.split(regex).map((substring, i) => {
            if (substring.toLowerCase() === filter.toLowerCase()) {
                return (
                    <spain key={i} className="highlight">
                        {substring}
                    </spain>
                );
            }
            return substring;
        });
    };

    return (
        <div className="app-block book-list">
            <h2>Book List</h2>
            {books.length === 0 ? (
                <p>No books avialable</p>
            ) : (
                <ul>
                    {filteredBooks.map((book, i) => (
                        <li key={book.id}>
                            <div className="book-info">
                                {++i}. {highlightMatch(book.title, titleFilter)}{' '}
                                by{' '}
                                <strong>
                                    {highlightMatch(book.author, authorFilter)}
                                </strong>{' '}
                                ({book.source})
                            </div>
                            <div className="book-actions">
                                <span
                                    onClick={() => handleTggleFavorite(book.id)}
                                >
                                    {book.isFavorite ? (
                                        <BsBookmarkStarFill className="star-icon" />
                                    ) : (
                                        <BsBookmarkStar className="star-icon" />
                                    )}
                                </span>
                                <button
                                    onClick={() => handleDeleteBook(book.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookList;
