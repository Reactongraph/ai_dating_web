'use client';

import { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: 'primary' | 'danger';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonVariant = 'primary',
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confirmButtonClasses =
    confirmButtonVariant === 'danger'
      ? 'bg-red-500 hover:bg-red-600 text-white font-medium'
      : 'bg-primary-500 hover:bg-primary-600 text-white font-medium';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Backdrop - subtle overlay that keeps page visible */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Enhanced Modal */}
      <div className="relative bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 mx-4 max-w-sm w-full border border-gray-600/50 shadow-2xl">
        {/* Content */}
        <div className="text-center">
          {/* Enhanced Warning Icon */}
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 mb-6">
            <svg
              className="w-8 h-8 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Enhanced Title */}
          <h3 className="text-lg font-semibold text-white mb-4 leading-tight px-2">
            {title}
          </h3>

          {/* Message (only show if provided) */}
          {message && (
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              {message}
            </p>
          )}

          {/* Enhanced Buttons */}
          <div className="space-y-3">
            {/* Continue/Cancel Button */}
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02]"
            >
              {cancelText}
            </button>

            {/* Confirm/Danger Button */}
            <button
              onClick={onConfirm}
              className={`w-full px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${confirmButtonClasses}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
