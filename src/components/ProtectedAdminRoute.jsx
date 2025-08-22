import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    // Decodificar el token para verificar el rol
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Verificar si el token ha expirado
    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('idUser');
      return <Navigate to="/login" replace />;
    }
    
    // Verificar si el usuario tiene rol de administrador
    if (payload.role !== 'ADMIN') {
      // Redirigir al dashboard si no es admin
      return <Navigate to="/dashboard" replace />;
    }
    
    // Si es admin y el token es válido, renderizar el componente
    return children;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('idUser');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedAdminRoute;