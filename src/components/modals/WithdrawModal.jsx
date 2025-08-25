import React, { useState } from 'react';
import { formatNextWithdrawalDate } from '../../utils/dateUtils';

const WithdrawModal = ({ 
  isOpen, 
  onClose, 
  onWithdraw, 
  availableBalance, 
  detailedBalanceInfo,
  formatCOP 
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);



  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    if (!phoneNumber || phoneNumber.trim() === '') {
      alert('Por favor ingresa un número de teléfono válido');
      return;
    }

    const minimumAmount = 100000; // Monto mínimo siempre 100,000 COP

    if (parseFloat(withdrawAmount) < minimumAmount) {
      alert('El monto mínimo de retiro es $100,000 COP');
      return;
    }

    const currentlyWithdrawable = detailedBalanceInfo?.currentlyWithdrawable || 0;
    
    if (parseFloat(withdrawAmount) > currentlyWithdrawable) {
      if (detailedBalanceInfo?.canWithdrawNow === false) {
        alert(`No puedes retirar en este momento. ${detailedBalanceInfo?.restrictionMessage || 'Debes esperar para realizar otro retiro.'}`);
      } else {
        alert('No tienes suficiente saldo disponible para retirar');
      }
      return;
    }

    setIsProcessing(true);
    try {
      await onWithdraw(withdrawAmount, phoneNumber);
      setWithdrawAmount('');
      setPhoneNumber('');
      onClose();
    } catch (error) {
      // Error handling - could be replaced with user notification
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setWithdrawAmount('');
      setPhoneNumber('');
      onClose();
    }
  };

  const selectPercentage = (percentage) => {
    const currentlyWithdrawable = detailedBalanceInfo?.currentlyWithdrawable || availableBalance;
    const minimumAmount = 100000; // Monto mínimo siempre 100,000 COP
    
    let amount = (currentlyWithdrawable * percentage / 100);
    
    // Asegurar que el monto no sea menor al mínimo requerido
    if (amount < minimumAmount) {
      amount = minimumAmount;
    }
    
    setWithdrawAmount(amount.toFixed(0));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl shadow-2xl mx-2 sm:mx-4 my-4 sm:my-auto min-h-fit max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Retirar Saldo
          </h3>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Balance Total Disponible */}
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
              <span className="text-blue-300 font-medium text-sm sm:text-base">Balance Total:</span>
              <span className="text-blue-400 font-bold text-lg sm:text-xl">
                {formatCOP(detailedBalanceInfo?.availableBalance || 0)}
              </span>
            </div>
          </div>

          {/* Balance Retirable Actualmente */}
          <div className={`bg-gradient-to-r border rounded-xl p-3 sm:p-4 relative overflow-hidden ${
            detailedBalanceInfo?.canWithdrawNow 
              ? 'from-green-500/20 to-emerald-500/20 border-green-500/30' 
              : 'from-red-500/20 to-pink-500/20 border-red-500/30'
          }`}>
            {/* Status indicator */}
            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
              detailedBalanceInfo?.canWithdrawNow ? 'bg-green-400' : 'bg-red-400'
            } animate-pulse`}></div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
              <span className={`font-medium text-sm sm:text-base flex items-center ${
                detailedBalanceInfo?.canWithdrawNow ? 'text-green-300' : 'text-red-300'
              }`}>
                {detailedBalanceInfo?.canWithdrawNow ? (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                Retirable Ahora:
              </span>
              <span className={`font-bold text-lg sm:text-xl ${
                detailedBalanceInfo?.canWithdrawNow ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCOP(detailedBalanceInfo?.currentlyWithdrawable || 0)}
              </span>
            </div>
            {!detailedBalanceInfo?.canWithdrawNow && detailedBalanceInfo?.nextWithdrawalDate && (
              <div className="mt-2 p-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                <div className="text-xs text-yellow-300 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Próximo retiro disponible: {formatNextWithdrawalDate(detailedBalanceInfo.nextWithdrawalDate)}
                </div>
              </div>
            )}
          </div>
          
          {/* Información de Restricciones */}
          {detailedBalanceInfo?.restrictionMessage && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-3 sm:p-4">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-yellow-300 font-medium text-sm sm:text-base">Restricción de Retiro</span>
              </div>
              <p className="text-yellow-200 text-xs sm:text-sm">
                {detailedBalanceInfo.restrictionMessage}
              </p>
            </div>
          )}

          {/* Información General */}
          <div className="bg-gradient-to-r from-gray-500/20 to-slate-500/20 border border-gray-500/30 rounded-xl p-3 sm:p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-300 font-medium text-sm sm:text-base">Información</span>
            </div>
            <ul className="text-gray-200 text-xs sm:text-sm space-y-1">
              <li>• Los retiros pueden tardar de 1 a 3 días hábiles en procesarse</li>
              <li>• Monto mínimo: $100,000 COP</li>
              <li>• Restricción de 8 días entre retiros para seguridad</li>
              <li>• Verifica tu número de teléfono antes de confirmar</li>
            </ul>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Monto a Retirar
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Ingresa el monto"
                disabled={isProcessing || !detailedBalanceInfo?.canWithdrawNow}
                min="100000"
                max={detailedBalanceInfo?.currentlyWithdrawable || 0}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Mínimo: $100,000 COP</span>
              <span>Máximo: {formatCOP(detailedBalanceInfo?.currentlyWithdrawable || 0)}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Número de Teléfono
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ej: 3001234567"
                disabled={isProcessing}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 disabled:opacity-50"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Número donde se consignará el dinero
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Retiro Rápido
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((percentage) => {
                const currentlyWithdrawable = detailedBalanceInfo?.currentlyWithdrawable || 0;
                const isSelected = withdrawAmount === ((currentlyWithdrawable * percentage / 100).toFixed(0));
                return (
                  <button
                    key={percentage}
                    onClick={() => selectPercentage(percentage)}
                    disabled={isProcessing || !detailedBalanceInfo?.canWithdrawNow || !currentlyWithdrawable}
                    className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 disabled:opacity-50 ${
                      isSelected
                        ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                        : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {percentage}%
                  </button>
                );
              })}
            </div>
          </div>
          
          {withdrawAmount && parseFloat(withdrawAmount) >= 10000 && (
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-red-300 font-medium">Monto a Retirar:</span>
                <span className="text-red-400 font-bold text-xl">
                  {formatCOP(parseFloat(withdrawAmount))}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-red-300 font-medium">Balance Restante:</span>
                <span className="text-gray-300 font-semibold">
                  {formatCOP((detailedBalanceInfo?.availableBalance || 0) - parseFloat(withdrawAmount))}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-red-300 font-medium">Retirable Restante:</span>
                <span className="text-gray-300 font-semibold">
                  {formatCOP((detailedBalanceInfo?.currentlyWithdrawable || 0) - parseFloat(withdrawAmount))}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 px-4 sm:px-6 py-3 bg-gray-600/30 hover:bg-gray-600/50 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              onClick={handleWithdraw}
              disabled={isProcessing || !withdrawAmount || !phoneNumber || parseFloat(withdrawAmount) < 100000 || parseFloat(withdrawAmount) > (detailedBalanceInfo?.currentlyWithdrawable || 0) || !detailedBalanceInfo?.canWithdrawNow}
              className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                  <span>Retirar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;