import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  UserIcon,
  CameraIcon,
  PencilIcon,
  ShieldCheckIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  HeartIcon,
  CogIcon,
  KeyIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const Profile = () => {
  const { user, loadUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: {
      city: '',
      state: ''
    },
    preferences: {
      budget: '',
      gender: '',
      amenities: []
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: {
          city: user.location?.city || '',
          state: user.location?.state || ''
        },
        preferences: {
          budget: user.preferences?.budget || '',
          gender: user.preferences?.gender || '',
          amenities: user.preferences?.amenities || []
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      showError('Invalid file type', 'Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showError('File too large', 'Please select an image smaller than 5MB');
      return;
    }

    setImageLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/user/avatar', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccess('Profile picture updated', 'Your profile picture has been updated successfully');
      await loadUser(); // Refresh user data
    } catch (error) {
      showError('Upload failed', error.response?.data?.message || 'Failed to upload image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/user/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showSuccess('Profile updated', 'Your profile has been updated successfully');
      await loadUser(); // Refresh user data
    } catch (error) {
      showError('Update failed', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Password mismatch', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError('Password too short', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showSuccess('Password updated', 'Your password has been changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showError('Password change failed', error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'preferences', name: 'Preferences', icon: CogIcon },
    { id: 'security', name: 'Security', icon: KeyIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="container-responsive">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 p-1 shadow-lg">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-dark-800">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 flex items-center justify-center">
                        <UserIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageLoading}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                >
                  {imageLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <CameraIcon className="w-5 h-5" />
                  )}
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 capitalize">
                  {user.role} Account
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <PhoneIcon className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <div className="badge badge-primary">
                    <ShieldCheckIcon className="w-4 h-4 mr-1" />
                    Verified Account
                  </div>
                  {user.role === 'owner' && (
                    <div className="badge badge-success">
                      <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                      Property Owner
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden animate-slide-up animate-delay-200">
            <div className="border-b border-gray-200 dark:border-dark-600">
              <nav className="flex space-x-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all duration-300 border-b-2 ${
                        activeTab === tab.id
                          ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input"
                        required
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="input"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Search Preferences
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Budget Range
                      </label>
                      <select
                        name="preferences.budget"
                        value={formData.preferences.budget}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="">Any Budget</option>
                        <option value="5000-10000">₹5,000 - ₹10,000</option>
                        <option value="10000-15000">₹10,000 - ₹15,000</option>
                        <option value="15000-20000">₹15,000 - ₹20,000</option>
                        <option value="20000-25000">₹20,000 - ₹25,000</option>
                        <option value="25000+">₹25,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Gender Preference
                      </label>
                      <select
                        name="preferences.gender"
                        value={formData.preferences.gender}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="">No Preference</option>
                        <option value="boys">Boys Only</option>
                        <option value="girls">Girls Only</option>
                        <option value="both">Co-ed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                      Preferred Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'wifi', 'ac', 'tv', 'fridge', 'washing_machine', 
                        'parking', 'security', 'meals', 'cleaning', 'gym'
                      ].map(amenity => (
                        <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.preferences.amenities.includes(amenity)}
                            onChange={(e) => {
                              const newAmenities = e.target.checked
                                ? [...formData.preferences.amenities, amenity]
                                : formData.preferences.amenities.filter(a => a !== amenity);
                              setFormData(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, amenities: newAmenities }
                              }));
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300 capitalize">
                            {amenity.replace('_', ' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleProfileUpdate}
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Change Password
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="input"
                      required
                      minLength="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="input"
                      required
                      minLength="6"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Updating...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Notification Settings
                  </h3>

                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {key === 'emailNotifications' && 'Receive email updates about your account and listings'}
                            {key === 'smsNotifications' && 'Get SMS alerts for important updates'}
                            {key === 'pushNotifications' && 'Browser notifications for real-time updates'}
                            {key === 'marketingEmails' && 'Promotional emails about new features and offers'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              [key]: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button className="btn btn-primary">
                      Save Notification Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up animate-delay-500">
            <Link
              to="/wishlist"
              className="card card-hover p-6 text-center group"
            >
              <HeartIcon className="w-12 h-12 text-red-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                My Wishlist
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                View saved PGs
              </p>
            </Link>

            {user.role === 'owner' && (
              <Link
                to="/owner/dashboard"
                className="card card-hover p-6 text-center group"
              >
                <ChartBarIcon className="w-12 h-12 text-primary-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your properties
                </p>
              </Link>
            )}

            <Link
              to="/help"
              className="card card-hover p-6 text-center group"
            >
              <ShieldCheckIcon className="w-12 h-12 text-success-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Help & Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get assistance
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;