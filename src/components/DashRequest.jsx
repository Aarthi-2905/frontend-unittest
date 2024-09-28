
import React, { useState,useEffect  } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { Modal, Table, Button, TextInput } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiSearch, HiX } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { approveFile, fetchFiles, rejectFile } from '../fetch/DashRequest';

export function SearchBar({ globalFilter, setGlobalFilter }) {
    return (
        <div className="flex max-w-xs rounded-lg shadow-custom-bottom">
        <TextInput id="search" type="search" placeholder="Search files" value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value || undefined)} required icon={HiSearch}
        />
        </div>
    );
}

export default function DashRequest() {
    const [data, setData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    //Loads user data and displays success messages from localStorage on component mount.
    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchFiles(); 
                if (!data) {
                    throw new Error('Network response was not ok');
             
                }
                setData(data['detail']);
            } catch (error) {
                setToast({
                    show: true,
                    message:'Failed to fetch details',
                    type: 'error'
                });
                autoCloseToast();
                console.error("Failed to fetch users:", error);
            }
        }
        loadData();
    }, []);

    const handleFileClick = async (file) => {
        setSelectedFile(file.file_name);
        try {
            const urlValue = `http://localhost:5173/user_uploads/${file.file_name}`;
            // Fetch the file as a Blob
            fetch(urlValue)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const blobURL = window.URL.createObjectURL(blob);
                    const fileName = file.file_name;
        
                    const anchorTag = document.createElement('a');
                    anchorTag.href = blobURL;
                    anchorTag.download = fileName;
                    document.body.appendChild(anchorTag);
                    anchorTag.click();
                    document.body.removeChild(anchorTag);
                    window.URL.revokeObjectURL(blobURL);
                })
                .catch(error => {
                    console.error("Failed to download file:", error);
                });
    
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to download file:", error);
        }
    };
    
    const handleApprove = async (selectedFile) => {
        console.log(selectedFile);
        try {
            const response = await approveFile(selectedFile);
            if (!response) {
                throw new Error('Network response was not ok');
            }
            setToast({
                show: true,
                message: response.detail || 'File approved successfully.',
                type: 'success'
            });
            autoCloseToast();
            window.location.reload();
        } catch (error) {
            setToast({
                show: true,
                message:  'Error approving the file.',
                type: 'error'
            });
            autoCloseToast();
        }
        setIsModalOpen(false);
    };

    const handleReject = async (selectedFile) => {
        try {
            const response = await rejectFile(selectedFile);
            if (!response) {
                throw new Error('Network response was not ok');
            }
            setToast({
                show: true,
                message: response.detail || 'File Removed successfully.',
                type: 'success'
            });
            autoCloseToast();
            window.location.reload();
        } catch (error) {
            setToast({
                show: true,
                message: 'Error Removing the file.',
                type: 'error'
            });
            autoCloseToast();
        }
        setIsModalOpen(false);
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Requested Files',
                accessor: 'file_name',
                Cell: ({ row }) => (
                <span
                    className="cursor-pointer text-blue-500 hover:underline"
                    onClick={() => handleFileClick(row.original)}
                >
                    {row.original.file_name}
                </span>
                ),
            },
            {
                Header: 'User Name',
                Cell: ({ row }) => (
                    <span>
                        {row.original.email}
                    </span>
                ),
            },
            {
                Header: 'Approve',
                Cell: ({ row }) => (
                <FaCheck
                    className="text-green-500 cursor-pointer"
                    onClick={() => handleApprove(row.original.file_name)}
                />
                ),
            },
            {
                Header: 'Reject',
                Cell: ({ row }) => (
                <FaTimes
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleReject(row.original.file_name)}
                />
                ),
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, prepareRow,
        page, canPreviousPage, canNextPage, pageOptions,
        state: { pageIndex, globalFilter }, setGlobalFilter,nextPage, previousPage,
    } = useTable(
        {
            columns,data, initialState: { pageIndex: 0 },
        },
        useGlobalFilter,
        usePagination
    );

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
        <div className='table-auto w-[50vw] items-center justify-center md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            <div className='flex justify-between mb-4'>
                <SearchBar globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            </div>
            <div className='justify-centre items-center mb-4'>
                {renderToast()}
            </div>
            <Table hoverable className='shadow-custom-bottom rounded-lg' {...getTableProps()}>
                <Table.Head>
                    <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 dark:text-white'>Requested files</Table.HeadCell>
                    <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 dark:text-white'>User Name</Table.HeadCell>
                    <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 dark:text-white'>Approve</Table.HeadCell>
                    <Table.HeadCell className='bg-gray-200 dark:bg-gray-700 dark:text-white'>Reject</Table.HeadCell>
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
            <div className='flex justify-end items-center mt-4 gap-3'>
                <Button onClick={() => previousPage()} disabled={!canPreviousPage} gradientDuoTone="purpleToBlue" outline>
                    Previous
                </Button>
                <span> Page {pageIndex + 1} of {pageOptions.length} </span>
                <Button onClick={() => nextPage()} disabled={!canNextPage} gradientDuoTone="purpleToBlue" outline>
                    Next
                </Button>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    {selectedFile && (
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                            <h3 className='mb-2 text-lg text-gray-500 dark:text-gray-400'>{selectedFile}</h3>
                            <div className='flex justify-center gap-4'>
                                <Button gradientMonochrome='success' onClick={() =>handleApprove(selectedFile)}>
                                    Approve
                                </Button>
                                <Button gradientMonochrome='failure' onClick={() =>handleReject(selectedFile)}>
                                    Decline
                                </Button>
                            </div>
                        </div>  
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}
