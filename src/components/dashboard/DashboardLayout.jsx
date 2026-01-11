import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Category as CategoriesIcon,
  Assignment as PurchaseOrdersIcon,
  Person as UsersIcon,
  Assessment as ReportsIcon,
  Feedback as EnquiriesIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import logo from '../../assets/logo.png';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = [
    {
      section: 'Main',
      items: [
        { path: '/admin/dashboard', icon: DashboardIcon, label: 'Dashboard' }
      ]
    },
    {
      section: 'Management',
      items: [
        { path: '/admin/products', icon: ProductsIcon, label: 'Products' },
        { path: '/admin/orders', icon: OrdersIcon, label: 'Orders' },
        { path: '/admin/offline-orders', icon: OrdersIcon, label: 'Offline Orders' },
        { path: '/admin/customers', icon: CustomersIcon, label: 'Customers' },
        { path: '/admin/categories', icon: CategoriesIcon, label: 'Categories' },
        { path: '/admin/enquiries', icon: EnquiriesIcon, label: 'Enquiries' },
        { path: '/admin/purchase-orders', icon: PurchaseOrdersIcon, label: 'Purchase Orders' },
        { path: '/admin/users', icon: UsersIcon, label: 'User Management' }
      ]
    },
    {
      section: 'Analytics',
      items: [
        { path: '/admin/reports', icon: ReportsIcon, label: 'Reports' }
      ]
    },
    {
      section: 'System',
      items: [
        { path: '/logout', icon: LogoutIcon, label: 'Logout', action: handleLogout }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative top-0 left-0 h-full z-50 lg:z-auto
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'}
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white shadow-lg border-r border-gray-200
      `}>
        <div className="h-full overflow-y-auto">
          <nav className="p-2 space-y-6">
            <div>
              <img src={logo} alt="RTQ Foods Logo"
                className="logo-image h-[70px]"
                width="auto"
                height={70} />
            </div>
            <hr className="border-t border-gray-200 m-0" />
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-2">
                {!sidebarCollapsed && (
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                    {section.section}
                  </div>
                )}
                {section.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={itemIndex}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-200 ease-in-out
                        ${isActive
                          ? 'bg-green-50 text-green-600 border-l-[3px] border-green-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                        ${sidebarCollapsed ? 'justify-center' : 'justify-start'}
                      `}
                      onClick={() => item.action ? item.action() : handleNavigation(item.path)}
                      title={sidebarCollapsed ? item.label : ''}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="text-sm font-medium truncate">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      {/* ${sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]'} */}
      <main className={`
        flex-1 flex flex-col min-w-0
        transition-all duration-300 ease-in-out
        
      `}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={toggleMobileMenu}
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              <button
                className="hidden lg:flex p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={toggleSidebar}
              >
                {sidebarCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* <button className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <NotificationsIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button> */}
              <button
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <AccountIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>

      {/* User Menu Dropdown */}
      {userMenuOpen && (
        <div className="fixed top-16 right-6 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-48">
          <div className="py-2">
            <div className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">
              <AccountIcon className="w-4 h-4" />
              <span className="text-sm">Profile</span>
            </div>
            <div
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
              onClick={handleLogout}
            >
              <LogoutIcon className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout; 