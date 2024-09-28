import { Button, Navbar, NavbarCollapse, NavbarToggle, Popover } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { varphilogo } from '../assets/index.js';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaMoon, FaSun, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
// import { setRole } from "../utils/Auth.jsx";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector((state) => state.theme);
    const [notifications, setNotifications] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));

     useEffect(() => {
        const fetchUser = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
    
            const response = await fetch('http://127.0.0.1:8000/login', requestOptions);
            const data = await response.json();
            if (data) {
                localStorage.setItem("token", token);
                setRole(data['role']);
                return true;
            } else {
                console.log("Token verification failed");
                setToken(null);
                navigate('/');
                return null;
            }
        };
        fetchUser();
    }, [token]);

    useEffect(() => {
        const notification = async () => {
            try {
                const response = await fetch('http://localhost:8000/notifications', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                        Authorization: "Bearer " + token,
                },
                });
                if (!response.ok) {
                    throw new Error('Text submission failed');
                }
                const data = await response.json();
                const returnValue = data.detail.map(item => `${item.file_name} from ${item.from} was ${item.status}`);
                setNotifications(returnValue);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        notification();
    }, []);

    const clearNotification = async (index) => {
        const notificationToRemove = notifications[index];
        try {
            const response = await fetch('http://localhost:8000/notifications/read_one', {
                method : "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,
                },
                body : JSON.stringify({"file_name" : notificationToRemove.split(" from ")[0], "email" : notificationToRemove.split(" from ")[1]})
            });
            setNotifications(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('error:', error);
        }
    };
    const clearAllNotifications = async () => {
        try {
            const response = await fetch('http://localhost:8000/notifications/read_all', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({}) 
            });
            if (!response.ok) {
                throw new Error('Failed to clear notifications');
            }
            setNotifications([]); 
        } catch (error) {
            console.error('Error clearing all notifications:', error);
        }
    };

    return (
        <Navbar className='border-b-2 border-slate-400 shadow-custom-bottom'>
            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white inline-flex mt-2 pl-5'>
                <span>
                    <img src={varphilogo} alt='logo' className='m-0 w-[50px] h-[px] px-2' />
                </span>
                Varphi KBI
            </Link>
            <div className='flex gap-2 md:order-2 pr-6'>
                {role !== 'admin' && (
                    <Popover aria-labelledby="notification-popover"
                        content={
                            <div className="w-64 p-3">
                                <div className="mb-3 flex justify-between ">
                                    <span className="font-semibold text-gray-900 dark:text-white">Notifications</span>
                                    <Button onClick={clearAllNotifications} color='gray' size={'22px'} 
                                        className="text-xs text-blue-500 dark:text-blue-500 px-2">
                                        Clear All
                                    </Button>
                                </div>
                                <ul>
                                    {notifications.map((notification, index) => (
                                        <li key={index} className="mb-2 flex justify-between items-center ">
                                            <span className="text-sm text-gray-700 dark:text-gray-200 mt-3 p-3 break-all">{notification}</span>
                                            <FaTimes className="text-gray-400 hover:text-red-500 cursor-pointer flex-shrink-0"
                                                onClick={() => clearNotification(index)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                                {notifications.length === 0 && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400">No new notifications</div>
                                )}
                            </div>
                        }
                    >
                        <Button className='w-15 h-10 hidden sm:inline py-0 focus:ring-4 focus:ring-sky-400 focus:outline-none' color='gray' pill>
                            <FaBell />
                            {notifications.length > 0 && (
                                <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
                                    {notifications.length}
                                </span>
                            )}
                        </Button>
                    </Popover>
                )}
                <Button className='w-15 h-10 hidden sm:inline py-0'
                    color='gray' pill onClick={() => dispatch(toggleTheme())}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>
                <NavbarToggle></NavbarToggle>
            </div>
        </Navbar>
    );
};

export default Header;
