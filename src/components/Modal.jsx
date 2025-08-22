import React from 'react';

const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText = "Confirmar", cancelText = "Cancelar", type = "default", isLoading = false }) => {
  if (!isOpen) return null;

  const getModalStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-400/30 bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl';
      case 'error':
        return 'border-red-400/30 bg-gradient-to-br from-red-900/20 to-pink-900/20 backdrop-blur-xl';
      case 'warning':
        return 'border-yellow-400/30 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl';
      default:
        return 'border-blue-400/30 bg-gradient-to-br from-slate-900/20 to-blue-900/20 backdrop-blur-xl';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl max-w-md w-full border ${getModalStyles()} 
        transform transition-all duration-300 ease-out scale-100 opacity-100
        shadow-blue-500/20 hover:shadow-blue-500/30`}>
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className={`mr-4 p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 
              border border-blue-400/30 ${getIconColor()}`}>
              {getIcon()}
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
              bg-clip-text text-transparent">{title}</h3>
          </div>
          
          <div className="mb-8 text-gray-300">
            {children}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-300 bg-gradient-to-r from-gray-800/50 to-gray-700/50 
                rounded-xl border border-gray-600/30 hover:border-gray-500/50 
                transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20
                backdrop-blur-sm hover:bg-gradient-to-r hover:from-gray-700/60 hover:to-gray-600/60"
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button
                onClick={isLoading ? undefined : onConfirm}
                disabled={isLoading}
                className={`px-6 py-3 text-white rounded-xl border transition-all duration-300 
                  transform ${isLoading 
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 border-gray-500/30 cursor-not-allowed opacity-70' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-400/30 hover:border-blue-300/50 hover:shadow-lg hover:shadow-blue-500/30 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:scale-105'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  confirmText
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;