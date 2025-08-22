import React from 'react';

const MessageModal = ({ 
  isOpen, 
  onClose, 
  message, 
  type = 'info' // 'success', 'error', 'warning', 'info'
}) => {
  if (!isOpen || !message) return null;

  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: (
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          bgGradient: 'from-green-500/20 to-emerald-500/20',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-300',
          buttonGradient: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
        };
      case 'error':
        return {
          icon: (
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          bgGradient: 'from-red-500/20 to-pink-500/20',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-300',
          buttonGradient: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          bgGradient: 'from-yellow-500/20 to-orange-500/20',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-300',
          buttonGradient: 'from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
        };
      default: // info
        return {
          icon: (
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bgGradient: 'from-blue-500/20 to-cyan-500/20',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-300',
          buttonGradient: 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        };
    }
  };

  const { icon, bgGradient, borderColor, textColor, buttonGradient } = getIconAndColors();

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Éxito';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Advertencia';
      default:
        return 'Información';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-6">
          {/* Icon and Title */}
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${bgGradient} border ${borderColor} rounded-full flex items-center justify-center`}>
              {icon}
            </div>
            <h3 className={`text-2xl font-bold ${textColor}`}>
              {getTitle()}
            </h3>
          </div>
          
          {/* Message */}
          <div className={`bg-gradient-to-r ${bgGradient} border ${borderColor} rounded-xl p-4`}>
            <p className="text-white text-center leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`w-full px-6 py-3 bg-gradient-to-r ${buttonGradient} text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center space-x-2`}
          >
            <span>Entendido</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;