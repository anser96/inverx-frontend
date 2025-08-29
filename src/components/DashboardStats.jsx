import React from 'react';
import { isUserAdmin } from '../utils/tokenUtils';

const DashboardStats = ({ 
  userInfo, 
  dashboardData, 
  detailedBalance, 
  detailedBalanceInfo,
  projects, 
  formatCOP, 
  setShowTopUpModal, 
  setShowWithdrawModal, 
  refreshAllData,
  onAdminAccess 
}) => {
  // Calcular proyectos activos desde el frontend
  const activeProjectsCount = projects ? projects.filter(p => p.status === true).length : 0;
  
  // Función para obtener el balance disponible (depósitos sin invertir)
  const getAvailableBalance = () => {
    return detailedBalance?.uninvestedDeposits || 0;
  };
  
  return (
    <>
      {/* Información del usuario */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 mb-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-full flex items-center justify-center border-2 border-white/20">
              <span className="text-2xl font-bold text-white">
                {/*userInfo?.fullName?.charAt(0) || 'U'*/}
              </span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ¡Hola, {userInfo?.fullName}!
                {console.log("Informacion del usuario:",userInfo)}
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                Bienvenido a tu panel de inversiones
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Balance Total</p>
            <p className="text-2xl sm:text-3xl font-bold text-cyan-300">
              {formatCOP(detailedBalanceInfo?.availableBalance || getAvailableBalance())}
            </p>
            {detailedBalanceInfo && !detailedBalanceInfo.canWithdrawNow && (
              <p className="text-yellow-400 text-xs mt-1">
                Retiro restringido hasta {detailedBalanceInfo.nextWithdrawalDate}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas principales - Tres secciones del balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="backdrop-blur-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">Balance Total</p>
              <p className="text-2xl font-bold text-white mt-2">
                {formatCOP(detailedBalance?.totalBalance || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className={`backdrop-blur-xl bg-gradient-to-br border rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
          detailedBalanceInfo?.canWithdrawNow 
            ? 'from-green-600/20 to-emerald-600/20 border-white/20 hover:shadow-green-500/10' 
            : 'from-yellow-600/20 to-orange-600/20 border-yellow-400/30 hover:shadow-yellow-500/10'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">
                {detailedBalanceInfo?.canWithdrawNow ? 'Retirable Ahora' : 'Retiro Restringido'}
              </p>
              <p className="text-2xl font-bold text-white mt-2">
                {formatCOP(detailedBalanceInfo?.currentlyWithdrawable || detailedBalance?.availableToWithdraw || 0)}
              </p>
              {detailedBalanceInfo && !detailedBalanceInfo.canWithdrawNow && (
                <p className="text-yellow-300 text-xs mt-1">
                  Disponible: {detailedBalanceInfo.nextWithdrawalDate}
                </p>
              )}
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r rounded-full flex items-center justify-center ${
              detailedBalanceInfo?.canWithdrawNow 
                ? 'from-green-500/30 to-emerald-500/30' 
                : 'from-yellow-500/30 to-orange-500/30'
            }`}>
              {detailedBalanceInfo?.canWithdrawNow ? (
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">Depósitos Sin Invertir</p>
              <p className="text-2xl font-bold text-white mt-2">
                {formatCOP(detailedBalance?.uninvestedDeposits || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">Total Invertido</p>
              <p className="text-2xl font-bold text-white mt-2">
                {formatCOP(dashboardData?.totalInvested || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">Proyectos Activos</p>
              <p className="text-2xl font-bold text-white mt-2">
                {activeProjectsCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <button 
          onClick={() => setShowTopUpModal(true)}
          className="group backdrop-blur-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-white/20 hover:border-green-400/30 rounded-2xl p-4 transition-all duration-300 shadow-xl hover:shadow-green-500/20"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-white font-medium text-sm group-hover:text-green-300 transition-colors duration-300">
              Recargar
            </span>
          </div>
        </button>

        <button 
          onClick={() => setShowWithdrawModal(true)}
          className="group backdrop-blur-xl bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 border border-white/20 hover:border-red-400/30 rounded-2xl p-4 transition-all duration-300 shadow-xl hover:shadow-red-500/20"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <span className="text-white font-medium text-sm group-hover:text-red-300 transition-colors duration-300">
              Retirar
            </span>
          </div>
        </button>

        <button 
          onClick={refreshAllData}
          className="group backdrop-blur-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 border border-white/20 hover:border-blue-400/30 rounded-2xl p-4 transition-all duration-300 shadow-xl hover:shadow-blue-500/20"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors duration-300">
              Actualizar
            </span>
          </div>
        </button>

        {isUserAdmin() && (
          <button 
            onClick={onAdminAccess}
            className="group backdrop-blur-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 border border-white/20 hover:border-purple-400/30 rounded-2xl p-4 transition-all duration-300 shadow-xl hover:shadow-purple-500/20"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm group-hover:text-purple-300 transition-colors duration-300">
                Admin
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Alerta de fondos no invertidos */}
      {detailedBalance && detailedBalance.uninvestedDeposits > 0 && (
        <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                Tienes fondos sin invertir
              </h3>
              <p className="text-yellow-100 mb-4">
                Tienes <span className="font-bold">{formatCOP(detailedBalance.uninvestedDeposits)}</span> en depósitos que aún no has invertido. 
                ¡Invierte ahora para comenzar a generar ganancias!
              </p>
              <button 
                onClick={() => {
                  // Scroll to projects section
                  const projectsSection = document.querySelector('[data-section="projects"]');
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/25"
              >
                Ver Proyectos Disponibles
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardStats;