import React from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoClose } from 'react-icons/io5';

const AlertModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'success', // 'success' | 'error' | 'warning' | 'info'
  showCloseButton = true,
  onConfirm = null,
  confirmText = 'OK',
  cancelText = 'Cancel',
  isDanger = false // For error modals with dangerous actions
}) => {
  if (!isOpen) return null;

  // Define colors based on type
  const typeStyles = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      titleColor: 'text-green-700',
      icon: <IoCheckmarkCircle className="w-12 h-12 text-green-600" />,
      buttonColor: 'bg-green-600 hover:bg-green-700',
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-700',
      icon: <IoCloseCircle className="w-12 h-12 text-red-600" />,
      buttonColor: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      titleColor: 'text-yellow-700',
      icon: <IoCloseCircle className="w-12 h-12 text-yellow-600" />,
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-700',
      icon: <IoCheckmarkCircle className="w-12 h-12 text-blue-600" />,
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const styles = typeStyles[type] || typeStyles.success;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${styles.bgColor} border ${styles.borderColor} rounded-xl shadow-2xl max-w-md w-full p-8`}>
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose className="w-6 h-6" />
          </button>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-6">
          {styles.icon}
        </div>

        {/* Title */}
        <h2 className={`${styles.titleColor} text-2xl font-bold text-center mb-3`}>
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-700 text-center mb-8 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
          >
            {cancelText === 'OK' ? 'Close' : cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 text-white ${styles.buttonColor} rounded-lg font-semibold transition-colors`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
