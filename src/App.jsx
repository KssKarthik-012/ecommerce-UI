import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './styles/index.scss';
import './styles/index.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCart } from './cartSlice';

// Import components
import Dashboard from './components/dashboard/Dashboard';
import ProductList from './components/products/ProductList';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import ForgotPassword from './components/login/ForgotPassword';
import ResetPassword from './components/login/ResetPassword';
import CustomerDashboard from './components/customer/CustomerDashboard';
import Orders from './components/orders/Orders';
import Customers from './components/customers/Customers';
import Categories from './components/categories/Categories';
import PurchaseOrders from './components/purchaseOrders/PurchaseOrders';
import Reports from './components/reports/Reports';
import Settings from './components/settings/Settings';
import AccessDenied from './components/shared/AccessDenied';
import OrderManagement from './components/orders/OrderManagement';
import OfflineOrders from './components/orders/OfflineOrders';
import UserManagement from './components/users/UserManagement';
import DashboardHome from './components/dashboard/DashboardHome';
import Enquiries from './components/dashboard/Enquiries';

// Public pages
import HomePage from './components/public/HomePage';
import ShopPage from './components/public/ShopPage';
import ProductDetailPage from './components/public/ProductDetailPage';
import CartPage from './components/public/CartPage';
import CheckoutPage from './components/public/CheckoutPage';
import OrderSuccessPage from './components/public/OrderSuccessPage';
import TrackOrderPage from './components/public/TrackOrderPage';
import AboutPage from './components/public/AboutPage';
import ContactPage from './components/public/ContactPage';
import PrivacyPolicyPage from './components/public/PrivacyPolicyPage';
import TermsPage from './components/public/TermsPage';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green for RTQ Foods
    },
    secondary: {
      main: '#ff6f00', // Orange accent
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (user) {
    const userData = JSON.parse(user);
    if (userData.role !== 'admin' && userData.role !== 'staff') {
      return <Navigate to="/access-denied" replace />;
    }
  }
  
  return children;
};

// Customer Protected Route Component
const CustomerProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (user) {
    const userData = JSON.parse(user);
    if (userData.role !== 'customer') {
      return <Navigate to="/access-denied" replace />;
    }
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App" contentEditable={false}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* Customer Dashboard Route */}
            <Route path="/customer/dashboard" element={
              <CustomerProtectedRoute>
                <CustomerDashboard />
              </CustomerProtectedRoute>
            } />
            {/* Admin Layout Route with Nested Admin Pages */}
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <Dashboard />
              </AdminProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="products" element={<ProductList />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="offline-orders" element={<OfflineOrders />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="customers" element={<Customers />} />
              <Route path="categories" element={<Categories />} />
              <Route path="purchase-orders" element={<PurchaseOrders />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="enquiries" element={<Enquiries />} />
            </Route>
            {/* Access Denied Route */}
            <Route path="/access-denied" element={<AccessDenied />} />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 