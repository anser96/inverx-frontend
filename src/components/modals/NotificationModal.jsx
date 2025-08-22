import React from 'react';

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'error', // 'error', 'warning', 'success', 'info'
  buttonText = 'Entendido'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          gradient: 'from-red-500/20 to-pink-500/20',
          border: 'border-red-500/30',
          icon: (
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          buttonGradient: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
        };
      case 'warning':
        return {
          gradient: 'from-yellow-500/20 to-orange-500/20',
          border: 'border-yellow-500/30',
          icon: (
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          buttonGradient: 'from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
        };
      case 'success':
        return {
          gradient: 'from-green-500/20 to-emerald-500/20',
          border: 'border-green-500/30',
          icon: (
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          buttonGradient: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
        };
      case 'info':
      default:
        return {
          gradient: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-blue-500/30',
          icon: (
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          buttonGradient: 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${styles.gradient} border ${styles.border} flex items-center justify-center`}>
            {styles.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 bg-gradient-to-r ${styles.buttonGradient} text-white rounded-lg transition-all duration-200 font-medium hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;