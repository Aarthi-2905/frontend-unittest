import {useState, useRef,useEffect} from 'react';
import { FaUserCircle, FaRobot } from 'react-icons/fa';
import { Button, Textarea,Popover } from "flowbite-react";
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';   
import {  HiX } from 'react-icons/hi';
import { useNavigate } from "react-router-dom";
import { uploadFile,userPrompt } from '../fetch/DashboardComp';
import { fetchStatus, setName, setRole } from '../utils/Auth';

const DashboardComp = () => {
    const navigate = useNavigate();
    //Holds the user input text
    const [inputText, setInputText] = useState("");
    // Indicates if an operation is in progress.
    const [isLoading, setIsLoading] = useState(false); 
    //Holds the conversation messages.
    const [messages, setMessages] = useState([]); 
    //Reference to the file input element.
    const fileInputRef = useRef(null);
    //Indicates if the token is verified.
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        const fetchUser = async () => {
            console.log('dashuser_token check ')
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            const response = await fetch('http://127.0.0.1:8000/login', requestOptions);
            const data = await response.json();
            // console.log(data)
            if (data) {
                localStorage.setItem("token", token);
                setRole(data['role']);
                setName(data['username']);
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

    const autoCloseToast = () => {
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000); // Auto-close after 10 seconds (4000ms)
    };

    //Checks and displays the login status.
    const loginStatus = fetchStatus();
    useEffect(() => {
        if (loginStatus === 'Loggedin Successfully') {
            setToast({ show: true, message: loginStatus, type: 'success' });
            autoCloseToast();
        }
    }, [loginStatus]);

    //Updates the inputText state with the user's input.
    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    //Simulates a click on the hidden file input.
    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    //Handles file selection, validates the file type, uploads the file, and displays appropriate notifications.
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const validExtensions = ['.pdf', '.xlsx', '.txt', '.pptx', '.docx','.csv'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
        if (!validExtensions.includes(fileExtension)) {
            setToast({
                show: true,
                message: 'Invalid file type. please upload .pdf,.xlsx,.txt,.pptx,.docx,.csv file.',
                type: 'error'
            });
            autoCloseToast();
            return;
        }
    
        const formData = new FormData();
        formData.append("files", file);
        localStorage.removeItem("status")
        setIsLoading(true);
        try {
            const data = await uploadFile(formData);
            setToast({
                show: true,
                message: data.detail || 'uploaded successfully!!',
                type: 'success'
            });
            autoCloseToast();
        } catch (error) {
            setToast({
                show: true,
                message: 'File upload failed!!',
                type: 'error'
            });
            autoCloseToast();
        } finally {
            setIsLoading(false);
        }
    };
    
    //Handles the form submission, sends the user's input to the server, and updates the conversation messages.
    const onSend = async (event) => {
        event.preventDefault();
        if (!inputText.trim()) {
            setToast({
                show: true,
                message: 'Please enter a prompt!',
                type: 'error'
            });
            autoCloseToast();
            return;
        }
        // Add the user prompt to the messages list
        setMessages(prevMessages => [...prevMessages, { user: 'user', response: inputText }]);
        setInputText(""); // Clear the input field
        setIsLoading(true);
        try {
            const data = await userPrompt(inputText);
            // const data = testmsg[1];
            // console.log(data.image);
            setMessages(prevMessages => [...prevMessages, { user: 'bot', response: data.response , details: data.detail,image : data.image}]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prevMessages => [...prevMessages, { user: 'bot', response: 'Text submission failed' }]);
        } finally {
            setIsLoading(false); 
        }
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
                    onClick={() => setToast({ show: false, message: '', type: '' })}>
                    <span className="sr-only">Close</span>
                    <HiX className="w-5 h-5" />
                </button>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center m-2">
            {/* Chat window and search box container */}
            <div className="w-full h-[calc(89vh)] flex flex-col justify-between shadow-custom-bottom rounded-lg 
                bg-gray-100 dark:bg-[rgb(16,23,42)] mb-10">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4  border-black"></div>
                    </div>
                )}
                {/* Chat window */}
                <div className="flex-1 p-4 overflow-y-auto max-h-[73vh] scrollbar scrollbar-track-slate-100
                    scrollbar-thumb-gray-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
                    <div className="flex flex-col space-y-3">
                        <div className="justify-center items-center mb-2">
                            {renderToast()}
                        </div>
                        {messages.map((message, index) => (
                            <div key={index} className="flex flex-col space-x-2 items-start">
                                <div className="flex items-center space-x-2 mx-10 text-gray-900 font-semibold">
                                    {message.user === 'user' ? (
                                        <FaUserCircle size={24} className="text-blue-500" />  
                                    ) : (
                                        <FaRobot size={24} className="text-green-500 " />  
                                    )}
                                    <div className="p-2 mb-2 rounded-lg shadow-custom-bottom dark:bg-slate-800
                                        dark:text-white  break-all w-fit">  
                                        {Array.isArray(message.image) && message.image.length > 0 && (
                                            <div className="flex flex-wrap gap-4">
                                                {message.image.map((imgSrc, imgIndex) => (
                                                    <img
                                                        key={imgIndex}
                                                        src={`data:image/png;base64,${imgSrc}`} 
                                                        alt={`Message related ${imgIndex}`}
                                                        style={{ width: '200px', height: '200px' }}
                                                        className="border border-gray-300 rounded-lg"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        <span>{message.response}</span>
                                        {message.details && (
                                            <div className="mt-2 flex justify-end">
                                                <Popover placement="right" 
                                                    content={
                                                        <div className="flex items-center justify-between content-between truncate text-center">
                                                            <p className='px-3 py-2'>{message.details}</p>
                                                        </div>
                                                    }
                                                >
                                                    <span className="text-blue-500 underline -ml-10 cursor-pointer text-xs">More details</span>
                                                </Popover>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Search box */}
                <div className="p-3">
                    <div className="flex items-center space-x-4">
                        <form onSubmit={onSend} className="flex w-full space-x-4">
                            <Textarea  type="text" placeholder="Enter a prompt.."
                                className="h-full overflow-y-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"
                                value={inputText} onChange={handleInputChange} 
                            />
                            <Button type="submit" className="rounded-lg items-center text-sm m-2" gradientMonochrome="success">
                                <FaPaperPlane />
                            </Button>
                        </form>
                        <FaPaperclip size={'22px'} className='text-green-500' onClick={handleFileClick}/>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }}
                            onChange={handleFileChange} accept=".pdf,.xlsx,.txt,.pptx"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardComp;

