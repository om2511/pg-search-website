import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();
  
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    newListings: true,
    priceAlerts: true,
    
    // Privacy Settings
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    dataAnalytics: true,
    
    // Preference Settings
    language: 'en',
    currency: 'INR',
    theme: isDark ? 'dark' : 'light'
  });

  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'preferences', name: 'Preferences', icon: GlobeAltIcon },
    { id: 'security', name: 'Security', icon: KeyIcon },
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (settings.theme !== (isDark ? 'dark' : 'light')) {
        toggleTheme();
      }
      
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save settings. Please try again.', 'error');
    }
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-dark-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Profile Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              defaultValue={user?.name}
              className="input"
              placeholder="Your display name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue={user?.email}
              className="input"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue={user?.phone}
              className="input"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              rows={3}
              className="input resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-1 divide-y divide-gray-200 dark:divide-dark-600">
          <ToggleSwitch
            enabled={settings.emailNotifications}
            onChange={(value) => handleSettingChange('emailNotifications', value)}
            label="Email Notifications"
            description="Receive notifications via email"
          />
          <ToggleSwitch
            enabled={settings.smsNotifications}
            onChange={(value) => handleSettingChange('smsNotifications', value)}
            label="SMS Notifications"
            description="Receive notifications via SMS"
          />
          <ToggleSwitch
            enabled={settings.pushNotifications}
            onChange={(value) => handleSettingChange('pushNotifications', value)}
            label="Push Notifications"
            description="Receive browser push notifications"
          />
          <ToggleSwitch
            enabled={settings.marketingEmails}
            onChange={(value) => handleSettingChange('marketingEmails', value)}
            label="Marketing Emails"
            description="Receive promotional emails and offers"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Content Alerts
        </h3>
        <div className="space-y-1 divide-y divide-gray-200 dark:divide-dark-600">
          <ToggleSwitch
            enabled={settings.newListings}
            onChange={(value) => handleSettingChange('newListings', value)}
            label="New Listings"
            description="Get notified about new PG listings in your preferred areas"
          />
          <ToggleSwitch
            enabled={settings.priceAlerts}
            onChange={(value) => handleSettingChange('priceAlerts', value)}
            label="Price Alerts"
            description="Get notified about price changes on your saved properties"
          />
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Privacy Controls
        </h3>
        <div className="space-y-1 divide-y divide-gray-200 dark:divide-dark-600">
          <ToggleSwitch
            enabled={settings.showEmail}
            onChange={(value) => handleSettingChange('showEmail', value)}
            label="Show Email Publicly"
            description="Display your email address on your public profile"
          />
          <ToggleSwitch
            enabled={settings.showPhone}
            onChange={(value) => handleSettingChange('showPhone', value)}
            label="Show Phone Publicly"
            description="Display your phone number on your public profile"
          />
          <ToggleSwitch
            enabled={settings.dataAnalytics}
            onChange={(value) => handleSettingChange('dataAnalytics', value)}
            label="Data Analytics"
            description="Allow us to use your data to improve our services"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Profile Visibility
        </label>
        <select
          value={settings.profileVisibility}
          onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
          className="input"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="friends">Friends Only</option>
        </select>
      </div>
    </div>
  );

  const renderPreferenceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          General Preferences
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="input"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="input"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Appearance
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['light', 'dark', 'system'].map((theme) => (
              <label
                key={theme}
                className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  settings.theme === theme
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-dark-600 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name="theme"
                  value={theme}
                  checked={settings.theme === theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="sr-only"
                />
                <span className={`capitalize font-medium ${
                  settings.theme === theme
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {theme}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Security
        </h3>
        <div className="space-y-4">
          <button className="btn btn-outline w-full justify-start">
            <KeyIcon className="w-5 h-5 mr-3" />
            Change Password
          </button>
          <button className="btn btn-outline w-full justify-start">
            <DevicePhoneMobileIcon className="w-5 h-5 mr-3" />
            Enable Two-Factor Authentication
          </button>
          <button className="btn btn-outline w-full justify-start">
            <CheckCircleIcon className="w-5 h-5 mr-3" />
            Active Sessions
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-dark-600 pt-6">
        <h3 className="text-lg font-semibold text-error-600 mb-4">
          Danger Zone
        </h3>
        <div className="space-y-4">
          <button className="btn bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800 text-error-600 dark:text-error-400 hover:bg-error-100 dark:hover:bg-error-900/30 w-full justify-start">
            <XCircleIcon className="w-5 h-5 mr-3" />
            Deactivate Account
          </button>
          <button className="btn bg-error-600 hover:bg-error-700 text-white w-full justify-start">
            <TrashIcon className="w-5 h-5 mr-3" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'preferences':
        return renderPreferenceSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="py-12 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/20 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 min-h-screen">
      <div className="container-responsive">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 bg-white dark:bg-dark-800 rounded-2xl shadow-card p-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card p-8">
              {renderTabContent()}
              
              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-600">
                <div className="flex justify-end space-x-4">
                  <button className="btn btn-ghost">
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;