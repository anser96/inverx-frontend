import React, { useState } from 'react';
import useProjectStatistics from '../hooks/useProjectStatistics';

const ProjectStatistics = () => {
  const {
    statistics,
    activeStatistics,
    loading,
    error,
    refreshStatistics
  } = useProjectStatistics();

  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    // Importar dinámicamente para evitar problemas de SSR
    const formatDateColombia = (dateInput, options = {}) => {
      if (!dateInput) return 'N/A';
      
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      const defaultOptions = {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
      };
      
      return date.toLocaleDateString('es-CO', defaultOptions);
    };
    
    return formatDateColombia(dateString, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const currentStatistics = showActiveOnly ? activeStatistics : statistics;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={refreshStatistics}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Estadísticas de Proyectos
          </h2>
          <p className="text-gray-300">
            Visualiza métricas detalladas de inversión y rendimiento de proyectos.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center backdrop-blur-xl bg-white/5 border border-white/20 rounded-lg px-4 py-2">
            <input
              type="checkbox"
              id="activeOnly"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded bg-white/10"
            />
            <label htmlFor="activeOnly" className="ml-2 text-sm text-gray-300">
              Solo proyectos activos
            </label>
          </div>
          <button
            onClick={refreshStatistics}
            className="bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white px-6 py-3 rounded-lg hover:from-green-500/90 hover:to-emerald-500/90 transition-all duration-300 border border-white/20 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-blue-600/30 to-blue-500/30 rounded-xl">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Proyectos</p>
              <p className="text-2xl font-bold text-white">{currentStatistics.length}</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-green-600/30 to-green-500/30 rounded-xl">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Invertido</p>
              <p className="text-2xl font-bold text-white">
                {formatCOP(currentStatistics.reduce((sum, project) => sum + (project.totalInvested || 0), 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-purple-600/30 to-purple-500/30 rounded-xl">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Inversores</p>
              <p className="text-2xl font-bold text-white">
                {currentStatistics.reduce((sum, project) => sum + (project.totalInvestors || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-yellow-600/30 to-yellow-500/30 rounded-xl">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Inversiones Activas</p>
              <p className="text-2xl font-bold text-white">
                {currentStatistics.reduce((sum, project) => sum + (project.activeInvestments || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de proyectos */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-6">
          <h3 className="text-xl font-bold text-white mb-6">Detalle por Proyecto</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="backdrop-blur-sm bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Proyecto
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Monto Fijo
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Total Invertido
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Inversores
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Rentabilidad
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
              {currentStatistics.map((project) => (
                <tr key={project.projectId} className="hover:bg-white/5 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-white">{project.projectName}</div>
                      <div className="text-sm text-gray-400">ID: {project.projectId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                    {formatCOP(project.fixedAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-200">{formatCOP(project.totalInvested || 0)}</div>
                    <div className="text-xs text-gray-400">
                      {((project.totalInvested || 0) / project.fixedAmount * 100).toFixed(1)}% completado
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-200">{project.totalInvestors || 0}</div>
                    <div className="text-xs text-gray-400">{project.activeInvestments || 0} activas</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                    {project.expectedReturnRate}% diario
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                      project.status 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {project.status ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalles del proyecto */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 w-11/12 max-w-4xl">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    Detalles: {selectedProject.projectName}
                  </h3>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
            
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Información del Proyecto</label>
                      <div className="mt-1 space-y-2 text-gray-200">
                        <p><span className="font-medium text-white">Monto Fijo:</span> {formatCOP(selectedProject.fixedAmount)}</p>
                        <p><span className="font-medium text-white">Rentabilidad:</span> {selectedProject.expectedReturnRate}% diario</p>
                        <p><span className="font-medium text-white">Fecha Inicio:</span> {formatDate(selectedProject.startDate)}</p>
                        <p><span className="font-medium text-white">Fecha Fin:</span> {formatDate(selectedProject.endDate)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Estadísticas de Inversión</label>
                      <div className="mt-1 space-y-2 text-gray-200">
                        <p><span className="font-medium text-white">Total Invertido:</span> {formatCOP(selectedProject.totalInvested || 0)}</p>
                        <p><span className="font-medium text-white">Total Inversores:</span> {selectedProject.totalInvestors || 0}</p>
                        <p><span className="font-medium text-white">Inversiones Activas:</span> {selectedProject.activeInvestments || 0}</p>
                        <p><span className="font-medium text-white">Promedio por Usuario:</span> {formatCOP(selectedProject.averageInvestmentPerUser || 0)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista de inversores */}
                {selectedProject.investors && selectedProject.investors.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Inversores ({selectedProject.investors.length})</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-white/10">
                        <thead className="backdrop-blur-sm bg-white/5">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuario</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Monto</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {selectedProject.investors.map((investor, index) => (
                            <tr key={index} className="hover:bg-white/5 transition-colors duration-200">
                              <td className="px-4 py-3 text-sm text-white">{investor.userName}</td>
                              <td className="px-4 py-3 text-sm text-gray-300">{investor.userEmail}</td>
                              <td className="px-4 py-3 text-sm text-white">{formatCOP(investor.investedAmount)}</td>
                              <td className="px-4 py-3 text-sm text-gray-300">{formatDate(investor.investmentDate)}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                                  investor.status 
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}>
                                  {investor.status ? 'Activa' : 'Inactiva'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectStatistics;