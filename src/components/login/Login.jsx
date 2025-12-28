import React, { useState } from "react";
import { authAPI } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import PublicHeader from "../shared/PublicHeader";
import Footer from "../public/Footer";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import googleImg from '../../assets/google.png';
import facebookImg from '../../assets/facebook.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        if (
          response.data.user.role === "admin" ||
          response.data.user.role === "staff"
        ) {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/customer/dashboard";
        }
      } else {
        setError("Login failed - invalid response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-website">
    <PublicHeader />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h2>
          <p className="text-gray-500 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 flex items-center">
            ⚠️ <span className="ml-2">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-green-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg flex items-center justify-center space-x-2 font-medium transition"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LoginIcon />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-4 text-gray-500 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100">
            <img src={googleImg} alt="Google" className="w-5 h-5 mr-2" /> Google
          </button>
          <button className="flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100">
            <img src={facebookImg} alt="Facebook" className="w-5 h-5 mr-2" /> Facebook
          </button>
        </div>

        {/* Signup */}
        <p className="text-center mt-6 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-700 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* <div className="demo-credentials">
        <p><strong>Demo Credentials:</strong></p>
        <p><strong>Admin:</strong> admin@example.com / admin123</p>
        <p><strong>Customer:</strong> customer@example.com / customer123</p>
        <p><strong>Test User:</strong> alert@example.com / alert123</p>
      </div> */}
    </div>
         <Footer />
    </div>
  );
};

export default Login;
