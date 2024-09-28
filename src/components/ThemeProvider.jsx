import { useSelector } from 'react-redux';

export default function Theme({ children }) {
    const { theme } = useSelector((state) => state.theme);
    return (
        <div className={theme}>
            <div className='bg-customColor  text-gray-700 dark:text-gray-400 dark:bg-[rgb(16,23,42)] min-h-screen'>
                {children}
            </div>
        </div>
    );
}