import React, { createContext, useContext, useState } from 'react';

// Create the Dashboard Context
const DashboardContext = createContext();

// Custom hook to use the Dashboard Context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Dashboard Provider Component
export const DashboardProvider = ({ children }) => {
  // Active tab state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modal states
  const [modals, setModals] = useState({
    investment: { isOpen: false, selectedProject: null },
    topUp: { isOpen: false },
    withdraw: { isOpen: false },
    message: { isOpen: false, message: '', type: 'info' }
  });
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    refreshing: false,
    investing: false,
    withdrawing: false,
    topUp: false
  });
  
  // Utility functions
  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Modal management functions
  const openInvestmentModal = (project) => {
    setModals(prev => ({
      ...prev,
      investment: { isOpen: true, selectedProject: project }
    }));
  };
  
  const closeInvestmentModal = () => {
    setModals(prev => ({
      ...prev,
      investment: { isOpen: false, selectedProject: null }
    }));
  };
  
  const openTopUpModal = () => {
    setModals(prev => ({
      ...prev,
      topUp: { isOpen: true }
    }));
  };
  
  const closeTopUpModal = () => {
    setModals(prev => ({
      ...prev,
      topUp: { isOpen: false }
    }));
  };
  
  const openWithdrawModal = () => {
    setModals(prev => ({
      ...prev,
      withdraw: { isOpen: true }
    }));
  };
  
  const closeWithdrawModal = () => {
    setModals(prev => ({
      ...prev,
      withdraw: { isOpen: false }
    }));
  };
  
  const showMessage = (message, type = 'info') => {
    setModals(prev => ({
      ...prev,
      message: { isOpen: true, message, type }
    }));
  };
  
  const closeMessageModal = () => {
    setModals(prev => ({
      ...prev,
      message: { isOpen: false, message: '', type: 'info' }
    }));
  };
  
  // Loading state management
  const setLoading = (key, value) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Tab management
  const changeTab = (tab) => {
    setActiveTab(tab);
  };
  
  // Context value
  const contextValue = {
    // State
    activeTab,
    modals,
    loadingStates,
    
    // Utility functions
    formatCOP,
    
    // Modal functions
    openInvestmentModal,
    closeInvestmentModal,
    openTopUpModal,
    closeTopUpModal,
    openWithdrawModal,
    closeWithdrawModal,
    showMessage,
    closeMessageModal,
    
    // Loading functions
    setLoading,
    
    // Tab functions
    changeTab
  };
  
  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;