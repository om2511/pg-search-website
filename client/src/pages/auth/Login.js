import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BuildingOfficeIcon,
  UserIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      showSuccess('Welcome back!', `Good to see you again!`);
      navigate(from, { replace: true });
    } else {
      showError('Login failed', result.error);
    }
    
    setLoading(false);
  };

  const demoCredentials = [
    { email: 'owner1@example.com', password: 'password123', role: 'Owner' },
    { email: 'user@example.com', password: 'password123', role: 'User' }
  ];

  const fillDemoCredentials = (credentials) => {
    setFormData(prev => ({
      ...prev,
      email: credentials.email,
      password: credentials.password
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
      
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo & Header */}
        <div className="text-center animate-fade-in">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 transform group-hover:scale-110">
              <BuildingOfficeIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-display font-bold text-gradient">
                FindMyPG
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Premium Living Spaces
              </p>
            </div>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sign in to your account to continue your PG search
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8 animate-slide-up animate-delay-200">
          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3">
              Demo Credentials (Click to fill):
            </h4>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillDemoCredentials(cred)}
                  className="w-full text-left p-2 text-sm bg-white dark:bg-dark-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-700"
                >
                  <div className="font-medium text-blue-900 dark:text-blue-100">{cred.role}</div>
                  <div className="text-blue-600 dark:text-blue-300">{cred.email}</div>
                </button>
              ))}
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`input pl-12 ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className={`input pl-12 pr-12 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full btn-lg group"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    Sign In
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-dark-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-800 text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link
                to="/register"
                className="btn btn-outline w-full"
              >
                Create New Account
              </Link>
            </div>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <ShieldCheckIcon className="w-4 h-4 text-success-500" />
              <span>Your data is protected with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;