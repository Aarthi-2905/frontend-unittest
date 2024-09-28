import { Sidebar, Modal, Button } from 'flowbite-react';
import { HiUser,HiArrowSmRight,HiOutlineUserGroup,HiAnnotation,HiOutlineExclamationCircle} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';
import { logout, setStatus } from "../utils/Auth";

export default function DashSidebar() {
    const [tab, setTab] = useState('');
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const userrole = useState(localStorage.getItem('role'));
    const [token, setToken] = useState(localStorage.getItem('token'));

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
                localStorage.setItem("role", data['role']);
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
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleSignOut = () => {
        logout();
        setShowSignOutModal(false);
        navigate('/');
        setStatus('Signout Successfully');
    };

    const activeStyle = 'bg-gray-200 dark:bg-gray-600 font-semibold'; // Active tab style
    const inactiveStyle = 'hover:bg-gray-100'; // Inactive tab hover style

    return (
        <>
            <Sidebar className='w-full md:w-56 border-b-2 border-slate-400 shadow-custom-bottom flex flex-col'>
                <Sidebar.Items className='flex flex-col h-full'>
                    <Sidebar.ItemGroup className='flex flex-col gap-1'>
                        <Link to='/dashboard?tab=dash'>
                            <Sidebar.Item className={`${tab === 'dash' || !tab ? activeStyle : inactiveStyle}`}
                                icon={FaRobot} as='div'>
                                Chat Interface
                            </Sidebar.Item>
                        </Link>
                        {localStorage.getItem('role') === 'super_admin' && (
                            <>
                                <Link to='/dashboard?tab=users'>
                                    <Sidebar.Item className={`${tab === 'users' ? activeStyle : inactiveStyle}`}
                                        icon={HiOutlineUserGroup} as='div'>
                                        User Management
                                    </Sidebar.Item>
                                </Link>
                                <Link to='/dashboard?tab=requests'>
                                    <Sidebar.Item className={`${tab === 'requests' ? activeStyle : inactiveStyle}`}
                                        icon={HiAnnotation} as='div'>
                                        Requested Files
                                    </Sidebar.Item>
                                </Link>
                            </>
                        )}
                        <div className='fixed bottom-3'>
                            <Link to='/dashboard?tab=profile'>
                                <Sidebar.Item  className={`${tab === 'profile' ? activeStyle : inactiveStyle}`}
                                    icon={HiUser} label={userrole} labelColor='dark' as='div'>
                                    Profile
                                </Sidebar.Item>
                            </Link>
                            <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer'
                                onClick={() => setShowSignOutModal(true)}>
                                Sign Out
                            </Sidebar.Item>
                        </div> 
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>

            <Modal show={showSignOutModal} onClose={() => setShowSignOutModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to sign out?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleSignOut}>
                                Yes, Sign Out
                            </Button>
                            <Button color='gray' onClick={() => setShowSignOutModal(false)}>
                                No, Stay
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

