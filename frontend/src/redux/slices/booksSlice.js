import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setError } from './errorSlice';
import createBookWithId from '../../utils/createBookWithId';

const initialState = {
    books: [],
    isLoadingViaAPI: false,
};

export const fetchBook = createAsyncThunk(
    'books/fetchBook',
    async (url, thunkAPI) => {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            thunkAPI.dispatch(setError(error.message));
            // но, если возникает ошибка, то программа выполняется дальше и выполняется "extraReducers: (builder) => туда попадает payload - undefined, а запрос остается в режиме pending что ним не надо, поэтому добавляем
            // throw error;
            // throw error можно заменить на аналогичное действо
            return thunkAPI.rejectWithValue(error);
            // и тогда возникает rejected
        }
    }
);
const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        addBook: (state, action) => {
            state.books.push(action.payload);
        },
        deleteBook: (state, action) => {
            return {
                ...state,
                books: state.books.filter((book) => book.id !== action.payload),
            };
        },
        // можно и иначе (но кода много)
        // const index = state.findIndex(book) => book.id === action.payload)
        // if (index !== -1) {
        //     state.splice(index, 1)
        //     // splice - удаляет (1) элемент начиная с определенного индекса
        // }
        // }
        toggleFavorite: (state, action) => {
            // return state.map((book) =>
            // book.id === action.payload
            //         ? { ...book, isFavorite: !book.isFavorite }
            //         : book
            // );
            // можно и иначе
            state.books.forEach((book) => {
                if (book.id === action.payload) {
                    book.isFavorite = !book.isFavorite;
                }
            });
        },
    },

    // extraReducers - как объект
    // extraReducers: {
    //     // квадратные скобки - если это вычисляемое значение
    //     [fetchBook.pending]: (state) => {
    //         state.isLoadingViaAPI = true;
    //     },
    //     [fetchBook.fulfilled]: (state, action) => {
    //         state.isLoadingViaAPI = false;
    //         if (action.payload.title && action.payload.author) {
    //             state.books.push(createBookWithId(action.payload, 'API'));
    //         }
    //     },
    //     [fetchBook.rejected]: (state) => {
    //         state.isLoadingViaAPI = false;
    //     },
    // },

    // extraReducers - как ф-ция
    extraReducers: (builder) => {
        builder.addCase(fetchBook.pending, (state) => {
            state.isLoadingViaAPI = true;
        });
        builder.addCase(fetchBook.fulfilled, (state, action) => {
            state.isLoadingViaAPI = false;
            if (action.payload.title && action.payload.author) {
                state.books.push(createBookWithId(action.payload, 'API'));
            }
        });
        builder.addCase(fetchBook.rejected, (state) => {
            state.isLoadingViaAPI = false;
        });
    },
    // _____
    // Возможен вариант таим образом обрабатывать ошибки Но можно создать отдельный редюсер, что и будет реализовано в следующих коммитах
    // builder.addCase(fetchBook.rejected, (state, action) => {
    //     console.log(action);
    // здесь можно было бы вызывть ф-цию set Error() но это противоречит принципу чистой ф-ции которой должен быть редьюсер, поэтому вся эта часть убирается
    // });
    // ______________________________________________
});

export const { addBook, deleteBook, toggleFavorite } = booksSlice.actions;
// Т. к., мы используем addBook в этой ф-ции, то мы ее размещаем ниже
// ее экспорта
// Дальнейшее развитие. Так как она не интегрирована в booksSlice, поэтому
// экспортируем createAsyncThunk и формируем fetchBook, экспортируем ее
// и вызываем в BookForm ее.
// export const thunkFunction = async (dispatch, getState) => {
//     try {
//         const response = await axios.get('http://localhost:4000/random-book');
//         if (response.data && response.data.title && response.data.author) {
//             dispatch(addBook(createBookWithId(response.data, 'API')));
//         }
//     } catch (error) {
//         console.log('Error fetching', error);
//     }
// };
export const selectBooks = (state) => state.books.books;
export const selectIsLoadingViaAPI = (state) => state.books.isLoadingViaAPI;
export default booksSlice.reducer;
