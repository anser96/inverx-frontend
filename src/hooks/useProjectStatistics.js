import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

const useProjectStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [activeStatistics, setActiveStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener estadísticas de todos los proyectos
  const fetchAllStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Usar el endpoint existente de proyectos
      const response = await axiosInstance.get('projects');
      
      // Transformar datos de proyectos a formato de estadísticas usando datos reales del backend
      const projectsWithStats = response.data.map(project => {
        // Usar únicamente datos reales del backend
        const totalInvested = project.totalRaised || 0;
        const totalInvestors = project.totalInvestors || 0;
        const activeInvestments = project.activeInvestments || 0;
        
        return {
          projectId: project.id,
          projectName: project.name,
          fixedAmount: project.fixedAmount,
          expectedReturnRate: project.expectedReturnRate,
          startDate: project.startDate,
          endDate: project.endDate,
          status: project.status,
          totalInvested,
          totalInvestors,
          activeInvestments,
          averageInvestmentPerUser: totalInvestors > 0 ? totalInvested / totalInvestors : 0,
          investors: project.investors || [],
          // Campos adicionales útiles
          progressPercentage: Math.min((totalInvested / project.fixedAmount) * 100, 100),
          remainingAmount: Math.max(0, project.fixedAmount - totalInvested),
          isFullyFunded: totalInvested >= project.fixedAmount
        };
      });
      
      // Calcular promedio por usuario
      projectsWithStats.forEach(project => {
        if (project.totalInvestors > 0) {
          project.averageInvestmentPerUser = project.totalInvested / project.totalInvestors;
        }
      });
      
      setStatistics(projectsWithStats);
      return projectsWithStats;
    } catch (err) {
      setError('Error al obtener estadísticas de proyectos');
      console.error('Error fetching project statistics:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas solo de proyectos activos
  const fetchActiveStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Usar el endpoint existente de proyectos y filtrar activos
      const response = await axiosInstance.get('projects');
      
      // Filtrar solo proyectos activos y transformar usando datos reales del backend
      const activeProjectsWithStats = response.data
        .filter(project => project.status === true)
        .map(project => {
          // Usar únicamente datos reales del backend
          const totalInvested = project.totalRaised || 0;
          const totalInvestors = project.totalInvestors || 0;
          const activeInvestments = project.activeInvestments || 0;
          
          return {
            projectId: project.id,
            projectName: project.name,
            fixedAmount: project.fixedAmount,
            expectedReturnRate: project.expectedReturnRate,
            startDate: project.startDate,
            endDate: project.endDate,
            status: project.status,
            totalInvested,
            totalInvestors,
            activeInvestments,
            averageInvestmentPerUser: totalInvestors > 0 ? totalInvested / totalInvestors : 0,
            investors: project.investors || [],
            // Campos adicionales útiles
            progressPercentage: Math.min((totalInvested / project.fixedAmount) * 100, 100),
            remainingAmount: Math.max(0, project.fixedAmount - totalInvested),
            isFullyFunded: totalInvested >= project.fixedAmount
          };
        });
      
      // Calcular promedio por usuario
      activeProjectsWithStats.forEach(project => {
        if (project.totalInvestors > 0) {
          project.averageInvestmentPerUser = project.totalInvested / project.totalInvestors;
        }
      });
      
      setActiveStatistics(activeProjectsWithStats);
      return activeProjectsWithStats;
    } catch (err) {
      setError('Error al obtener estadísticas de proyectos activos');
      console.error('Error fetching active project statistics:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas de un proyecto específico
  const fetchProjectStatistics = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      // Intentar obtener estadísticas específicas del proyecto desde el backend
      const response = await axiosInstance.get(`/projects/${projectId}/statistics`);
      return response.data;
    } catch (err) {
      // Si no existe el endpoint específico, usar datos del proyecto general
      try {
        const projectResponse = await axiosInstance.get(`/projects/${projectId}`);
        const project = projectResponse.data;
        
        const totalInvested = project.totalRaised || 0;
        const totalInvestors = project.totalInvestors || 0;
        const activeInvestments = project.activeInvestments || 0;
        
        const projectStats = {
          projectId: project.id,
          projectName: project.name,
          fixedAmount: project.fixedAmount,
          expectedReturnRate: project.expectedReturnRate,
          startDate: project.startDate,
          endDate: project.endDate,
          status: project.status,
          totalInvested,
          totalInvestors,
          activeInvestments,
          averageInvestmentPerUser: totalInvestors > 0 ? totalInvested / totalInvestors : 0,
          investors: project.investors || [],
          progressPercentage: Math.min((totalInvested / project.fixedAmount) * 100, 100),
          remainingAmount: Math.max(0, project.fixedAmount - totalInvested),
          isFullyFunded: totalInvested >= project.fixedAmount
        };
        
        return projectStats;
      } catch (projectErr) {
        setError(`Error al obtener estadísticas del proyecto ${projectId}`);
        console.error('Error fetching project statistics:', projectErr);
        throw projectErr;
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    fetchAllStatistics();
    fetchActiveStatistics();
  }, []);

  // Función para refrescar todas las estadísticas
  const refreshStatistics = async () => {
    await Promise.all([
      fetchAllStatistics(),
      fetchActiveStatistics()
    ]);
  };

  return {
    statistics,
    activeStatistics,
    loading,
    error,
    fetchAllStatistics,
    fetchActiveStatistics,
    fetchProjectStatistics,
    refreshStatistics
  };
};

export default useProjectStatistics;