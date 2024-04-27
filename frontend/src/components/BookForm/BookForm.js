import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { addBook, thunkFunction } from '../../redux/slices/booksSlice';
import {
    addBook,
    fetchBook,
    selectIsLoadingViaAPI,
} from '../../redux/slices/booksSlice';
import createBookWithId from '../../utils/createBookWithId';
import bookDate from '../../data/books.json';
import { setError } from '../../redux/slices/errorSlice';
import './BookForm.css';
// __________________________
const BookForm = () => {
    const [formDate, setFormDate] = useState({
        title: '',
        author: '',
    });
    // Переменная отражения загрузки для кнопки Add Random via API
    // Где меняется ее значение (setIsLoading)?
    // В ф-ции handleAddRandomBookViaAPI dispatch возвращает промисс
    // следовательно, мы можем использовать это состояние для
    // отображения загрузки и там выполнять setIsLoading
    // Можно перенести это в bookSlice (in the initialState)
    // const [isLoading, setIsLoading] = useState(false);
    // Тогда оттуда
    const isLoadingViaAPI = useSelector(selectIsLoadingViaAPI);
    // это передача ф-ции selectIsLoadingViaAPI
    // которая возвращает часть состояния из bookSlice
    // (state.books.isLoadingViaAPI)
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        // чтобы браузер не выполнял действие по умолчанию
        // (не перенаправлял на новую страницу)
        e.preventDefault();

        if (formDate.title && formDate.author) {
            dispatch(addBook(createBookWithId(formDate, 'manual')));
            // очищение полей ввода данных после отправки данных
            setFormDate({ ...formDate, title: '', author: '' });
        } else {
            dispatch(setError('You mast fill title fnd author!'));
        }
    };
    // Добавление случайно выбранной книги из файла
    const handleAddRandomBook = () => {
        const randomIndex = Math.floor(Math.random() * bookDate.length);
        const randomBook = bookDate[randomIndex];
        dispatch(addBook(createBookWithId(randomBook, 'random')));
    };
    // _______________________________________________________
    // const handleAddRandomBookViaAPI = async () => {
    //     try {
    //         const response = await axios.get(
    //             'http://localhost:4000/random-book'
    //         );
    //         if (response.data && response.data.title && response.data.author) {
    // здесь если response.data undefined то дальше выражение не анализируется и ошибка не возникает
    // если же мы уберем этот первый операнд, то (response.data - undefined) при анализе response.data.title
    // будет также undefined, но это уже вызовет ошибку в программе
    // А чтобы выражение корректно работало и при исключении операнда response.data
    // поступают так и при этом не возникает ошибки как при отсутствии самого ответа response, так и его содержимого
    // if (response?.data?.title && response?.data?.author) {
    //             dispatch(addBook(createBookWithId(response.data, 'API')));
    //         }
    //     } catch (error) {
    //         console.log('Error fetching', error);
    //     }
    // };
    // _____________________________________________________
    // Действия в выделенной выше процедуре можно передать redux следующим образом
    // const thunkFunction = async (dispatch, getState) => {
    //     console.log(getState());
    //     try {
    //         const response = await axios.get(
    //             'http://localhost:4000/random-book'
    //         );
    //         if (response.data && response.data.title && response.data.author) {
    //             dispatch(addBook(createBookWithId(response.data, 'API')));
    //         }
    //     } catch (error) {
    //         console.log('Error fetching', error);
    //     }
    //     console.log(getState());
    // };

    // const handleAddRandomBookViaAPI = () => {
    //     dispatch(thunkFunction);
    // };
    // И как видно по console.log(getState()) - все работает,
    // поэтому эту ф-цию можно передать в BookSlice
    // ___________________________________________________________
    // const handleAddRandomBookViaAPI = async () => {
    //     // Зачем здесь async await?
    //     // Мы подключили isLoading и нам надо получить промисс, т. е. ожидание или паузу,
    //     // чтобы на это время isLoading находился в состоянии true
    //     try {
    //         setIsLoading(true);
    //         await dispatch(
    //             fetchBook('http://localhost:4000/random-book-delayed')
    //         );
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    // ________________________________________________
    // Поскольку мы процедуру изменение isLoading... перенесли в bookSlice,
    // то здесь уже нам не надо менять это состояние и организовывать
    // async await. Переписываем верхнюю ф-цию
    const handleAddRandomBookViaAPI = () => {
        dispatch(fetchBook('http://localhost:4000/random-book-delayed'));
    };

    return (
        <div className="app-block book-form">
            <h2>Add a New Book</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={formDate.title}
                        onChange={(e) =>
                            setFormDate({ ...formDate, title: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label htmlFor="author">Author:</label>
                    <input
                        type="text"
                        id="author"
                        value={formDate.author}
                        onChange={(e) =>
                            setFormDate({ ...formDate, author: e.target.value })
                        }
                    />
                </div>
                <button type="submit">Add Book</button>
                <button type="button" onClick={handleAddRandomBook}>
                    Add Random
                </button>
                <button
                    type="button"
                    onClick={handleAddRandomBookViaAPI}
                    disabled={isLoadingViaAPI}
                >
                    {isLoadingViaAPI ? (
                        <>
                            <span>Loading book...</span>
                            <FaSpinner className="spinner" />
                        </>
                    ) : (
                        'Add Random via API'
                    )}
                </button>
            </form>
        </div>
    );
};
export default BookForm;
