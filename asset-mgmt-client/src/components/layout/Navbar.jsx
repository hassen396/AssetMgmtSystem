import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Navbar Row */}
        <div className="relative flex items-center justify-between h-16">
          {/* Left: Menu button */}
          <button
            type="button"
            className="lg:hidden -m-2.5 p-2.5 text-gray-700"
            onClick={onMenuClick}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Center: Title */}
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-900">
            Asset Management System
          </h1>

          {/* Right: Icons & Menu */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications */}
            <button
              type="button"
              className="relative p-2 text-gray-400 hover:text-gray-500"
            >
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {/* User Info */}
                  <Menu.Item>
                    {() => (
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <p className="font-medium">
                          {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : 'User'}
                        </p>
                        <p className="text-gray-500">{user?.email}</p>
                        <p className="text-xs text-primary-600 font-medium">
                          {user?.role}
                        </p>
                      </div>
                    )}
                  </Menu.Item>

                  {/* Admin Panel */}
                  {user?.role === 'Admin' && (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate('/admin')}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                        >
                          Admin Panel
                        </button>
                      )}
                    </Menu.Item>
                  )}

                  {/* Sign out */}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}
