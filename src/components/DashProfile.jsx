import { Button, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiUserCircle,HiX } from 'react-icons/hi';

export default function DashProfile() {
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [editUser, setEditUser] = useState({ username: '', email: '' });
    const token = localStorage.getItem('token');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch('http://localhost:8000/login',{
                method : 'GET',
                headers : {
                    'content-type' : 'application/json',
                    Authorization: "Bearer " + token,
                },
            }); 
            if (!response) {
                throw new Error('Network response was not ok');
            }
        
            const data = await response.json();
            if (data) {
                setUserData({ username: data.name, email: data.email });
                setEditUser({ username: data.name, email: data.email }); 
            }
        };
        fetchUserData();
    }, [token]);

    const handleEditClick = () => {
        setShowModal(true);
        setEditUser({ username: userData.username, email: userData.email }); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/users/edit/profile',{
            method : 'PUT',
            headers : {
                'content-type' : 'application/json',
                Authorization: "Bearer " + token,
            },
            body : JSON.stringify(editUser),
        });
        if (response) {
            const updatedData = await response.json();
            // setUserData({ username: updatedData.username, email: updatedData.email });
            setShowModal(false);
            setToast({
                show: true,
                message: updatedData.detail,
                type: 'success'
            });
           console.log('File approved successfully.');
           autoCloseToast();
           window.location.reload();
        } else{
            setToast({
                show: true,
                message: 'Failed to Update',
                type: 'error'
            });
            autoCloseToast();
        }
    };
    const autoCloseToast = () => {
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000); // Auto-close after 10 seconds (10000ms)
    };
    const renderToast = () => {
        if (!toast.show) return null;
        const alertStyle = toast.type === 'success'
            ? 'bg-green-100 text-green-600 border-t-4 border-green-400 shadow-lg'
            : 'bg-red-100 text-red-600 border-t-4 border-red-400 shadow-lg';
    
        return (
            <div  role="alert" style={{ zIndex: 9999 }}
                className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex p-4 rounded-lg ${alertStyle} mt-5 max-w-lg w-full`}
            >
                <div className="ml-3 text-sm font-medium">
                    {toast.message}
                </div>
                <button type="button" aria-label="Close"
                    className="ml-auto -mx-1.5 -my-1.5 text-red-600 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8"
                    onClick={() => setToast({ show: false, message: '', type: '' })}>
                    <span className="sr-only">Close</span>
                    <HiX className="w-5 h-5" />
                </button>
            </div>
        );
    };
  
    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <div className='justify-centre items-center mb-4'>
                {renderToast()}
            </div>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4'>
                <div className='mb-10 self-center cursor-pointer shadow-md overflow-hidden rounded-full text-gray-500'>
                    <HiUserCircle className='w-32 h-32' />
                </div>
                <label className="block  font-medium ml-44">
                    <span className='font-bold text-lg'>Username</span> <span className="text-lg  "> : {userData.username}</span>
                    <span onClick={handleEditClick} className='cursor-pointer ml-5 text-green-400 font-bold' > Edit</span>
                </label>
                <label className="block  font-medium ml-44">
                    <span className='font-bold text-lg'>Email</span> <span className="text-lg  "> : {userData.email}</span>
                </label>
            </form>
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <form onSubmit={handleSubmit} className='text-center'>
                        <h3 className="mb-5 text-lg text-gray-700 font-semibold dark:text-gray-400">
                            Edit User
                        </h3>
                        <TextInput value={editUser.username} placeholder="Username" className="mb-4"
                            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                        />
                        <TextInput type='email' value={editUser.email} placeholder="Email" className="mb-4 hidden"
                            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} 
                        />
                        <Button type='submit' color='success' className="ml-32 justify-center"> Save</Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
