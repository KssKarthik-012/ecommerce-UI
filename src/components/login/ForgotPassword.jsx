import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await authAPI.forgotPassword(email);
      if (res.data && res.data.success) {
        setMessage(res.data.message || 'If the email exists, a reset link was sent.');
      } else {
        setError('Failed to request reset');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Forgot Password</h3>

        {message && <div className="mb-3 text-green-700">{message}</div>}
        {error && <div className="mb-3 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-2">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded mb-4"
          />

          <button type="submit" disabled={loading} className="w-full py-2 bg-green-700 text-white rounded">
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <Link to="/login" className="text-green-700 hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
