import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { Button, Modal, Table, TextInput , Select} from 'flowbite-react';
import { HiOutlineExclamationCircle, HiSearch,HiX } from 'react-icons/hi';
import { deleteUser, editUserDetails, fetchUsers, addUser } from '../fetch/DashUsers';
import { useNavigate } from "react-router-dom";
import { setRole } from '../utils/Auth';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function DashUsers() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [emailToDelete, setEmailToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [editUser, setEditUser] = useState({ username: '', email: '', role: '' });
    const [newUser, setNewUser] = useState({ username: '', email: '', role: '', password: '', confirmPassword: '' });
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    //Toggles the visibility of the password.
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    console.log(token);

    //Toggles the state of showPassword to show or hide the password.
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

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

    //Loads user data and displays success messages from localStorage on component mount.
    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchUsers(); 
                if (!data) {
                    throw new Error('Network response was not ok');
                }
                setData(data);  
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setToast({
                    show: true,
                    message:  'Failed to fetch users:',
                    type: 'error'
                });
                autoCloseToast();
            } 
        }
        loadData();
        const editflashMessage = localStorage.getItem('editUser');
        if (editflashMessage) {
            localStorage.removeItem('editUser');
        }
    }, []);

    const columns = React.useMemo(
        () => [
            { Header: 'Date created', accessor: 'date' },
            { Header: 'Username', accessor: 'username' },
            { Header: 'Email', accessor: 'email' },
            { Header: 'Role', accessor: 'role' },
            {
                Header: 'Edit',
                Cell: ({ row }) => (
                <span className="font-medium text-green-500 hover:underline cursor-pointer"
                    onClick={() =>  openEditModal(row.original)}>
                    Edit
                </span>
                ),
            },
            {
                Header: 'Delete',
                Cell: ({ row }) => (
                <span className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => openConfirmModal(row.original.email)}>
                    Delete
                </span>
                ),
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, canPreviousPage, 
            canNextPage, pageOptions,state: { pageIndex, globalFilter }, setGlobalFilter,  nextPage,
            previousPage,
    } = useTable(
            {
                columns,data,initialState: { pageIndex: 0 },
            },
        useGlobalFilter, usePagination
    );

    const openConfirmModal = (email) => {
        setEmailToDelete(email);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setEmailToDelete(null);
    };

    const handleDelete = async () => {
        try {
            const data = await deleteUser(emailToDelete);
            if (!data) {
                throw new Error('Network response was not ok');
            }
            setData(prevData => prevData.filter(user => user.email !== emailToDelete));
            closeConfirmModal();
            setToast({
                show: true,
                message: data.detail || 'deleted successfully',
                type: 'success'
            });
            autoCloseToast();
        } catch (error) {
            // console.error("Failed to delete user:", error);
            setToast({
                show: true,
                message:  'Failed to delete user',
                type: 'error'
            });
            autoCloseToast();
        }
    };

    const openEditModal = (user) => {
        setEditUser(user);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditUser({ username: '', email: '', role: '' });
    };

    const handleEdit = async (event) => {
        event.preventDefault();
        if (editUser.email === '' || editUser.username === '' || editUser.role === '') {
            setToast({
                show: true,
                message: 'Email, Username, and Role cannot be empty',
                type: 'error'
            });
            autoCloseToast();
            return;
        }
        try {
            const data = await editUserDetails(editUser);
            if (!data) {
                throw new Error('Network response was not ok');
            }
            localStorage.setItem('editUser', data.detail);
            setToast({
                show: true,
                message: data.detail || 'Updated user details successfully',
                type: 'success'
            });
            autoCloseToast();
            window.location.reload();
        } catch (error) {
            setToast({
                show: true,
                message:  'Failed to Update user details',
                type: 'error'
            });
            autoCloseToast();
        }
        closeEditModal();
    };

    const openAddUserModal = () => {
        setIsAddUserModalOpen(true);
    };

    const closeAddUserModal = () => {
        setIsAddUserModalOpen(false);
        setNewUser({ username: '', email: '', role: '', password: '', confirmPassword: '' });
    };

    const handleAddUser = async (event) => {
        event.preventDefault();
        // Perform any necessary validation
        if (newUser.password !== newUser.confirmPassword) {
            console.log("Passwords do not match");
            setToast({
                show: true,
                message: 'Passwords do not match',
                type: 'error'
            });
            autoCloseToast();
            return;
        }
        if (newUser.email === '' || newUser.username === '' || newUser.role === '' || 
                newUser.password === '' || newUser.confirmPassword === '') {
            setToast({
                show: true,
                message: 'Email, Username, and Role cannot be empty',
                type: 'error'
            });
            autoCloseToast();
            return;
        }
    
        try {
            newUser.added_date = "";
            const {confirmPassword, ...userWithoutConfirmPassword} = newUser;
            const data = await addUser(userWithoutConfirmPassword);
            if (!data) {
                throw new Error('Network response was not ok');
            }
            setData((prevData) => [...prevData, data]);
            setToast({
                show: true,
                message: data.detail ||  'User added successfully',
                type: 'success'
            });
            autoCloseToast();
            window.location.reload();
        } catch (error) {
            console.error('Error adding user:', error);
            setToast({
                show: true,
                message:  'Failed to adding User',
                type: 'success'
            });
            autoCloseToast();
        }
        closeAddUserModal();
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
            <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex p-4 rounded-lg ${alertStyle} mt-5 max-w-lg w-full`}
                role="alert" style={{ zIndex: 9999 }} >
                <div className="ml-3 text-sm font-medium">
                    {toast.message}
                </div>
                <button type="button" aria-label="Close"
                    className="ml-auto -mx-1.5 -my-1.5 text-red-600 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8"
                    onClick={() => setToast({ show: false, message: '', type: '' })}
                >
                    <span className="sr-only">Close</span>
                    <HiX className="w-5 h-5" />
                </button>
            </div>
        );
    };
    return (
        <div className="table-auto w-[83vw] md:mx-auto p-3">
            <div className="flex justify-between mb-4">
           
                <Button gradientMonochrome="success" className="shadow-custom-bottom" onClick={openAddUserModal}>
                    Add User
                </Button>
                <TextInput value={globalFilter || ''}  placeholder="Search users"  icon={HiSearch}
                    onChange={(e) => setGlobalFilter(e.target.value || undefined)}
                    className="max-w-md rounded-lg shadow-custom-bottom"
                />
            </div>
            <div className='justify-centre items-center mb-4'>
                {renderToast()}
            </div>
            <Table hoverable className="shadow-md">
                <Table.Head>
                    <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 dark:text-white'>Date created</Table.HeadCell>
                    <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 dark:text-white'>Username</Table.HeadCell>
                    <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 dark:text-white'>Email</Table.HeadCell>
                    <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 dark:text-white'>Role</Table.HeadCell>
                    <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 dark:text-white'>Edit</Table.HeadCell>
                    <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 dark:text-white'>Delete</Table.HeadCell>
                </Table.Head>
                <Table.Body {...getTableBodyProps()} className="divide-y">
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <Table.Row key={row.id} className="bg-white text-gray-800 dark:text-gray-200 dark:border-gray-700 dark:bg-gray-800">
                                {row.cells.map((cell) => {
                                    const { key, ...cellProps } = cell.getCellProps(); // Destructure to remove the key
                                    return (
                                        <Table.Cell key={cell.column.id} {...cellProps}>
                                        {cell.render('Cell')}
                                        </Table.Cell>
                                    );
                                })}
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
            <div className="flex justify-end items-center mt-4 gap-3">
                <Button onClick={() => previousPage()} disabled={!canPreviousPage} 
                    gradientDuoTone="purpleToBlue" outline >
                    Previous    
                </Button>
                <span> Page {pageIndex + 1} of {pageOptions.length} </span>
                <Button onClick={() => nextPage()} disabled={!canNextPage} gradientDuoTone="purpleToBlue" outline>
                    Next
                </Button>
            </div>

            <Modal show={isConfirmModalOpen} onClose={closeConfirmModal} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this user?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDelete}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={closeConfirmModal}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Edit User Modal */}
            <Modal show={isEditModalOpen} onClose={closeEditModal} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h3 className="mb-5 text-lg text-gray-700 font-semibold dark:text-gray-400">
                            Edit User
                        </h3>
                        <TextInput value={editUser.username}  placeholder="Username" className="mb-4"
                            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}/>
                        <TextInput value={editUser.email} placeholder="Email" className="mb-4"
                            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}/>
                        <Select value={editUser.role} className="mb-4" onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </Select>
                        <div className="flex justify-center gap-4">
                            <Button  gradientMonochrome="success" onClick={handleEdit}>
                                Save Changes
                            </Button>
                            <Button color="gray" onClick={closeEditModal}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Add User Modal */}
            <Modal show={isAddUserModalOpen} onClose={closeAddUserModal} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h3 className="mb-5 text-lg text-gray-700 font-semibold dark:text-gray-400">
                            Add User
                        </h3>
                        <TextInput value={newUser.username} placeholder="Username" className="mb-4"
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}/>
                        <TextInput value={newUser.email} placeholder="Email" className="mb-4"
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                        <Select value={newUser.role} className="mb-4"
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                            <option value="" selected>Select Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </Select>

                        <div className="relative">
                            <TextInput type={showPassword ? "text" : "password"}
                                placeholder="Password" value={newUser.password} id="password" className="mb-4"  
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                            <span onClick={handleTogglePassword}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className="relative">
                            <TextInput type={showPassword ? "text" : "password"}
                                placeholder="Confirm Password" value={newUser.confirmPassword} className="mb-4" 
                                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                            />
                            <span onClick={handleTogglePassword}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button gradientMonochrome="success" onClick={handleAddUser}>
                                Add User
                            </Button>
                            <Button color="gray" onClick={closeAddUserModal}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

