import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosConfig';

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('idUser');
      if (!userId) {
        throw new Error('No user ID found');
      }
      const response = await axiosInstance.get(`/transactions/${userId}`);
      setTransactions(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cargar transacciones';
      setError(errorMessage);
      setTransactions([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const processWithdrawal = useCallback(async (amount, phoneNumber) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('idUser');
      if (!userId) {
        throw new Error('No user ID found');
      }
      const response = await axiosInstance.post(`/withdrawals/${userId}`, {
        amount: parseFloat(amount),
        phoneNumber,
        description: `Solicitud de retiro - Teléfono: ${phoneNumber}`
      });
      
      // Refresh transactions after successful withdrawal
      await fetchTransactions();
      
      return {
        success: true,
        message: response.data.message || 'Retiro procesado exitosamente'
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al procesar el retiro';
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  const processTopUp = useCallback(async (amount) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('idUser');
      if (!userId) {
        throw new Error('No user ID found');
      }
      const response = await axiosInstance.post(`/balance/${userId}/deposit?amount=${parseFloat(amount)}`);
      
      // Refresh transactions after successful top-up
      await fetchTransactions();
      
      return {
        success: true,
        message: response.data.message || 'Recarga procesada exitosamente'
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al procesar la recarga';
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  const processInvestment = useCallback(async (projectId, amount) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('idUser');
      if (!userId) {
        throw new Error('No user ID found');
      }
      const response = await axiosInstance.post(`/investments/${userId}/${projectId}?amount=${parseFloat(amount)}`);
      
      // Refresh transactions after successful investment
      await fetchTransactions();
      
      return {
        success: true,
        message: response.data.message || 'Inversión realizada exitosamente'
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al procesar la inversión';
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    processWithdrawal,
    processTopUp,
    processInvestment
  };
};

export default useTransactions;