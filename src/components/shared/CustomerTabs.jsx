import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PersonIcon from '@mui/icons-material/Person';

const CustomerTabs = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-tabs">
      <button 
        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
        onClick={() => onTabChange('overview')}
      >
        <InsertChartIcon /> Overview
      </button>
      <button 
        className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
        onClick={() => onTabChange('orders')}
      >
        📦 My Orders
      </button>
      <button 
        className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => onTabChange('profile')}
      >
        <PersonIcon /> Profile
      </button>
      <button 
        className={`tab-button ${activeTab === 'shop' ? 'active' : ''}`}
        onClick={() => navigate('/shop')}
      >
        <ShoppingCartIcon /> Shop Now
      </button>
    </div>
  );
};

export default CustomerTabs; 