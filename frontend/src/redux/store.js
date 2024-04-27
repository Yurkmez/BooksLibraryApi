import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './slices/booksSlice';
import filterReducer from './slices/filterSlice';
import errorReducer from './slices/errorSlice';
const store = configureStore({
    reducer: {
        books: booksReducer,
        filter: filterReducer,
        error: errorReducer,
    },
});

export default store;

// Как работает редюсер.
// В BookForm мы передаем в store (через dispatch) ф-цию addBook,
// передавая туда объект book и которая возвращает
// type: ADD_BOOK и
// payload: newBook (по сути book - объект.)
// В store в reducer мы связывем books: booksReducer, а в последнем
// предполагается 2 параметра: состояние и действие.
// Получается, что результат вызова ф-ции addBook
// (по умолчанию) передают в booksReducer 2 параметра действия (action):
//  -  это type и payload, которые у нас:
// type -  ADD_BOOK,
// payload - newBook (по сути book - объект.)
// В booksReducer состояние есть (изначально пустой массив
//  и при вызове проверяется условие в type и по нему выполняется действие
// [...state, action.payload], т. е. выполняется спред операция над массивом
// и по результату меняется состояние - туда добавляется (удаляется пр.) книга,
// что и возвращается return [...state, action.payload]
// В результате, объект books магазина store находится в обновленном состоянии
