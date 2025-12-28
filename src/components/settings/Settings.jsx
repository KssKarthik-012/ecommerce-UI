import React from 'react';

const Settings = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-layout">
        <div className="main-content">
          <div className="container">
            <div className="form-container">
              <div className="form-header">
                <h1 className="form-title">System Settings</h1>
                <p className="form-subtitle">Configure application settings and preferences</p>
              </div>
              
              <div className="form-section">
                <div className="section-title">General Settings</div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input type="text" className="form-input" defaultValue="RTQ Foods" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input type="email" className="form-input" defaultValue="info@rtqfoods.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" defaultValue="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea className="form-textarea" defaultValue="123 Food Street, Spice City, India" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="section-title">Notification Settings</div>
                <div className="form-group">
                  <label className="form-checkbox">
                    <input type="checkbox" className="checkbox" defaultChecked />
                    <span className="checkbox-label">Email notifications for new orders</span>
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-checkbox">
                    <input type="checkbox" className="checkbox" defaultChecked />
                    <span className="checkbox-label">Low stock alerts</span>
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-checkbox">
                    <input type="checkbox" className="checkbox" />
                    <span className="checkbox-label">Weekly sales reports</span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">💾 Save Settings</button>
                <button className="btn-outline">🔄 Reset to Default</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 