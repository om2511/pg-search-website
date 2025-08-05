import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Toast = ({ id, type = 'info', title, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, id]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircleIcon,
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          iconColor: 'text-green-600 dark:text-green-400',
          titleColor: 'text-green-800 dark:text-green-200'
        };
      case 'error':
        return {
          icon: XCircleIcon,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          iconColor: 'text-red-600 dark:text-red-400',
          titleColor: 'text-red-800 dark:text-red-200'
        };
      case 'warning':
        return {
          icon: ExclamationTriangleIcon,
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          titleColor: 'text-yellow-800 dark:text-yellow-200'
        };
      default:
        return {
          icon: InformationCircleIcon,
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          iconColor: 'text-blue-600 dark:text-blue-400',
          titleColor: 'text-blue-800 dark:text-blue-200'
        };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <div
      className={`transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`max-w-sm w-full ${config.bgColor} ${config.borderColor} border rounded-2xl shadow-lg p-4`}
      >
        <div className="flex items-start space-x-3">
          <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold ${config.titleColor}`}>
              {title}
            </h4>
            {message && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {message}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose(id), 300);
            }}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
