import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Assets', href: '/assets', icon: '📦' },
  { name: 'Requests', href: '/requests', icon: '📋' },
];

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: '⚙️' },
  { name: 'Asset Management', href: '/admin/assets', icon: '📦' },
  { name: 'Request Management', href: '/admin/requests', icon: '📋' },
];

export default function Sidebar({ open, setOpen }) {
  const { isAdmin } = useAuth();

  return (
    <div className={` fixed top-12 bottom-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Asset Management</h2>
      </div>
      
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        
        {isAdmin() && (
          <>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</h3>
            </div>
            <ul className="mt-2 space-y-2">
              {adminNavigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
    </div>
  );
}
