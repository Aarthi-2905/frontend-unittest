import { Sidebar, Modal, Button } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiOutlineExclamationCircle} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';

export default function UserSidebar() {
  const [tab, setTab] = useState('');
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = () => {
    setShowSignOutModal(false);
    navigate('/');
  };

  const activeStyle = 'bg-gray-200 dark:bg-gray-600 font-semibold'; // Active tab style
  const inactiveStyle = 'hover:bg-gray-100'; // Inactive tab hover style

  return (
    <>
      <Sidebar className='w-full md:w-56 border-b-2 border-slate-400 shadow-custom-bottom flex flex-col'>
        <Sidebar.Items className='flex flex-col h-full'>
          <Sidebar.ItemGroup className='flex flex-col gap-1'>
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                className={`${tab === 'dash' || !tab ? activeStyle : inactiveStyle}`}
                icon={FaRobot}
                as='div'
              >
                Chat Interface
              </Sidebar.Item>
            </Link>

           

            <div className='fixed bottom-3'>
              <Link to='/dashboard?tab=profile'>
                <Sidebar.Item
                  className={`${tab === 'profile' ? activeStyle : inactiveStyle}`}
                  icon={HiUser}
                  label={' Admin'}
                  labelColor='dark'
                  as='div'
                >
                  Profile
                </Sidebar.Item>
              </Link>

              <Sidebar.Item
                icon={HiArrowSmRight}
                className='cursor-pointer'
                onClick={() => setShowSignOutModal(true)}
              >
                Sign Out
              </Sidebar.Item>
            </div>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      <Modal
        show={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        popup
        size='md'
      >
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

