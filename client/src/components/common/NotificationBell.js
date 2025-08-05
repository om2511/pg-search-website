import React, { useState, useEffect } from 'react';
import { BellIcon, CheckIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Mock notifications - replace with real API call
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'PG Listing Approved',
        message: 'Your PG "Sunshine Residency" has been approved and is now live.',
        time: '2 minutes ago',
        read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'New Inquiry',
        message: 'You have a new inquiry for "Green Valley PG".',
        time: '1 hour ago',
        read: false
      },
      {
        id: 3,
        type: 'warning',
        title: 'Payment Reminder',
        message: 'Your subscription expires in 3 days.',
        time: '1 day ago',
        read: true
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckIcon className="w-5 h-5 text-success-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-warning-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-error-600" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-primary-600" />;
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-all duration-300 transform hover:scale-110">
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Menu.Button>

      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-1 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-1 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-600 py-2 focus:outline-none animate-slide-down">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-dark-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Menu.Item key={notification.id}>
                  <div
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </Menu.Item>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <BellIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-dark-600 px-4 py-3">
            <button className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:underline">
              View all notifications
            </button>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationBell;