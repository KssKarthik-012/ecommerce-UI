import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";
import "../../styles/components/publicHeader.scss";
import { LogIn, LogOut, Menu, ShoppingCart } from "lucide-react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

const PublicHeader = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openAvatar, setOpenAvatar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  );

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/");
    setMenuOpen(false);
    setOpenAvatar(false);
  };

  const handleDashboardClick = () => {
    if (user?.role === "admin" || user?.role === "staff") {
      navigate("/admin/dashboard");
    } else {
      navigate("/customer/dashboard");
    }
    setMenuOpen(false);
    setOpenAvatar(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Close avatar dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenAvatar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="public-header">
      <div className="header-container">
        {/* Left: Logo */}
        <div className="logo-section">
          <Link to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
            <img
              src={logo}
              alt="RTQ Foods Logo"
              className="logo-image h-[70px]"
              width="auto"
              height={70}
            />
          </Link>
        </div>

        {/* Center: Menu (Desktop only) */}
        <nav className="nav-menu desktop-only">
          <Link to="/" className={`nav-link ${isActiveLink("/")}`}>
            Home
          </Link>
          <Link to="/shop" className={`nav-link ${isActiveLink("/shop")}`}>
            Shop
          </Link>
          <Link to="/about" className={`nav-link ${isActiveLink("/about")}`}>
            About
          </Link>
          <Link to="/contact" className={`nav-link ${isActiveLink("/contact")}`}>
            Contact
          </Link>
        </nav>

        {/* Right: Actions (Desktop only) */}
        <div className="flex items-center gap-4">
        
          {isLoggedIn ? (
            <div className="user-actions">
              {/* Cart */}
              <Link to="/cart" className="cart-button" aria-label="Cart">
                <ShoppingCart size={24} /> <span className="cart-badge">{cartCount}</span>
              </Link>

              {/* Avatar Menu */}
              <div className="avatar-menu" ref={dropdownRef}>
                <div
                  className="avatar"
                  onClick={() => setOpenAvatar(!openAvatar)}
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={openAvatar}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" />
                  ) : (
                    <span>{user?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {openAvatar && (
                  <div className="avatar-dropdown" role="menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        handleDashboardClick();
                        setOpenAvatar(false);
                      }}
                      role="menuitem"
                    >
                      <DashboardIcon /> Dashboard
                    </button>
                    <button
                      className="dropdown-item logout"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <LogoutIcon /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="header-actions desktop-only">
              <div className="auth-buttons">
                <Link to="/login" className="login-btn">
                  <LogIn size={16} /> Login/Signup
                </Link>
              </div>
            </div>
          )}

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn mobile-only"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />  
        </button>
        </div>
      </div>

      {/* Drawer for Mobile */}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div className="drawer-logo">
          <Link to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
            <img
              src={logo}
              alt="RTQ Foods Logo"
              className="logo-image"
              width="auto"
              height={50}
            />
          </Link>
          <button
            className="drawer-close-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✖
          </button>
        </div>

        <nav className="drawer-nav">
          <Link
            to="/"
            className={`nav-link ${isActiveLink("/")}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className={`nav-link ${isActiveLink("/shop")}`}
            onClick={() => setMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            to="/about"
            className={`nav-link ${isActiveLink("/about")}`}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`nav-link ${isActiveLink("/contact")}`}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>

          <div className="mobile-extra">
            {isLoggedIn ? (
              <>
                <button onClick={handleLogout} className="logout-btn mob-login-btn">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div className="auth-buttons">
                <Link
                  to="/login"
                  className="login-btn mob-login-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn size={16} /> Login/Signup
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default PublicHeader;
