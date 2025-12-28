import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="access-denied-page">
      <div className="access-denied-container">
        <div className="access-denied-content">
          <div className="access-denied-icon">🚫</div>
          <h1 className="access-denied-title">Access Denied</h1>
          <p className="access-denied-message">
            Sorry, you don't have permission to access this page. 
            This area is restricted to authorized users only.
          </p>
          <div className="access-denied-actions">
            <Link to="/" className="home-button">
              🏠 Go to Home
            </Link>
            <Link to="/login" className="login-button">
              🔐 Login with Different Account
            </Link>
          </div>
          <div className="access-denied-help">
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied; 