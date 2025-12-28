import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      const res = await authAPI.resetPassword(token, password);
      if (res.data && res.data.success) {
        setMessage('Password reset successfully. Redirecting to login...');
        setTimeout(() => navigate('/login'), 1600);
      } else {
        setError(res.data?.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Reset Password</h3>

        {message && <div className="mb-3 text-green-700">{message}</div>}
        {error && <div className="mb-3 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-2">New password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-3 py-2 border rounded mb-3" required />

          <label className="block text-sm mb-2">Confirm password</label>
          <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="w-full px-3 py-2 border rounded mb-4" required />

          <button type="submit" disabled={loading} className="w-full py-2 bg-green-700 text-white rounded">
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <Link to="/login" className="text-green-700 hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
