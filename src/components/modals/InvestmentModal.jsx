import React, { useState } from 'react';

const InvestmentModal = ({ 
  isOpen, 
  onClose, 
  selectedProject, 
  onInvest, 
  formatCOP 
}) => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInvest = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    if (parseFloat(investmentAmount) < selectedProject?.minInvestment) {
      alert(`El monto mínimo de inversión es ${formatCOP(selectedProject.minInvestment)}`);
      return;
    }

    if (parseFloat(investmentAmount) > selectedProject?.maxInvestment) {
      alert(`El monto máximo de inversión es ${formatCOP(selectedProject.maxInvestment)}`);
      return;
    }

    setIsProcessing(true);
    try {
      await onInvest(selectedProject.id, investmentAmount);
      setInvestmentAmount('');
      onClose();
    } catch (error) {
      console.error('Error processing investment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setInvestmentAmount('');
      onClose();
    }
  };

  if (!isOpen || !selectedProject) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Invertir en Proyecto
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
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-2">{selectedProject.name}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Rentabilidad:</p>
                <p className="text-green-400 font-semibold">{((selectedProject.expectedReturnRate || selectedProject.profitability || 0) * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Duración:</p>
                <p className="text-blue-400 font-semibold">{selectedProject.durationDays || selectedProject.duration || 'N/A'} días</p>
              </div>
              <div>
                <p className="text-gray-400">Mín. Inversión:</p>
                <p className="text-purple-400 font-semibold">{formatCOP(selectedProject.minInvestment)}</p>
              </div>
              <div>
                <p className="text-gray-400">Máx. Inversión:</p>
                <p className="text-cyan-400 font-semibold">{formatCOP(selectedProject.maxInvestment)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Monto a Invertir
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="0"
                disabled={isProcessing}
                className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 disabled:opacity-50"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Mín: {formatCOP(selectedProject.minInvestment)}</span>
              <span>Máx: {formatCOP(selectedProject.maxInvestment)}</span>
            </div>
          </div>
          
          {investmentAmount && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-green-300 font-medium">Ganancia Estimada:</span>
                <span className="text-green-400 font-bold text-lg">
                  {formatCOP(parseFloat(investmentAmount) * (selectedProject.expectedReturnRate || selectedProject.profitability || 0))}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-green-300 font-medium">Total a Recibir:</span>
                <span className="text-green-400 font-bold text-xl">
                  {formatCOP(parseFloat(investmentAmount) * (1 + (selectedProject.expectedReturnRate || selectedProject.profitability || 0)))}
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
              onClick={handleInvest}
              disabled={isProcessing || !investmentAmount || parseFloat(investmentAmount) <= 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <span>Invertir Ahora</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;