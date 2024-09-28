import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';
import DashRequest from '../components/DashRequest';
import DashProfile from '../components/DashProfile';
import DashHeader from '../components/DashHeader';
import { setRole } from '../utils/Auth';

export default function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');

    const [token, setToken] = useState(localStorage.getItem('token'));
    console.log(token);

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
        if (!tab) {
            navigate('/dashboard?tab=dash');
        }
    }, [tab, navigate]);
   
    return (
        <>
            <DashHeader />
            <div className='min-h-screen flex flex-col md:flex-row'>
                <div className='md:w-56 '>
                    <DashSidebar />
                </div>
                {tab === 'users' && <DashUsers />}
                {tab === 'dash' && <DashboardComp />}
                {tab === 'requests' && <DashRequest />}
                {tab === 'profile' && <DashProfile />}
            </div>
        </>
    );
}
