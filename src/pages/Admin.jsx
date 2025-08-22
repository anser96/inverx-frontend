import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Modal from '../components/Modal';

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
    minAmount: '',
    maxAmount: '',
    endDate: ''
  });

  // Función para mostrar mensajes
  const showMessage = useCallback((type, title, content, buttonText = 'Cancelar') => {
    setModalMessage({ type, title, content, buttonText });
    setShowMessageModal(true);
  }, []);

  // Función para formatear moneda
  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
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
      showMessage('error', 'Error', 'No se pudieron cargar las transacciones pendientes.');
      setPendingTransactions([]);
    }
  }, [showMessage]);

  // Obtener proyectos
  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('=== RESPUESTA DE PROYECTOS ===');
      console.log('Datos completos:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        console.log('Primer proyecto (ejemplo):', response.data[0]);
        console.log('Campos disponibles:', response.data[0] ? Object.keys(response.data[0]) : 'No hay proyectos');
        setProjects(response.data);
      } else {
        console.log('Los datos no son un array:', typeof response.data);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      showMessage('error', 'Error', 'No se pudieron cargar los proyectos.');
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }, [showMessage]);

  // Verificar autenticación y rol de administrador
  useEffect(() => {
    console.log('=== INICIO VERIFICACIÓN ADMIN ===');
    console.log('Todos los items en localStorage:', {
      token: localStorage.getItem('token'),
      idUser: localStorage.getItem('idUser'),
      userRole: localStorage.getItem('userRole')
    });
    
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    console.log('Verificando acceso admin - Token:', !!token, 'UserRole:', userRole);
    
    if (!token) {
      console.log('No hay token, redirigiendo a login');
      navigate('/login');
      return;
    }
    
    if (userRole !== 'ADMIN') {
      console.log('Usuario no es admin, rol actual:', userRole);
      showMessage('error', 'Acceso Denegado', `No tienes permisos para acceder al panel administrativo. Rol actual: ${userRole || 'No definido'}`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      return;
    }
    
    console.log('Acceso admin verificado, cargando datos...');
    
    // Cargar datos iniciales
    const loadInitialData = async () => {
      await fetchPendingTransactions();
      await fetchProjects();
      setLoading(false);
    };
    
    loadInitialData();
  }, [navigate, showMessage, fetchPendingTransactions, fetchProjects]);

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
      console.error('Error toggling project status:', error);
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
      console.error('Error approving transaction:', error);
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
      console.error('Error rejecting transaction:', error);
      const errorMessage = error.response?.data?.message || 'No se pudo rechazar la transacción.';
      showMessage('error', 'Error de Rechazo', errorMessage);
    } finally {
      setProcessingTransactionId(null);
    }
  };

  // Crear proyecto
  const createProject = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!projectForm.name || !projectForm.expectedReturnRate || !projectForm.minAmount || !projectForm.maxAmount || !projectForm.endDate) {
      showMessage('error', 'Error de Validación', 'Todos los campos son obligatorios.');
      return;
    }
    
    // Validación de montos
    const minAmount = parseFloat(projectForm.minAmount);
    const maxAmount = parseFloat(projectForm.maxAmount);
    
    if (minAmount > maxAmount) {
      showMessage('error', 'Error de Validación', 'El monto mínimo no puede ser mayor que el monto máximo.');
      return;
    }
    
    setCreatingProject(true);
    try {
      const token = localStorage.getItem('token');
      const projectData = {
        name: projectForm.name,
        expectedReturnRate: parseFloat(projectForm.expectedReturnRate),
        minAmount: minAmount,
        maxAmount: maxAmount,
        endDate: projectForm.endDate
      };
      
      await axiosInstance.post('/projects', projectData, {
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
        minAmount: '',
        maxAmount: '',
        endDate: ''
      });
      
      // Cerrar modal
      setShowCreateProjectModal(false);
      
      // Recargar la lista de proyectos
      await fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error.response?.data?.message || 'No se pudo crear el proyecto.';
      showMessage('error', 'Error de Creación', errorMessage);
    } finally {
      setCreatingProject(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando panel administrativo...</div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.414-5.414l4.242 4.242M9 12l4-4 2 2M7.536 7.536L12 12m0 0l4.464 4.464M12 12L7.536 16.464" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Panel Administrativo
                </h1>
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
        {/* Tabs */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Gestionar Proyectos</span>
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

            {/* Transactions Table */}
            {pendingTransactions.length > 0 ? (
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="backdrop-blur-sm bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Contacto
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Monto
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {pendingTransactions
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-white/5 transition-colors duration-300 group">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-cyan-300">
                            #{transaction.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                            <div className="space-y-1">
                              <div className="font-medium text-white">{transaction.userName || 'N/A'}</div>
                              <div className="text-xs text-gray-400">ID: {transaction.userId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs">{transaction.userEmail || 'N/A'}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-xs">{transaction.userPhone || 'N/A'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            <div className="flex items-center space-x-2">
                              <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                                transaction.type === 'WITHDRAWAL'
                                  ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/30'
                                  : transaction.type === 'TOPUP'
                                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30'
                                  : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/30'
                              }`}>
                                {transaction.type === 'WITHDRAWAL' ? (
                                  <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                  </svg>
                                ) : transaction.type === 'TOPUP' ? (
                                  <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                  </svg>
                                )}
                              </div>
                              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-cyan-300">
                            {formatCOP(transaction.amount)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                            <div className="max-w-xs">
                              <p className="text-xs leading-relaxed">
                                {transaction.description || 'Sin descripción'}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                            {new Date(transaction.createdAt).toLocaleDateString('es-CO', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => approveTransaction(transaction.id)}
                                disabled={processingTransactionId === transaction.id}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
                                  processingTransactionId === transaction.id
                                    ? 'bg-gray-600/50 text-gray-400 border-gray-500/30 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-500/90 hover:to-emerald-500/90 text-white border-white/20 hover:shadow-green-500/25'
                                }`}
                              >
                                {processingTransactionId === transaction.id ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Procesando...</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Aprobar</span>
                                  </div>
                                )}
                              </button>
                              <button
                                onClick={() => rejectTransaction(transaction.id)}
                                disabled={processingTransactionId === transaction.id}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
                                  processingTransactionId === transaction.id
                                    ? 'bg-gray-600/50 text-gray-400 border-gray-500/30 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-red-600/80 to-pink-600/80 hover:from-red-500/90 hover:to-pink-500/90 text-white border-white/20 hover:shadow-red-500/25'
                                }`}
                              >
                                {processingTransactionId === transaction.id ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Procesando...</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Rechazar</span>
                                  </div>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 text-center shadow-2xl">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-lg font-medium">No hay transacciones pendientes</p>
                  <p className="text-gray-400 text-sm">Todas las transacciones han sido procesadas</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Gestión de Proyectos
              </h2>
              <p className="text-gray-300">
                Activa o desactiva proyectos de inversión.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex flex-wrap gap-4">
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

            {/* Projects Table */}
            {projects.length > 0 ? (
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="backdrop-blur-sm bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Meta de Inversión
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Recaudado
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-white/5 transition-colors duration-300 group">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-cyan-300">
                            #{project.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                            <div className="font-medium text-white">{project.name || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300 group-hover:text-white transition-colors duration-300 max-w-xs">
                            <div className="truncate" title={project.description}>
                              {project.description || 'Sin descripción'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                            <span className="font-semibold text-green-400">
                              {formatCOP(project.investmentGoal)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                            <div className="space-y-1">
                              <span className="font-semibold text-blue-400">
                                {formatCOP(project.currentAmount || 0)}
                              </span>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${Math.min(((project.currentAmount || 0) / (project.investmentGoal || 1)) * 100, 100)}%` 
                                  }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-400">
                                {Math.round(((project.currentAmount || 0) / (project.investmentGoal || 1)) * 100)}%
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              project.status
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                project.status ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              {project.status ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => toggleProjectStatus(project.id, project.status)}
                              disabled={processingProjectId === project.id}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
                                processingProjectId === project.id
                                  ? 'bg-gray-600/50 text-gray-400 border-gray-500/30 cursor-not-allowed'
                                  : project.status
                                    ? 'bg-gradient-to-r from-red-600/80 to-pink-600/80 hover:from-red-500/90 hover:to-pink-500/90 text-white border-white/20 hover:shadow-red-500/25'
                                    : 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-500/90 hover:to-emerald-500/90 text-white border-white/20 hover:shadow-green-500/25'
                              }`}
                            >
                              {processingProjectId === project.id ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                  <span>Procesando...</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  {project.status ? (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                      </svg>
                                      <span>Desactivar</span>
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span>Activar</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 text-center shadow-2xl">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-lg font-medium">No hay proyectos disponibles</p>
                  <p className="text-gray-400 text-sm">Los proyectos aparecerán aquí cuando estén disponibles</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para mensajes */}
      <Modal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title={modalMessage.title}
        cancelText={modalMessage.buttonText || 'Cancelar'}
      >
        <div className="text-center py-4">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
            modalMessage.type === 'success' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            {modalMessage.type === 'success' ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <p className="text-gray-700 whitespace-pre-line">{modalMessage.content}</p>
        </div>
      </Modal>

      {/* Modal para crear proyecto */}
      <Modal
        isOpen={showCreateProjectModal}
        onClose={() => {
          setShowCreateProjectModal(false);
          setProjectForm({
            name: '',
            expectedReturnRate: '',
            minAmount: '',
            maxAmount: '',
            endDate: ''
          });
        }}
        title="Crear Nuevo Proyecto"
        showActions={false}
      >
        <form onSubmit={createProject} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del Proyecto */}
            <div className="md:col-span-2">
              <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                id="modal-name"
                name="name"
                value={projectForm.name}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Ingrese el nombre del proyecto"
                required
              />
            </div>

            {/* Tasa de Retorno Esperada */}
            <div>
              <label htmlFor="modal-expectedReturnRate" className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de Retorno Esperada (%) *
              </label>
              <input
                type="number"
                id="modal-expectedReturnRate"
                name="expectedReturnRate"
                value={projectForm.expectedReturnRate}
                onChange={handleFormChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Ej: 15.50"
                required
              />
            </div>

            {/* Fecha de Finalización */}
            <div>
              <label htmlFor="modal-endDate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Finalización *
              </label>
              <input
                type="datetime-local"
                id="modal-endDate"
                name="endDate"
                value={projectForm.endDate}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Monto Mínimo */}
            <div>
              <label htmlFor="modal-minAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Monto Mínimo (COP) *
              </label>
              <input
                type="number"
                id="modal-minAmount"
                name="minAmount"
                value={projectForm.minAmount}
                onChange={handleFormChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Ej: 100000"
                required
              />
            </div>

            {/* Monto Máximo */}
            <div>
              <label htmlFor="modal-maxAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Monto Máximo (COP) *
              </label>
              <input
                type="number"
                id="modal-maxAmount"
                name="maxAmount"
                value={projectForm.maxAmount}
                onChange={handleFormChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Ej: 5000000"
                required
              />
            </div>
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
                  minAmount: '',
                  maxAmount: '',
                  endDate: ''
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