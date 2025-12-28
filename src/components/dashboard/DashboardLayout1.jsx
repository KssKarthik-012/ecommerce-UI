import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PersonIcon from '@mui/icons-material/Person';


const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-layout">
        {/* App Bar */}
        <div className="app-bar">
          <div className="toolbar">
            <div className="logo">
              <span className="logo-icon">🌾</span>
              <span className="logo-text">RTQ Foods</span>
            </div>
            <div className="toolbar-actions">
              <button 
                className="user-menu-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <AccountIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="nav-menu">
            <div className="nav-section">
              <div className="nav-section-title">Main</div>
              <button 
                className="nav-item"
                onClick={() => handleNavigation('/admin/dashboard')}
              >
                <span className="nav-icon"><InsertChartIcon /></span>
                <span className="nav-text">Dashboard</span>
              </button>
            </div>
            <div className="nav-section">
              <div className="nav-section-title">Management</div>
              <button 
                className="nav-item"
                onClick={() => handleNavigation('/admin/products')}
              >
                <span className="nav-icon">📦</span>
                <span className="nav-text">Products</span>
              </button>
              <button 
                className="nav-item"
                onClick={() => handleNavigation('/admin/orders')}
              >
                <span className="nav-icon"><ShoppingCartIcon /></span>
                <span className="nav-text">Orders</span>
              </button>
              <button 
                className="nav-item"
                onClick={() => handleNavigation('/admin/offline-orders')}
              >
                <span className="nav-icon">📝</span>
                <span className="nav-text">Offline Orders</span>
              </button>
              <button 
                className="nav-item"
                onClick={() => handleNavigation('/admin/customers')}
              >
                <span className="nav-icon">👥</span>
                <span className="nav-text">Customers</span>
              </button>
              <button 
                className="nav-item"
                onClick={() => handleNavigation('/admin/categories')}
              >
                <span className="nav-icon">🏷️</span>
                <span className="nav-text">Categories</span>
              </button>
              <button 
                className="nav-item"
                onClick={() => handleNavigation('/admin/purchase-orders')}
              >
                <span className="nav-icon">📋</span>
                <span className="nav-text">Purchase Orders</span>
              </button>
              <button 
                className="nav-item"
                onClick={() => handleNavigation('/admin/users')}
              >
                <span className="nav-icon"><PersonIcon /></span>
                <span className="nav-text">User Management</span>
              </button>
            </div>
            <div className="nav-section">
              <div className="nav-section-title">Analytics</div>
              <button 
                className="nav-item"
                onClick={() => handleNavigation('/admin/reports')}
              >
                <span className="nav-icon">📈</span>
                <span className="nav-text">Reports</span>
              </button>
            </div>
            <div className="nav-section">
              <div className="nav-section-title">System</div>
              <button 
                className="nav-item"
                onClick={handleLogout}
              >
                <span className="nav-icon"><LogoutIcon /></span>
                <span className="nav-text">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {children}
        </div>

        {/* User Menu */}
        {userMenuOpen && (
          <div className="user-menu">
            <div className="menu-item">
              <span className="menu-icon"><PersonIcon /></span>
              <span>Profile</span>
            </div>
            <div className="menu-item" onClick={handleLogout}>
              <span className="menu-icon"><LogoutIcon /></span>
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout; 