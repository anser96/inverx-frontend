import React, { useState } from 'react';
import NotificationModal from './NotificationModal';

const TopUpModal = ({ 
  isOpen, 
  onClose, 
  onTopUp, 
  formatCOP 
}) => {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: ingreso de monto, 2: mensaje QR
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'error' });

  const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000];



  const showNotification = (title, message, type = 'error') => {
    setNotification({ isOpen: true, title, message, type });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, title: '', message: '', type: 'error' });
  };

  const handleClose = () => {
    if (!isProcessing) {
      setTopUpAmount('');
      setCurrentStep(1);
      closeNotification();
      onClose();
    }
  };

  const handleConfirmAmount = () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      showNotification('Monto Inválido', 'Por favor ingresa un monto válido para continuar con la recarga.');
      return;
    }

    if (parseFloat(topUpAmount) < 10000) {
      showNotification('Monto Insuficiente', 'El monto mínimo de recarga es $10,000 COP. Por favor ingresa un monto mayor.', 'warning');
      return;
    }

    setCurrentStep(2);
  };

  const handleFinalConfirm = async () => {
    setIsProcessing(true);
    try {
      await onTopUp(topUpAmount);
      setTopUpAmount('');
      setCurrentStep(1);
      onClose();
    } catch (error) {
      // Error handling - could be replaced with user notification
    } finally {
      setIsProcessing(false);
    }
  };

  const goBackToStep1 = () => {
    setCurrentStep(1);
  };

  const selectPredefinedAmount = (amount) => {
    setTopUpAmount(amount.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-3 sm:mb-6">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent pr-2">
            Recargar Saldo
          </h3>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 flex-shrink-0 p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {currentStep === 1 ? (
            // PASO 1: Ingreso de monto
            <>
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-300 font-medium">Información</span>
                </div>
                <p className="text-green-200 text-sm">
                  Recarga tu saldo para poder realizar inversiones. El monto mínimo es de $10,000 COP.
                </p>
              </div> 
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monto a Recargar
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="0"
                    disabled={isProcessing}
                    className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 disabled:opacity-50"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Mínimo: $10,000 COP</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Montos Sugeridos
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => selectPredefinedAmount(amount)}
                      disabled={isProcessing}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 ${
                        topUpAmount === amount.toString()
                          ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                          : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {formatCOP(amount)}
                    </button>
                  ))}
                </div>
              </div>
              
              {topUpAmount && parseFloat(topUpAmount) >= 10000 && (
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-300 font-medium">Monto a Recargar:</span>
                    <span className="text-blue-400 font-bold text-xl">
                      {formatCOP(parseFloat(topUpAmount))}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-gray-600/30 hover:bg-gray-600/50 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmAmount}
                  disabled={isProcessing || !topUpAmount || parseFloat(topUpAmount) < 10000}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span>Confirmar Monto</span>
                </button>
              </div>
            </>
          ) : (
            // PASO 2: Mensaje QR y confirmación final
            <>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-purple-300 mb-3">
                  Por favor consigne su monto solicitado a este QR
                </h4>
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20 mb-4">
                  <p className="text-purple-200 font-medium mb-2">Monto a consignar:</p>
                  <p className="text-purple-100 font-bold text-2xl">
                    {formatCOP(parseFloat(topUpAmount))}
                  </p>
                </div>
              </div>
              
              {/* QR Code Real */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center border-4 border-gray-300 p-2">
                    <img 
                      src={`${process.env.PUBLIC_URL}/QR.jpeg`} 
                      alt="Código QR para pago" 
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-2">Escanea este código QR para realizar el pago</p>
                <p className="text-gray-400 text-xs">Código QR oficial para pagos</p>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={goBackToStep1}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-gray-600/30 hover:bg-gray-600/50 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Volver</span>
                </button>
                <button
                  onClick={handleFinalConfirm}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>OK</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default TopUpModal;