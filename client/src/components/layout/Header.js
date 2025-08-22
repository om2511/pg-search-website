// src/components/layout/Header.js - Enhanced Modern Header
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
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
  PhoneIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import SearchAutocomplete from '../common/SearchAutocomplete';
import NotificationBell from '../common/NotificationBell';
import { getAvatarUrl, getUserInitials } from '../../utils/imageUtils';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { wishlist } = useWishlist();
  const { showSuccess } = useToast();
  const wishlistCount = wishlist.length;
  const navigate = useNavigate();
  const location = useLocation();

  // Prevent body scroll lock when dropdowns are open
  useEffect(() => {
    const preventScrollLock = () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };

    // Set up a mutation observer to watch for changes
    const observer = new MutationObserver(() => {
      preventScrollLock();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    preventScrollLock();

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLogout = () => {
    logout();
    showSuccess('Signed out successfully', 'Come back soon!');
    navigate('/');
  };

  const handleSearch = (searchData) => {
    const queryParams = new URLSearchParams();
    if (searchData.city) queryParams.append('city', searchData.city);
    if (searchData.query) queryParams.append('q', searchData.query);
    if (searchData.search) queryParams.append('q', searchData.search);
    navigate(`/listings?${queryParams.toString()}`);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navigationLinks = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Browse PGs', href: '/listings', icon: BuildingOfficeIcon },
  ];

  const moreLinks = [
    { name: 'About', href: '/about', icon: InformationCircleIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
  ];

  const ownerLinks = [
    { name: 'Add PG', href: '/add-pg', icon: PlusCircleIcon },
    { name: 'Dashboard', href: '/owner/dashboard', icon: ChartBarIcon },
  ];

  // Combine more links with owner links for authenticated owners
  const getMoreDropdownLinks = () => {
    let links = [...moreLinks];
    if (isAuthenticated && user?.role === 'owner') {
      links = [...links, ...ownerLinks];
    }
    return links;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-700 shadow-lg">
      <div className="container-responsive">
        <div className="flex justify-between items-center py-2 md:py-3 lg:py-4 gap-2 sm:gap-4 lg:gap-8">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 transform group-hover:scale-110 overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="FindMyPG Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-accent-500 to-warning-500 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden xs:block sm:block">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-gradient">
                FindMyPG
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">
                Premium Living Spaces
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-shrink-0 ml-4 xl:ml-8">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-sm lg:text-base ${
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

            {/* More Dropdown */}
            <Menu as="div" className="relative dropdown-container">
              {({ open }) => (
                <>
                  <Menu.Button className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none text-sm lg:text-base ${
                    open || getMoreDropdownLinks().some(link => isActivePath(link.href))
                      ? 'bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 text-primary-700 dark:text-primary-300 shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}>
                    <EllipsisHorizontalIcon className="w-4 h-4" />
                    <span>More</span>
                  </Menu.Button>

                  <Transition
                    show={open}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-1 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-1 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Menu.Items 
                      static
                      className="dropdown-content left-0 mt-2 w-44 lg:w-48 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-600 py-2 focus:outline-none animate-slide-down"
                    >
                      {getMoreDropdownLinks().map((link, index) => {
                        const Icon = link.icon;
                        const isOwnerLink = ownerLinks.some(ownerLink => ownerLink.href === link.href);
                        return (
                          <Menu.Item key={link.name}>
                            {({ active, close }) => (
                              <Link
                                to={link.href}
                                onClick={() => close()}
                                className={`flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-200 ${
                                  isActivePath(link.href)
                                    ? isOwnerLink
                                      ? 'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300'
                                      : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                    : active
                                    ? isOwnerLink
                                      ? 'bg-gray-100 dark:bg-dark-700 text-accent-600 dark:text-accent-400'
                                      : 'bg-gray-100 dark:bg-dark-700 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                                <span>{link.name}</span>
                              </Link>
                            )}
                          </Menu.Item>
                        );
                      })}
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm xl:max-w-md mx-2 lg:mx-4 xl:mx-6">
            <div className="w-full [&>*]:!py-1 lg:[&>*]:!py-2.5">
              <SearchAutocomplete onSearch={handleSearch} />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Search - Centered */}
            <div className="md:hidden flex-1 max-w-[160px] sm:max-w-[200px] mx-auto">
              <div className="w-full [&>*]:!py-1 [&>*]:!text-sm">
                <SearchAutocomplete onSearch={handleSearch} />
              </div>
            </div>

            {/* Desktop Icons - Hidden on mobile/tablet */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300 transform hover:scale-110"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>

              {isAuthenticated && (
                <>
                  {/* Notifications */}
                  <div className="[&>div>button]:p-2.5 [&>div>button]:rounded-xl [&>div>button]:bg-gray-100 [&>div>button]:dark:bg-dark-800 [&>div>button]:text-gray-600 [&>div>button]:dark:text-gray-400 [&>div>button]:hover:bg-gray-200 [&>div>button]:dark:hover:bg-dark-700 [&>div>button]:transition-all [&>div>button]:duration-300 [&>div>button]:transform [&>div>button]:hover:scale-110 [&_svg]:w-5 [&_svg]:h-5">
                    <NotificationBell />
                  </div>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300 transform hover:scale-110"
                    title="Wishlist"
                  >
                    <HeartIcon className="w-5 h-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-medium">
                        {wishlistCount > 9 ? '9+' : wishlistCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>

            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <Menu as="div" className="relative dropdown-container">
                  <Menu.Button className="flex items-center space-x-2 sm:space-x-3 p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300">
                    <div className="w-5 h-5 bg-gradient-to-r from-primary-600 to-secondary-600 rounded flex items-center justify-center shadow-md">
                      {user?.avatar && getAvatarUrl(user.avatar) ? (
                        <img
                          src={getAvatarUrl(user.avatar)}
                          alt={user.name}
                          className="w-full h-full rounded object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-full h-full rounded flex items-center justify-center text-white text-xs font-medium ${user?.avatar && getAvatarUrl(user.avatar) ? 'hidden' : 'flex'}`}
                        style={{ display: user?.avatar && getAvatarUrl(user.avatar) ? 'none' : 'flex' }}
                      >
                        {user?.name ? getUserInitials(user.name) : <UserIcon className="w-3 h-3" />}
                      </div>
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
                    <Menu.Items 
                      static
                      className="dropdown-content right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-600 py-2 focus:outline-none animate-slide-down"
                    >
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
              <div className="hidden lg:flex items-center space-x-2 sm:space-x-3">
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm text-xs sm:text-sm"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm text-xs sm:text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300"
              title="Menu"
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
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] ${
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

              {/* More Links in Mobile */}
              {getMoreDropdownLinks().map((link) => {
                const Icon = link.icon;
                const isOwnerLink = ownerLinks.some(ownerLink => ownerLink.href === link.href);
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] ${
                      isActivePath(link.href)
                        ? isOwnerLink
                          ? 'bg-gradient-to-r from-accent-100 to-warning-100 dark:from-accent-900 dark:to-warning-900 text-accent-700 dark:text-accent-300'
                          : 'bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-dark-700">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-ghost hover:!scale-[1.02]"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-primary hover:!scale-[1.02]"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Action Icons - Only visible on mobile/tablet */}
              <div className="lg:hidden pt-4 border-t border-gray-200 dark:border-dark-700">
                <div className="flex items-center justify-center space-x-4 py-2">
                  {/* Theme Toggle Mobile */}
                  <button
                    onClick={toggleTheme}
                    className="flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300"
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    {isDark ? (
                      <SunIcon className="w-5 h-5" />
                    ) : (
                      <MoonIcon className="w-5 h-5" />
                    )}
                    <span className="text-xs font-medium">Theme</span>
                  </button>

                  {isAuthenticated && (
                    <>
                      {/* Notifications Mobile */}
                      <NotificationBell />

                      {/* Wishlist Mobile */}
                      <Link
                        to="/wishlist"
                        onClick={() => setIsOpen(false)}
                        className="relative flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300"
                        title="Wishlist"
                      >
                        <HeartIcon className="w-5 h-5" />
                        {wishlistCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-medium">
                            {wishlistCount > 9 ? '9+' : wishlistCount}
                          </span>
                        )}
                        <span className="text-xs font-medium">Wishlist</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </header>
  );
};

export default Header;