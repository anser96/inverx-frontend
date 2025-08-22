import React, { useState } from 'react';

const TopUpModal = ({ 
  isOpen, 
  onClose, 
  onTopUp, 
  formatCOP 
}) => {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000];

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    if (parseFloat(topUpAmount) < 10000) {
      alert('El monto mínimo de recarga es $10,000 COP');
      return;
    }

    setIsProcessing(true);
    try {
      await onTopUp(topUpAmount);
      setTopUpAmount('');
      onClose();
    } catch (error) {
      console.error('Error processing top-up:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setTopUpAmount('');
      onClose();
    }
  };

  const selectPredefinedAmount = (amount) => {
    setTopUpAmount(amount.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Recargar Saldo
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
        
        <div className="space-y-6">
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
            <div className="grid grid-cols-2 gap-2">
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
          
          <div className="flex space-x-4">
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-gray-600/30 hover:bg-gray-600/50 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleTopUp}
              disabled={isProcessing || !topUpAmount || parseFloat(topUpAmount) < 10000}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Recargar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;