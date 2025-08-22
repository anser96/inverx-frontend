// Función para decodificar JWT sin verificar la firma (solo para leer datos)
const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    // Dividir el token en sus partes
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decodificar el payload (segunda parte)
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decodedPayload);
  } catch (error) {
    return null;
  }
};

// Función para obtener el rol del usuario desde el token
export const getUserRoleFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decodedToken = decodeJWT(token);
    if (!decodedToken) return null;
    
    // El rol puede estar en diferentes campos dependiendo de cómo esté estructurado el token
    return decodedToken.role || decodedToken.userRole || decodedToken.authorities || null;
  } catch (error) {
    return null;
  }
};

// Función para verificar si el usuario es admin
export const isUserAdmin = () => {
  // Primero intentar obtener el rol del token
  const roleFromToken = getUserRoleFromToken();
  if (roleFromToken) {
    return roleFromToken === 'ADMIN' || roleFromToken === 'admin';
  }
  
  // Como fallback, usar localStorage (para compatibilidad con sesiones existentes)
  const roleFromStorage = localStorage.getItem('userRole');
  return roleFromStorage === 'ADMIN' || roleFromStorage === 'admin';
};

// Función para verificar si el token ha expirado
export const isTokenExpired = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return true;
    
    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.exp) return true;
    
    // exp está en segundos, Date.now() está en milisegundos
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};

const tokenUtils = {
  getUserRoleFromToken,
  isUserAdmin,
  isTokenExpired
};

export default tokenUtils;