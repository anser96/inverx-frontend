import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Modal from '../components/Modal';
import ProjectStatistics from '../components/ProjectStatistics';

const Admin = () => {
  const navigate = useNavigate();
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ type: '', title: '', content: '' });
  const [processingTransactionId, setProcessingTransactionId] = useState(null);
  const [processingProjectId, setProcessingProjectId] = useState(null);
  const [activeTab, setActiveTab] = useState('transactions');
  const [creatingProject, setCreatingProject] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    expectedReturnRate: '',
    fixedAmount: '',
    endDate: '',
    withdrawalRestrictionPercentage: '',
    url: ''
  });

  // Función para mostrar mensajes
  const showMessage = useCallback((type, title, content, buttonText = 'Cancelar') => {
    setModalMessage({ type, title, content, buttonText });
    setShowMessageModal(true);
  }, []);

  // Cambiar estado de proyecto (activar/desactivar)
  const toggleProjectStatus = async (projectId, currentStatus) => {
    setProcessingProjectId(projectId);
    try {
      const token = localStorage.getItem('token');
      const newStatus = !currentStatus;
      
      await axiosInstance.put(`/projects/${projectId}/status?active=${newStatus}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      showMessage(
        'success', 
        'Estado Actualizado', 
        `El proyecto ha sido ${newStatus ? 'activado' : 'desactivado'} exitosamente.`,
        'Aceptar'
      );
      
      // Recargar la lista de proyectos
      await fetchProjects();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'No se pudo cambiar el estado del proyecto.';
      showMessage('error', 'Error', errorMessage);
    } finally {
      setProcessingProjectId(null);
    }
  };

  // Aprobar transacción
  const approveTransaction = async (transactionId) => {
    setProcessingTransactionId(transactionId);
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.patch(`/transactions/${transactionId}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      showMessage('success', 'Transacción Aprobada', 'La transacción ha sido aprobada exitosamente.', 'Aceptar');
      
      // Recargar la lista de transacciones pendientes
      await fetchPendingTransactions();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'No se pudo aprobar la transacción.';
      showMessage('error', 'Error de Aprobación', errorMessage);
    } finally {
      setProcessingTransactionId(null);
    }
  };

  // Rechazar transacción
  const rejectTransaction = async (transactionId) => {
    setProcessingTransactionId(transactionId);
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.patch(`/transactions/${transactionId}/reject`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      showMessage('success', 'Transacción Rechazada', 'La transacción ha sido rechazada exitosamente.', 'Aceptar');
      
      // Recargar la lista de transacciones pendientes
      await fetchPendingTransactions();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'No se pudo rechazar la transacción.';
      showMessage('error', 'Error de Rechazo', errorMessage);
    } finally {
      setProcessingTransactionId(null);
    }
  };

  // Función para formatear moneda
  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Obtener transacciones pendientes
  const fetchPendingTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/transactions/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data && Array.isArray(response.data)) {
        setPendingTransactions(response.data);
      } else {
        setPendingTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
      setPendingTransactions([]);
    }
  }, []);

  // Obtener proyectos
  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data && Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (userRole !== 'ADMIN') {
      showMessage('error', 'Acceso Denegado', 'No tienes permisos para acceder a esta página.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      return;
    }

    // Cargar datos iniciales
    const loadInitialData = async () => {
      await fetchPendingTransactions();
      await fetchProjects();
      setLoading(false);
    };
     
     loadInitialData();
   }, [navigate, showMessage, fetchPendingTransactions, fetchProjects]);

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Crear proyecto
  const createProject = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!projectForm.name || !projectForm.expectedReturnRate || !projectForm.fixedAmount || !projectForm.endDate) {
      showMessage('error', 'Error de Validación', 'Todos los campos son obligatorios.');
      return;
    }
    
    // Validación de monto
    const fixedAmount = parseFloat(projectForm.fixedAmount);
    const withdrawalRestriction = parseFloat(projectForm.withdrawalRestrictionPercentage);
    
    if (fixedAmount <= 0) {
      showMessage('error', 'Error de Validación', 'El monto fijo del proyecto debe ser mayor a 0.');
      return;
    }
    
    // Validar porcentaje de restricción solo si se proporciona un valor
    if (projectForm.withdrawalRestrictionPercentage && (withdrawalRestriction < 0 || withdrawalRestriction > 100)) {
      showMessage('error', 'Error de Validación', 'El porcentaje de restricción de retiro debe estar entre 0 y 100.');
      return;
    }
    
    setCreatingProject(true);
    try {
      const token = localStorage.getItem('token');
      const projectData = {
        name: projectForm.name,
        expectedReturnRate: parseFloat(projectForm.expectedReturnRate),
        fixedAmount: fixedAmount,
        endDate: projectForm.endDate + 'T23:59:59'
      };
      
      // Solo incluir withdrawalRestrictionPercentage si tiene un valor válido
      if (withdrawalRestriction >= 0 && withdrawalRestriction <= 100) {
        projectData.withdrawalRestrictionPercentage = withdrawalRestriction;
      }
      
      // Incluir URL de información si se proporciona
      if (projectForm.url && projectForm.url.trim()) {
        projectData.url = projectForm.url.trim();
      }
      
      await axiosInstance.post('projects', projectData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      showMessage('success', 'Proyecto Creado', 'El proyecto ha sido creado exitosamente.', 'Aceptar');
      
      // Limpiar formulario
      setProjectForm({
        name: '',
        expectedReturnRate: '',
        fixedAmount: '',
        endDate: '',
        withdrawalRestrictionPercentage: '',
        url: ''
      });
      
      // Cerrar modal
      setShowCreateProjectModal(false);
      
      // Recargar la lista de proyectos
      await fetchProjects();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'No se pudo crear el proyecto.';
      showMessage('error', 'Error de Creación', errorMessage);
    } finally {
      setCreatingProject(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-white font-semibold text-lg">Panel Administrativo</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white rounded-lg hover:from-blue-500/90 hover:to-purple-500/90 transition-all duration-300 border border-white/20"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-600/80 to-pink-600/80 text-white rounded-lg hover:from-red-500/90 hover:to-pink-500/90 transition-all duration-300 border border-white/20"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'transactions'
                  ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>Transacciones</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v2M7 7h10M7 11h10m-5 8h.01" />
                </svg>
                <span>Proyectos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'statistics'
                  ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Estadísticas</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'transactions' ? (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Transacciones Pendientes de Aprobación
              </h2>
              <p className="text-gray-300">
                Gestiona las transacciones que requieren aprobación manual.
              </p>
            </div>

            {/* Refresh Button */}
            <div className="mb-6">
              <button
                onClick={fetchPendingTransactions}
                className="px-6 py-3 bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white rounded-lg hover:from-green-500/90 hover:to-emerald-500/90 transition-all duration-300 border border-white/20 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Actualizar Lista</span>
              </button>
            </div>

            {/* Transactions List */}
            {pendingTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No hay transacciones pendientes</h3>
                <p className="text-gray-400">Todas las transacciones han sido procesadas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTransactions.map((transaction) => (
                  <div key={transaction.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">{transaction.type || 'Transacción'}</h3>
                            <p className="text-gray-400">ID: {transaction.id}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Usuario</p>
                            <p className="text-white font-medium">{transaction.userName || transaction.userId || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Monto</p>
                            <p className="text-white font-medium">{formatCOP(transaction.amount || 0)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Proyecto</p>
                            <p className="text-white font-medium">{transaction.projectName || transaction.projectId || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Fecha</p>
                            <p className="text-white font-medium">
                              {(() => {
                                if (!transaction.createdAt) return 'N/A';
                                const date = new Date(transaction.createdAt);
                                if (isNaN(date.getTime())) return 'Fecha inválida';
                                return date.toLocaleDateString('es-CO', {
                                  timeZone: 'America/Bogota',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                });
                              })()} 
                            </p>
                          </div>
                        </div>
                        
                        {transaction.description && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-1">Descripción</p>
                            <p className="text-gray-300">{transaction.description}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6 flex flex-col space-y-3">
                        <button
                          onClick={() => approveTransaction(transaction.id)}
                          disabled={processingTransactionId === transaction.id}
                          className="px-4 py-2 bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white rounded-lg hover:from-green-500/90 hover:to-emerald-500/90 transition-all duration-300 border border-green-500/30 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingTransactionId === transaction.id ? (
                            <>
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Procesando...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Aprobar</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => rejectTransaction(transaction.id)}
                          disabled={processingTransactionId === transaction.id}
                          className="px-4 py-2 bg-gradient-to-r from-red-600/80 to-pink-600/80 text-white rounded-lg hover:from-red-500/90 hover:to-pink-500/90 transition-all duration-300 border border-red-500/30 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingTransactionId === transaction.id ? (
                            <>
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Procesando...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span>Rechazar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'projects' ? (
          <div>
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                    Gestión de Proyectos
                  </h2>
                  <p className="text-gray-300">
                    Activa o desactiva proyectos de inversión y crea nuevos proyectos.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateProjectModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white rounded-lg hover:from-purple-500/90 hover:to-blue-500/90 transition-all duration-300 border border-white/20 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Crear Proyecto</span>
                </button>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="mb-6">
              <button
                onClick={fetchProjects}
                disabled={projectsLoading}
                className="px-6 py-3 bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white rounded-lg hover:from-green-500/90 hover:to-emerald-500/90 transition-all duration-300 border border-white/20 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{projectsLoading ? 'Cargando...' : 'Actualizar Lista'}</span>
              </button>
            </div>

            {/* Projects List */}
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v2M7 7h10M7 11h10m-5 8h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No hay proyectos disponibles</h3>
                <p className="text-gray-400">Crea el primer proyecto para comenzar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {project.status ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-gray-400 text-sm">Monto Objetivo</p>
                            <p className="text-white font-medium">{formatCOP(project.fixedAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Tasa de Retorno</p>
                            <p className="text-white font-medium">{project.expectedReturnRate}%</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Fecha de Finalización</p>
                            <p className="text-white font-medium">
                              {new Date(project.endDate).toLocaleDateString('es-CO')}
                            </p>
                          </div>
                        </div>
                        
                        {project.withdrawalRestrictionPercentage && (
                          <div className="mb-4">
                            <p className="text-gray-400 text-sm">Restricción de Retiro</p>
                            <p className="text-white font-medium">{project.withdrawalRestrictionPercentage}%</p>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <span>ID: {project.id}</span>
                          <span>Creado: {new Date(project.createdAt).toLocaleDateString('es-CO')}</span>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <button
                          onClick={() => toggleProjectStatus(project.id, project.status)}
                          disabled={processingProjectId === project.id}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            project.status
                              ? 'bg-red-600/80 hover:bg-red-500/90 text-white border border-red-500/30'
                              : 'bg-green-600/80 hover:bg-green-500/90 text-white border border-green-500/30'
                          }`}
                        >
                          {processingProjectId === project.id ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Procesando...</span>
                            </div>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {project.status ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                )}
                              </svg>
                              <span>{project.status ? 'Desactivar' : 'Activar'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'statistics' ? (
          <ProjectStatistics />
        ) : null}
      </div>

      {/* Modal de Mensaje */}
      <Modal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title={modalMessage.title}
      >
        <div className="text-center py-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            modalMessage.type === 'success'
              ? 'bg-green-100 text-green-600'
              : modalMessage.type === 'error'
              ? 'bg-red-100 text-red-600'
              : 'bg-blue-100 text-blue-600'
          }`}>
            {modalMessage.type === 'success' ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : modalMessage.type === 'error' ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <p className="text-gray-300">{modalMessage.content}</p>
        </div>
      </Modal>

      {/* Modal de Crear Proyecto */}
      <Modal
        isOpen={showCreateProjectModal}
        onClose={() => {
          setShowCreateProjectModal(false);
          setProjectForm({
            name: '',
            expectedReturnRate: '',
            fixedAmount: '',
            endDate: '',
            withdrawalRestrictionPercentage: '',
            url: ''
          });
        }}
        title="Crear Nuevo Proyecto"
      >
        <form onSubmit={createProject} className="space-y-6">
          {/* Nombre del Proyecto */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              name="name"
              value={projectForm.name}
              onChange={handleFormChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ingresa el nombre del proyecto"
              required
            />
          </div>

          {/* Tasa de Retorno Esperada */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tasa de Retorno Esperada (%) *
            </label>
            <input
              type="number"
              name="expectedReturnRate"
              value={projectForm.expectedReturnRate}
              onChange={handleFormChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: 15.5"
              required
            />
          </div>

          {/* Monto Fijo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Monto Fijo (COP) *
            </label>
            <input
              type="number"
              name="fixedAmount"
              value={projectForm.fixedAmount}
              onChange={handleFormChange}
              min="1"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: 1000000"
              required
            />
          </div>

          {/* Fecha de Finalización */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fecha de Finalización *
            </label>
            <input
              type="date"
              name="endDate"
              value={projectForm.endDate}
              onChange={handleFormChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Porcentaje de Restricción de Retiro */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Restricción de Retiro (%)
              <span className="text-gray-400 text-xs ml-1">(Opcional)</span>
            </label>
            <input
              type="number"
              name="withdrawalRestrictionPercentage"
              value={projectForm.withdrawalRestrictionPercentage}
              onChange={handleFormChange}
              step="0.01"
              min="0"
              max="100"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: 10.5"
            />
            <p className="text-xs text-gray-400 mt-1">
              Porcentaje del monto que no se puede retirar antes del vencimiento
            </p>
          </div>

          {/* URL de Información */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL de Información del Proyecto
              <span className="text-gray-400 text-xs ml-1">(Opcional)</span>
            </label>
            <input
              type="url"
              name="url"
              value={projectForm.url}
              onChange={handleFormChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://ejemplo.com/informacion-proyecto"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enlace con información adicional sobre el proyecto
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => {
                setShowCreateProjectModal(false);
                setProjectForm({
                  name: '',
                  expectedReturnRate: '',
                  fixedAmount: '',
                  endDate: '',
                  withdrawalRestrictionPercentage: ''
                });
              }}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              disabled={creatingProject}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:cursor-not-allowed"
            >
              {creatingProject ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Crear Proyecto</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;