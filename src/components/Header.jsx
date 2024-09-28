import { Button, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, Popover } from 'flowbite-react';
import { useState } from 'react';
import { varphilogo } from '../assets/index.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';

const Header = () => {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);
  
    return (
        <Navbar className='border-b-2 border-slate-400 shadow-custom-bottom'>
            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white inline-flex mt-2 pl-5'>
                <span>
                    <img src={varphilogo} alt='logo' className='m-0 w-[50px] h-[px] px-2' />
                </span>
                Varphi KBI
            </Link>
            <div className='flex gap-2 md:order-2 pr-6'>
                <Button className='w-15 h-10 hidden sm:inline py-0'
                    color='gray' pill onClick={() => dispatch(toggleTheme())}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>
                <Link to='/sign-in'>
                    <Button gradientDuoTone="purpleToBlue">Sign In</Button>
                </Link>
                <NavbarToggle></NavbarToggle>
            </div>
            <NavbarCollapse>
                <NavbarLink active={path === '/'} as={'div'} className='text-lg'>
                    <Link to='/'>Home</Link>
                </NavbarLink>
                <NavbarLink active={path === '/about'} as={'div'} className='text-lg'>
                    <Link to='/about'>About</Link>
                </NavbarLink>
            </NavbarCollapse>
        </Navbar>
    );
};

export default Header;
