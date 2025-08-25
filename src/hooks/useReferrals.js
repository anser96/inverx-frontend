import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosConfig';

const useReferrals = () => {
  const [referralData, setReferralData] = useState(null);
  const [referralsList, setReferralsList] = useState([]);
  const [referralEarnings, setReferralEarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReferralSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('idUser');
      if (!userId) {
        throw new Error('No user ID found');
      }
      const response = await axiosInstance.get(`/referrals/user/${userId}/summary`);
      setReferralData(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cargar resumen de referidos';
      setError(errorMessage);
      setReferralData({
        totalReferrals: 0,
        totalEarnings: 0
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReferralsList = useCallback(async () => {
    try {
      const userId = localStorage.getItem('idUser');
      if (!userId) {
        throw new Error('No user ID found');
      }
      const response = await axiosInstance.get(`/referrals/user/${userId}/list`);
      setReferralsList(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cargar lista de referidos';
      setError(errorMessage);
      setReferralsList([]);
      throw error;
    }
  }, []);

  const fetchReferralEarnings = useCallback(async () => {
    try {
      const userId = localStorage.getItem('idUser');
      if (!userId) {
        throw new Error('No user ID found');
      }
      const response = await axiosInstance.get(`/referrals/user/${userId}/earnings`);
      setReferralEarnings(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cargar ganancias de referidos';
      setError(errorMessage);
      setReferralEarnings([]);
      throw error;
    }
  }, []);

  const refreshReferralData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchReferralSummary(),
        fetchReferralsList(),
        fetchReferralEarnings()
      ]);
    } catch (error) {
      // Error refreshing referral data
    } finally {
      setLoading(false);
    }
  }, [fetchReferralSummary, fetchReferralsList, fetchReferralEarnings]);

  const generateReferralCode = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/referrals/generate-code');
      
      // Refresh referral data after generating new code
      await fetchReferralSummary();
      
      return {
        success: true,
        message: response.data.message || 'Código de referido generado exitosamente',
        code: response.data.referralCode
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al generar código de referido';
      return {
        success: false,
        message: errorMessage
      };
    }
  }, [fetchReferralSummary]);

  const claimReferralBonus = useCallback(async (bonusId) => {
    try {
      const response = await axiosInstance.post(`/referrals/claim-bonus/${bonusId}`);
      
      // Refresh referral data after claiming bonus
      await refreshReferralData();
      
      return {
        success: true,
        message: response.data.message || 'Bono reclamado exitosamente'
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al reclamar bono';
      return {
        success: false,
        message: errorMessage
      };
    }
  }, [refreshReferralData]);

  return {
    referralData,
    referralsList,
    referralEarnings,
    loading,
    error,
    fetchReferralSummary,
    fetchReferralsList,
    fetchReferralEarnings,
    refreshReferralData,
    generateReferralCode,
    claimReferralBonus
  };
};

export default useReferrals;