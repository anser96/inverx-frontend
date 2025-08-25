// Utilidades para manejo de fechas en zona horaria America/Bogota

/**
 * Formatea una fecha en zona horaria America/Bogota
 * @param {string|Date} dateInput - Fecha a formatear
 * @param {Object} options - Opciones de formateo
 * @returns {string} Fecha formateada
 */
export const formatDateColombia = (dateInput, options = {}) => {
  if (!dateInput) return 'N/A';
  
  const date = new Date(dateInput);
  
  // Verificar si la fecha es válida
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

/**
 * Formatea una fecha con hora en zona horaria America/Bogota
 * @param {string|Date} dateInput - Fecha a formatear
 * @param {Object} options - Opciones de formateo
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTimeColombia = (dateInput, options = {}) => {
  if (!dateInput) return 'N/A';
  
  const date = new Date(dateInput);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) return 'Fecha inválida';
  
  const defaultOptions = {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options
  };
  
  return date.toLocaleString('es-CO', defaultOptions);
};

/**
 * Formatea una fecha de manera compacta para transacciones
 * @param {string|Date} dateInput - Fecha a formatear
 * @returns {string} Fecha formateada de manera compacta
 */
export const formatTransactionDate = (dateInput) => {
  if (!dateInput) return 'N/A';
  
  const date = new Date(dateInput);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) return 'Fecha inválida';
  
  // Formatear en zona horaria de Colombia
  const options = {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  const formatted = date.toLocaleString('es-CO', options);
  
  // Personalizar el formato para que coincida con el estilo actual
  const parts = formatted.split(' ');
  if (parts.length >= 4) {
    const day = parts[0];
    const month = parts[2];
    const year = parts[4];
    const time = parts[5];
    return `${day} ${month} ${year}, ${time}`;
  }
  
  return formatted;
};

/**
 * Obtiene la fecha actual en zona horaria America/Bogota
 * @returns {Date} Fecha actual ajustada a zona horaria de Colombia
 */
export const getCurrentDateColombia = () => {
  const now = new Date();
  
  // Obtener el offset de Colombia (-5 horas UTC)
  const colombiaOffset = -5 * 60; // en minutos
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const colombiaTime = new Date(utc + (colombiaOffset * 60000));
  
  return colombiaTime;
};

/**
 * Convierte una fecha a zona horaria America/Bogota
 * @param {string|Date} dateInput - Fecha a convertir
 * @returns {Date} Fecha convertida a zona horaria de Colombia
 */
export const convertToColombiaTime = (dateInput) => {
  if (!dateInput) return null;
  
  const date = new Date(dateInput);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) return null;
  
  // Crear una nueva fecha ajustada a zona horaria de Colombia
  const options = { timeZone: 'America/Bogota' };
  const colombiaDateString = date.toLocaleString('en-CA', options); // formato ISO-like
  
  return new Date(colombiaDateString);
};

/**
 * Formatea una fecha para mostrar "próximo retiro disponible"
 * @param {string|Date} dateInput - Fecha del próximo retiro
 * @returns {string} Fecha formateada para próximo retiro
 */
export const formatNextWithdrawalDate = (dateInput) => {
  if (!dateInput) return 'No disponible';
  
  const date = new Date(dateInput);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) return 'Fecha inválida';
  
  const options = {
    timeZone: 'America/Bogota',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  return date.toLocaleString('es-CO', options);
};

/**
 * Calcula los días restantes hasta una fecha
 * @param {string|Date} targetDate - Fecha objetivo
 * @returns {number} Número de días restantes (puede ser negativo si ya pasó)
 */
export const getDaysUntilDate = (targetDate) => {
  if (!targetDate) return 0;
  
  const target = new Date(targetDate);
  const now = getCurrentDateColombia();
  
  // Verificar si las fechas son válidas
  if (isNaN(target.getTime()) || isNaN(now.getTime())) return 0;
  
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Exportar todas las funciones como default también
const dateUtils = {
  formatDateColombia,
  formatDateTimeColombia,
  formatTransactionDate,
  getCurrentDateColombia,
  convertToColombiaTime,
  formatNextWithdrawalDate,
  getDaysUntilDate
};

export default dateUtils;