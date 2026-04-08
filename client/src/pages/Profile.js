import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
  CogIcon,
  KeyIcon,
  BellIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { getAvatarUrl } from '../utils/imageUtils';

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

  const [userPGs, setUserPGs] = useState([]);
  const [pgsLoading, setPgsLoading] = useState(false);

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
      await axios.post('/api/auth/avatar', formData, {
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
    
    // Prevent multiple simultaneous calls
    if (loading) return;
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/auth/profile', formData, {
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

  const handlePreferencesUpdate = async () => {
    // Prevent multiple simultaneous calls
    if (loading) return;
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showSuccess('Preferences saved', 'Your preferences have been saved successfully');
      await loadUser(); // Refresh user data
    } catch (error) {
      showError('Save failed', error.response?.data?.message || 'Failed to save preferences');
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
      await axios.put('/api/auth/password', {
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

  const fetchUserPGs = useCallback(async () => {
    if (user?.role !== 'owner') return;
    
    setPgsLoading(true);
    try {
      const response = await axios.get('/api/pgs/my-pgs');
      setUserPGs(response.data.data.pgs || []);
    } catch (error) {
      console.error('Error fetching user PGs:', error);
      showError('Error loading your PG listings');
    } finally {
      setPgsLoading(false);
    }
  }, [showError, user]);

  const handleDeletePG = async (pgId) => {
    if (!window.confirm('Are you sure you want to delete this PG listing?')) return;
    
    try {
      await axios.delete(`/api/pgs/${pgId}`);
      setUserPGs(prevPGs => prevPGs.filter(pg => pg._id !== pgId));
      showSuccess('PG listing deleted successfully');
    } catch (error) {
      console.error('Error deleting PG:', error);
      showError('Error deleting PG listing');
    }
  };

  // Fetch user PGs when switching to my-pgs tab
  useEffect(() => {
    if (activeTab === 'my-pgs' && user?.role === 'owner') {
      fetchUserPGs();
    }
  }, [activeTab, user, fetchUserPGs]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    ...(user?.role === 'owner' ? [{ id: 'my-pgs', name: 'My PGs', icon: BuildingOfficeIcon }] : []),
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
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-4 sm:py-6 lg:py-8">
      <div className="container-responsive">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8">
              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-dark-800">
                    {user.avatar && getAvatarUrl(user.avatar) ? (
                      <img
                        src={getAvatarUrl(user.avatar)}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 flex items-center justify-center ${user.avatar && getAvatarUrl(user.avatar) ? 'hidden' : 'flex'}`}
                      style={{ display: user.avatar && getAvatarUrl(user.avatar) ? 'none' : 'flex' }}
                    >
                      <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageLoading}
                  className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                >
                  {imageLoading ? (
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name}
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 capitalize">
                  {user.role} Account
                </p>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <EnvelopeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="break-all">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
                  <div className="badge badge-primary text-xs sm:text-sm">
                    <ShieldCheckIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Verified Account
                  </div>
                  {user.role === 'owner' && (
                    <div className="badge badge-success text-xs sm:text-sm">
                      <BuildingOfficeIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Property Owner
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden animate-slide-up animate-delay-200">
            <div className="border-b border-gray-200 dark:border-dark-600 overflow-x-auto">
              <nav className="flex space-x-0 min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center sm:justify-start space-x-0 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm transition-all duration-300 border-b-2 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden xs:inline sm:inline">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
                      onClick={handlePreferencesUpdate}
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Saving...' : 'Save Preferences'}
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

              {/* My PGs Tab */}
              {activeTab === 'my-pgs' && user?.role === 'owner' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      My PG Listings
                    </h3>
                    <Link
                      to="/add-pg"
                      className="btn btn-primary flex items-center space-x-2"
                    >
                      <BuildingOfficeIcon className="w-5 h-5" />
                      <span>Add New PG</span>
                    </Link>
                  </div>

                  {pgsLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Loading your PG listings...</p>
                    </div>
                  ) : userPGs.length === 0 ? (
                    <div className="text-center py-12">
                      <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No PG Listings Yet
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Start by adding your first PG property to attract potential tenants.
                      </p>
                      <Link to="/add-pg" className="btn btn-primary">
                        Add Your First PG
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {userPGs.map((pg) => (
                        <div
                          key={pg._id}
                          className="card p-6 hover:shadow-lg transition-shadow"
                        >
                          {/* PG Image */}
                          <div className="aspect-video bg-gray-200 dark:bg-dark-700 rounded-lg mb-4 overflow-hidden">
                            {pg.images && pg.images.length > 0 ? (
                              <img
                                src={pg.images[0]}
                                alt={pg.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BuildingOfficeIcon className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* PG Details */}
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {pg.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                {pg.location?.city}, {pg.location?.state}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-primary-600">
                                ₹{pg.price?.toLocaleString()}/month
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                {pg.availableRooms}/{pg.totalRooms} available
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                pg.availability
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                              }`}>
                                {pg.availability ? 'Available' : 'Not Available'}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-gray-200">
                                {pg.gender}
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 pt-2">
                              <Link
                                to={`/pg/${pg._id}`}
                                className="flex-1 btn btn-outline btn-sm text-xs sm:text-sm"
                              >
                                <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="hidden xs:inline">View</span>
                              </Link>
                              <Link
                                to={`/edit-pg/${pg._id}`}
                                className="flex-1 btn btn-primary btn-sm text-xs sm:text-sm"
                              >
                                <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="hidden xs:inline">Edit</span>
                              </Link>
                              <button
                                onClick={() => handleDeletePG(pg._id)}
                                className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs sm:text-sm xs:px-2"
                              >
                                <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
