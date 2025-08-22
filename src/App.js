import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setNavigationCallback } from "./utils/axiosConfig";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function AppContent() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Configurar el callback de navegación para axios
  useEffect(() => {
    setNavigationCallback(() => navigate("/login"));
  }, [navigate]);

  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login onLogin={() => navigate("/dashboard")} />} />

      {/* Registro */}
      <Route path="/register" element={<Register onRegister={() => navigate("/login")} />} />

      {/* Dashboard protegido */}
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />

      {/* Panel administrativo protegido - Solo para usuarios ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <Admin />
          </ProtectedAdminRoute>
        }
      />

      {/* Redirigir raíz al login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
