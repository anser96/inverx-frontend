import axios from 'axios';

// Crear una instancia de axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
});

// Variable para controlar si ya se está mostrando el modal de sesión expirada
let isShowingAuthModal = false;

// Función de callback para navegación (se puede configurar desde la app)
let navigationCallback = () => {
  // Fallback a window.location si no se ha configurado el callback
  window.location.href = '/login';
};

// Función para configurar el callback de navegación
export const setNavigationCallback = (callback) => {
  navigationCallback = callback;
};

// Función para mostrar modal de autenticación
const showAuthModal = () => {
  if (isShowingAuthModal) return;
  isShowingAuthModal = true;
  
  // Crear el modal dinámicamente
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modalOverlay.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
      <div class="text-center">
        <div class="mb-4">
          <svg class="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Sesión Expirada</h3>
        <p class="text-gray-600 mb-6">
          Tu sesión ha expirado o tu token de acceso no es válido. Por favor, inicia sesión nuevamente para continuar.
        </p>
        <button id="auth-modal-ok" class="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-300">
          Ir al Login
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modalOverlay);
  
  // Manejar click en el botón OK
  document.getElementById('auth-modal-ok').addEventListener('click', () => {
    document.body.removeChild(modalOverlay);
    isShowingAuthModal = false;
    
    // Limpiar localStorage y redirigir
    localStorage.removeItem('token');
    localStorage.removeItem('idUser');
    navigationCallback();
  });
};

// Interceptor de solicitudes para agregar el token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Verificar si es un error de autenticación
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Mostrar modal de sesión expirada
      showAuthModal();
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;