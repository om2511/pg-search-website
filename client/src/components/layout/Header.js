// src/components/layout/Header.js - Enhanced Modern Header
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  MagnifyingGlassIcon,
  BellIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  BuildingOfficeIcon,
  PlusCircleIcon,
  ChartBarIcon,
  InformationCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import SearchAutocomplete from '../common/SearchAutocomplete';
import NotificationBell from '../common/NotificationBell';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (searchData) => {
    const queryParams = new URLSearchParams();
    if (searchData.city) queryParams.append('city', searchData.city);
    if (searchData.query) queryParams.append('q', searchData.query);
    navigate(`/listings?${queryParams.toString()}`);
    setShowSearch(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navigationLinks = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Browse PGs', href: '/listings', icon: BuildingOfficeIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
  ];

  const ownerLinks = [
    { name: 'Add PG', href: '/add-pg', icon: PlusCircleIcon },
    { name: 'Dashboard', href: '/owner/dashboard', icon: ChartBarIcon },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-700 shadow-lg">
      <div className="container-responsive">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 transform group-hover:scale-110">
                <BuildingOfficeIcon className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-accent-500 to-warning-500 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-display font-bold text-gradient">
                FindMyPG
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Premium Living Spaces
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    isActivePath(link.href)
                      ? 'bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 text-primary-700 dark:text-primary-300 shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {isAuthenticated && user?.role === 'owner' && (
              <>
                {ownerLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                        isActivePath(link.href)
                          ? 'bg-gradient-to-r from-accent-100 to-warning-100 dark:from-accent-900 dark:to-warning-900 text-accent-700 dark:text-accent-300 shadow-md'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-accent-600 dark:hover:text-accent-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full" ref={searchRef}>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="w-full flex items-center space-x-3 px-4 py-2.5 bg-gray-100 dark:bg-dark-800 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span className="text-sm">Search PGs, locations...</span>
              </button>

              {showSearch && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-600 p-4 animate-slide-down">
                  <SearchAutocomplete onSearch={handleSearch} />
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300 transform hover:scale-110"
            >
              {isDark ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Search */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <NotificationBell />

                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300 transform hover:scale-110"
                >
                  <HeartIcon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Link>

                {/* User Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-md">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <UserIcon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </Menu.Button>

                  <Transition
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-1 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-1 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-600 py-2 focus:outline-none animate-slide-down">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-600">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-200 ${
                              active
                                ? 'bg-gray-100 dark:bg-dark-700 text-primary-600 dark:text-primary-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <UserIcon className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"
                            className={`flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-200 ${
                              active
                                ? 'bg-gray-100 dark:bg-dark-700 text-primary-600 dark:text-primary-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <Cog6ToothIcon className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                        )}
                      </Menu.Item>

                      {user?.role === 'owner' && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/owner/dashboard"
                              className={`flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-200 ${
                                active
                                  ? 'bg-gray-100 dark:bg-dark-700 text-accent-600 dark:text-accent-400'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <ChartBarIcon className="w-4 h-4" />
                              <span>Dashboard</span>
                            </Link>
                          )}
                        </Menu.Item>
                      )}

                      <div className="border-t border-gray-200 dark:border-dark-600 mt-2">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`flex items-center space-x-3 px-4 py-3 text-sm w-full text-left transition-all duration-200 ${
                                active
                                  ? 'bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <ArrowRightOnRectangleIcon className="w-4 h-4" />
                              <span>Sign out</span>
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300"
            >
              {isOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <Transition
          show={isOpen}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-1 translate-y-0"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-1 translate-y-0"
          leaveTo="opacity-0 -translate-y-2"
        >
          <div className="lg:hidden pb-4 border-t border-gray-200 dark:border-dark-700 mt-4">
            <div className="flex flex-col space-y-2 pt-4">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isActivePath(link.href)
                        ? 'bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {isAuthenticated && user?.role === 'owner' && (
                <>
                  {ownerLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          isActivePath(link.href)
                            ? 'bg-gradient-to-r from-accent-100 to-warning-100 dark:from-accent-900 dark:to-warning-900 text-accent-700 dark:text-accent-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </>
              )}

              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-dark-700">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-ghost"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-primary"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Transition>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-dark-700 mt-4">
            <div className="pt-4">
              <SearchAutocomplete onSearch={handleSearch} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;