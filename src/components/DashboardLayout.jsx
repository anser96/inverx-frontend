import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isUserAdmin } from '../utils/tokenUtils';


// Components
import DashboardStats from './DashboardStats';
import ProjectsList from './ProjectsList';
import TransactionsHistory from './TransactionsHistory';
import ReferralsSection from './ReferralsSection';

// Modals
import InvestmentModal from './modals/InvestmentModal';
import TopUpModal from './modals/TopUpModal';
import WithdrawModal from './modals/WithdrawModal';
import MessageModal from './modals/MessageModal';

// Hooks
import useUserData from '../hooks/useUserData';
import useTransactions from '../hooks/useTransactions';
import useReferrals from '../hooks/useReferrals';

const DashboardLayout = () => {
  const navigate = useNavigate();
  
  // Custom hooks
  const {
    userInfo,
    dashboardData,
    detailedBalance,
    projects,
    loading: userLoading,
    refreshAllData
  } = useUserData();
  
  const {
    transactions,
    fetchTransactions,
    processWithdrawal,
    processTopUp,
    processInvestment
  } = useTransactions();
  
  const {
    referralData,
    referralsList,
    referralEarnings,
    loading: referralsLoading,
    fetchReferralSummary
  } = useReferrals();

  // Local state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Modal states
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModal, setMessageModal] = useState({ message: '', type: 'info' });

  // Utility functions
  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const showMessage = (message, type = 'info') => {
    setMessageModal({ message, type });
    setShowMessageModal(true);
  };

  // Event handlers
  const handleInvest = (project) => {
    setSelectedProject(project);
    setShowInvestmentModal(true);
  };

  const handleInvestmentSubmit = async (projectId, amount) => {
    try {
      const result = await processInvestment(projectId, amount);
      if (result.success) {
        showMessage(result.message, 'success');
        await refreshAllData();
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Error al procesar la inversión', 'error');
    }
  };

  const handleTopUpSubmit = async (amount) => {
    try {
      const result = await processTopUp(amount);
      if (result.success) {
        showMessage(result.message, 'success');
        await refreshAllData();
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Error al procesar la recarga', 'error');
    }
  };

  const handleWithdrawSubmit = async (amount, phoneNumber) => {
    try {
      const result = await processWithdrawal(amount, phoneNumber);
      if (result.success) {
        showMessage(result.message, 'success');
        await refreshAllData();
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Error al procesar el retiro', 'error');
    }
  };

  // Cargar datos de referidos al inicializar
  React.useEffect(() => {
    fetchReferralSummary();
  }, [fetchReferralSummary]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'referrals') {
      fetchReferralSummary();
    } else if (tab === 'transactions') {
      fetchTransactions();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white text-xl font-medium">Cargando Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-bounce-slow"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-400/30 shadow-lg">
                 <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 32 32" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white drop-shadow-sm"
                  >
                    {/* Letra I con estilo robusto */}
                    <rect x="4" y="4" width="6" height="24" fill="#1e3a8a" />
                    
                    {/* Letra X con estilo robusto */}
                    <polygon points="14,4 20,4 26,14 32,4 32,10 28,14 32,22 32,28 26,28 20,18 14,28 8,28 8,22 12,18 8,10 8,4 14,4" fill="#1e3a8a" />
                  </svg>
               </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  InverX Dashboard
                </h1>
                <p className="text-gray-300 text-sm">Panel de Control de Inversiones</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshAllData}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-gray-300 hover:text-white"
                title="Actualizar datos"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              
              {isUserAdmin() && (
                <button
                  onClick={handleAdminAccess}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  Admin
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
              { id: 'transactions', label: 'Transacciones', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { id: 'referrals', label: 'Referidos', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>


      
      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <DashboardStats
              userInfo={userInfo}
              dashboardData={dashboardData}
              detailedBalance={detailedBalance}
              projects={projects}
              formatCOP={formatCOP}
              setShowTopUpModal={setShowTopUpModal}
              setShowWithdrawModal={setShowWithdrawModal}
              refreshAllData={refreshAllData}
              onAdminAccess={handleAdminAccess}
            />
            <ProjectsList
              projects={projects}
              formatCOP={formatCOP}
              onInvest={handleInvest}
            />
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionsHistory
            transactions={transactions}
            formatCOP={formatCOP}
          />
        )}

        {activeTab === 'referrals' && (
          <ReferralsSection
            referralData={referralData}
            referralsList={referralsList}
            referralEarnings={referralEarnings}
            loadingReferrals={referralsLoading}
            formatCOP={formatCOP}
            userInfo={userInfo}
          />
        )}
      </main>

      {/* Modals */}
      <InvestmentModal
        isOpen={showInvestmentModal}
        onClose={() => setShowInvestmentModal(false)}
        selectedProject={selectedProject}
        onInvest={handleInvestmentSubmit}
        formatCOP={formatCOP}
      />

      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onTopUp={handleTopUpSubmit}
        formatCOP={formatCOP}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleWithdrawSubmit}
        availableBalance={detailedBalance?.availableToWithdraw}
        formatCOP={formatCOP}
      />

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        message={messageModal.message}
        type={messageModal.type}
      />
    </div>
  );
};

export default DashboardLayout;