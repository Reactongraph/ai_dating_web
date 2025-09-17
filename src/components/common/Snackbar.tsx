'use client';

import { useEffect, useState } from 'react';
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
  IoWarning,
} from 'react-icons/io5';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarProps {
  message: string;
  type?: SnackbarType;
  duration?: number;
  onClose?: () => void;
  isVisible: boolean;
}

const Snackbar = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  isVisible,
}: SnackbarProps) => {
  const [isShowing, setIsShowing] = useState(isVisible);

  useEffect(() => {
    setIsShowing(isVisible);

    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isShowing) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle className="w-6 h-6" />;
      case 'error':
        return <IoCloseCircle className="w-6 h-6" />;
      case 'warning':
        return <IoWarning className="w-6 h-6" />;
      default:
        return <IoInformationCircle className="w-6 h-6" />;
    }
  };

  const getStyles = () => {
    const baseStyles =
      'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300';

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-900/90 text-green-100 border border-green-700`;
      case 'error':
        return `${baseStyles} bg-red-900/90 text-red-100 border border-red-700`;
      case 'warning':
        return `${baseStyles} bg-yellow-900/90 text-yellow-100 border border-yellow-700`;
      default:
        return `${baseStyles} bg-blue-900/90 text-blue-100 border border-blue-700`;
    }
  };

  return (
    <div className={getStyles()}>
      <div className="mr-3">{getIcon()}</div>
      <div className="flex-1 text-sm md:text-base">{message}</div>
      <button
        onClick={() => {
          setIsShowing(false);
          if (onClose) onClose();
        }}
        className="ml-4 text-gray-300 hover:text-white"
        aria-label="Close"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Snackbar;
