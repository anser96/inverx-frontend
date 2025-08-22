import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosConfig';

const useUserData = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [detailedBalance, setDetailedBalance] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserInfo = useCallback(async () => {
    try {
      const userId = localStorage.getItem('idUser');
      if (!userId) {
        throw new Error('No user ID found');
      }
      const response = await axiosInstance.get(`/users/${userId}`);
      setUserInfo(response.data.user || response.data);
      return response.data.user || response.data;
    } catch (error) {
      setError('Error al cargar información del usuario');
      throw error;
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const userId = localStorage.getItem('idUser');
      if (!userId) {
        throw new Error('No user ID found');
      }
      const response = await axiosInstance.get(`/dashboard/${userId}`);
      setDashboardData(response.data);
      return response.data;
    } catch (error) {
      setError('Error al cargar datos del dashboard');
      throw error;
    }
  }, []);

  const fetchDetailedBalance = useCallback(async () => {
    try {
      const userId = localStorage.getItem('idUser');
      if (!userId) {
        throw new Error('No user ID found');
      }
      const response = await axiosInstance.get(`/balance/${userId}`);
      setDetailedBalance(response.data);
      return response.data;
    } catch (error) {
      setError('Error al cargar balance detallado');
      throw error;
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/projects');
      
      if (response.data && Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        setProjects([]);
      }
      
      return response.data;
    } catch (error) {
      setError('Error al cargar proyectos');
      throw error;
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchUserInfo(),
        fetchDashboardData(),
        fetchDetailedBalance(),
        fetchProjects()
      ]);
    } catch (error) {
      // Error refreshing data
    } finally {
      setLoading(false);
    }
  }, [fetchUserInfo, fetchDashboardData, fetchDetailedBalance, fetchProjects]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Auto-refresh every 30 seconds - DISABLED
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refreshAllData();
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, [refreshAllData]);

  return {
    userInfo,
    dashboardData,
    detailedBalance,
    projects,
    loading,
    error,
    refreshAllData,
    fetchUserInfo,
    fetchDashboardData,
    fetchDetailedBalance,
    fetchProjects
  };
};

export default useUserData;