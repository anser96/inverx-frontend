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
      console.error('Investment error:', error);
      
      // Si hay un error, intentar refrescar las transacciones para verificar si la inversión se procesó
      try {
        await fetchTransactions();
      } catch (refreshError) {
        console.error('Error refreshing transactions:', refreshError);
      }
      
      // Determinar el mensaje de error apropiado
      let errorMessage = 'Error al procesar la inversión';
      
      if (error.response) {
        // El servidor respondió con un código de estado de error
        errorMessage = error.response.data?.message || `Error del servidor (${error.response.status})`;
      } else if (error.request) {
        // La petición se hizo pero no se recibió respuesta
        errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión e intenta nuevamente.';
      } else {
        // Algo pasó al configurar la petición
        errorMessage = error.message || 'Error inesperado al procesar la inversión';
      }
      
      return {
        success: false,
        message: errorMessage,
        shouldCheckTransactions: true // Indicar que se debe verificar las transacciones
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