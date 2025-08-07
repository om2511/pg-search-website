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
  const { showToast, showSuccess, showError, showWarning, showInfo } = useToast();
  
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
    { id: 'demo', name: 'Notifications Demo', icon: PaintBrushIcon },
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
    <div className="flex items-start sm:items-center justify-between py-3 sm:py-4 gap-3 sm:gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 leading-tight">{label}</p>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex-shrink-0 ${
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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          Profile Information
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Display Name
              </label>
              <input
                type="text"
                defaultValue={user?.name}
                className="input text-sm sm:text-base"
                placeholder="Your display name"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue={user?.phone}
                className="input text-sm sm:text-base"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue={user?.email}
              className="input text-sm sm:text-base"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Bio
            </label>
            <textarea
              rows={3}
              className="input resize-none text-sm sm:text-base"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-0.5 sm:space-y-1 divide-y divide-gray-200 dark:divide-dark-600">
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
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          Content Alerts
        </h3>
        <div className="space-y-0.5 sm:space-y-1 divide-y divide-gray-200 dark:divide-dark-600">
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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          Privacy Controls
        </h3>
        <div className="space-y-0.5 sm:space-y-1 divide-y divide-gray-200 dark:divide-dark-600">
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
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
          Profile Visibility
        </label>
        <select
          value={settings.profileVisibility}
          onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
          className="input text-sm sm:text-base"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="friends">Friends Only</option>
        </select>
      </div>
    </div>
  );

  const renderPreferenceSettings = () => (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          General Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="input text-sm sm:text-base"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="input text-sm sm:text-base"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          Appearance
        </h3>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
            Theme
          </label>
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3">
            {['light', 'dark', 'system'].map((theme) => (
              <label
                key={theme}
                className={`flex items-center justify-center p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 ${
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
                <span className={`capitalize font-medium text-xs sm:text-sm lg:text-base ${
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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          Security
        </h3>
        <div className="space-y-2 sm:space-y-4">
          <button className="btn btn-outline w-full justify-start text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4">
            <KeyIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span className="truncate">Change Password</span>
          </button>
          <button className="btn btn-outline w-full justify-start text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4">
            <DevicePhoneMobileIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span className="truncate">Enable Two-Factor Authentication</span>
          </button>
          <button className="btn btn-outline w-full justify-start text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4">
            <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span className="truncate">Active Sessions</span>
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-dark-600 pt-4 sm:pt-6">
        <h3 className="text-base sm:text-lg font-semibold text-error-600 mb-3 sm:mb-4">
          Danger Zone
        </h3>
        <div className="space-y-2 sm:space-y-4">
          <button className="btn bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800 text-error-600 dark:text-error-400 hover:bg-error-100 dark:hover:bg-error-900/30 w-full justify-start text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4">
            <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span className="truncate">Deactivate Account</span>
          </button>
          <button className="btn bg-error-600 hover:bg-error-700 text-white w-full justify-start text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4">
            <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span className="truncate">Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationDemo = () => (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Notification Theme Demo
        </h3>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
          Test the new compact notification messages with improved styling.
        </p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <button
          onClick={() => showSuccess('Success!', 'Action completed.')}
          className="bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />
          <span className="hidden xs:inline">Success</span>
        </button>

        <button
          onClick={() => showError('Error!', 'Please try again.')}
          className="bg-gradient-to-r from-error-600 to-error-700 hover:from-error-700 hover:to-error-800 text-white px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <XCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />
          <span className="hidden xs:inline">Error</span>
        </button>

        <button
          onClick={() => showWarning('Warning!', 'Review before proceeding.')}
          className="bg-gradient-to-r from-warning-600 to-warning-700 hover:from-warning-700 hover:to-warning-800 text-white px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <BellIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />
          <span className="hidden xs:inline">Warning</span>
        </button>

        <button
          onClick={() => showInfo('Info', 'Helpful information.')}
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <BellIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />
          <span className="hidden xs:inline">Info</span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-3 sm:p-4 lg:p-6 border border-primary-200/50 dark:border-primary-700/50">
        <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-primary-800 dark:text-primary-200 mb-2 sm:mb-3">
          Updated Notification Features
        </h4>
        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          <li>• Compact notification boxes with smaller font sizes</li>
          <li>• Consistent gradient backgrounds matching demo style</li>
          <li>• Enhanced mobile responsiveness and readability</li>
          <li>• Improved contrast and accessibility</li>
          <li>• Optimized for all screen sizes and devices</li>
        </ul>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100">
          Extended Examples
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
          <button
            onClick={() => showToast('Booking confirmed! Check email for details.', 'success', 6000)}
            className="p-2.5 sm:p-3 lg:p-4 bg-white dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/10 transition-all duration-300 text-left"
          >
            <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">Booking Success</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Extended notification</div>
          </button>

          <button
            onClick={() => showToast('Payment failed. Check card details.', 'error', 5000)}
            className="p-2.5 sm:p-3 lg:p-4 bg-white dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-error-300 hover:bg-error-50 dark:hover:bg-error-900/10 transition-all duration-300 text-left"
          >
            <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">Payment Failed</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Error notification</div>
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
      case 'demo':
        return renderNotificationDemo();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="py-4 sm:py-6 lg:py-12 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/20 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 min-h-screen">
      <div className="container-responsive">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 bg-white dark:bg-dark-800 rounded-xl lg:rounded-2xl shadow-card p-2 sm:p-3 lg:p-4 overflow-x-auto lg:overflow-x-visible">
              <div className="flex lg:flex-col space-x-1 sm:space-x-2 lg:space-x-0 lg:space-y-1 min-w-max lg:min-w-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center lg:justify-start space-x-0 lg:space-x-2 xl:space-x-3 px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 lg:py-3 text-center lg:text-left rounded-md lg:rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-xs lg:text-base flex-shrink-0 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                      <span className="hidden sm:inline lg:inline ml-1 lg:ml-0 text-xs lg:text-base">
                        {tab.id === 'demo' ? 'Demo' : tab.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-dark-800 rounded-xl lg:rounded-2xl shadow-card p-3 sm:p-4 md:p-6 lg:p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {renderTabContent()}
              
              {/* Save Button */}
              <div className="mt-4 sm:mt-6 lg:mt-8 pt-3 sm:pt-4 lg:pt-6 border-t border-gray-200 dark:border-dark-600">
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
                  <button className="btn btn-ghost order-2 sm:order-1 text-sm sm:text-base py-2 sm:py-2.5 lg:py-3">
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="btn btn-primary order-1 sm:order-2 text-sm sm:text-base py-2 sm:py-2.5 lg:py-3"
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