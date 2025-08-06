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
          bgColor: 'bg-gradient-to-r from-success-50 to-secondary-50 dark:from-success-900/20 dark:to-secondary-900/20',
          borderColor: 'border border-success-200/50 dark:border-success-700/50',
          iconColor: 'text-success-600 dark:text-success-400',
          titleColor: 'text-success-800 dark:text-success-200',
          shadowColor: 'shadow-success-200/25 dark:shadow-success-900/25',
          glowEffect: 'hover:shadow-lg hover:shadow-success-200/30 dark:hover:shadow-success-900/30'
        };
      case 'error':
        return {
          icon: XCircleIcon,
          bgColor: 'bg-gradient-to-r from-error-50 to-accent-50 dark:from-error-900/20 dark:to-accent-900/20',
          borderColor: 'border border-error-200/50 dark:border-error-700/50',
          iconColor: 'text-error-600 dark:text-error-400',
          titleColor: 'text-error-800 dark:text-error-200',
          shadowColor: 'shadow-error-200/25 dark:shadow-error-900/25',
          glowEffect: 'hover:shadow-lg hover:shadow-error-200/30 dark:hover:shadow-error-900/30'
        };
      case 'warning':
        return {
          icon: ExclamationTriangleIcon,
          bgColor: 'bg-gradient-to-r from-warning-50 to-amber-50 dark:from-warning-900/20 dark:to-amber-900/20',
          borderColor: 'border border-warning-200/50 dark:border-warning-700/50',
          iconColor: 'text-warning-600 dark:text-warning-400',
          titleColor: 'text-warning-800 dark:text-warning-200',
          shadowColor: 'shadow-warning-200/25 dark:shadow-warning-900/25',
          glowEffect: 'hover:shadow-lg hover:shadow-warning-200/30 dark:hover:shadow-warning-900/30'
        };
      default:
        return {
          icon: InformationCircleIcon,
          bgColor: 'bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20',
          borderColor: 'border border-primary-200/50 dark:border-primary-700/50',
          iconColor: 'text-primary-600 dark:text-primary-400',
          titleColor: 'text-primary-800 dark:text-primary-200',
          shadowColor: 'shadow-primary-200/25 dark:shadow-primary-900/25',
          glowEffect: 'hover:shadow-lg hover:shadow-primary-200/30 dark:hover:shadow-primary-900/30'
        };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <div
      className={`transform transition-all duration-500 ease-out ${
        isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div
        className={`w-full sm:max-w-sm ${config.bgColor} ${config.borderColor} ${config.shadowColor} ${config.glowEffect} backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 transition-all duration-300 hover:scale-105`}
      >
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 dark:bg-dark-800/80 flex items-center justify-center shadow-sm`}>
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={`text-sm sm:text-base font-semibold ${config.titleColor} mb-1 leading-tight`}>
                {title}
              </h4>
            )}
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {message || title}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose(id), 300);
            }}
            className="flex-shrink-0 p-1 sm:p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-dark-700/60 transition-all duration-200 group"
          >
            <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
