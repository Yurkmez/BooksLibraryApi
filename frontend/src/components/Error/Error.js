// Для обработки ошибок есть готовый пакет "react-toastify"
//  создается отдельный компоненти вызывается к-дой toast
// в любом месте приложения
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, selectErrorMessage } from '../../redux/slices/errorSlice';
import 'react-toastify/dist/ReactToastify.css';

const Error = () => {
    // toast.info('Test message');
    // toast.warn('Test message');
    const errorMesage = useSelector(selectErrorMessage);
    const dispatch = useDispatch();

    useEffect(() => {
        if (errorMesage) {
            toast.info(errorMesage);
            dispatch(clearError());
        }
    }, [errorMesage, dispatch]);

    return <ToastContainer position="top-right" autoClose={2000} />;
};
export default Error;
