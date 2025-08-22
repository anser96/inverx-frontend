import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("idUser", res.data.idUSer || "1");
      
      // Guardar el rol del usuario
      if (res.data.role) {
        localStorage.setItem("userRole", res.data.role);
      } else {
        // Si no viene el rol en la respuesta, intentar extraerlo del token JWT
        try {
          const payload = JSON.parse(atob(res.data.token.split('.')[1]));
          if (payload.role) {
            localStorage.setItem("userRole", payload.role);
          }
        } catch (error) {
          // Error decoding token
        }
      }
      
      onLogin();
    } catch (err) {
      setError("Credenciales inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  // Crear partículas flotantes
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      particle.style.opacity = Math.random();
      document.querySelector('.particles-container')?.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 5000);
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Fondo animado con gradientes */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-purple-500/10 animate-pulse"></div>
      </div>

      {/* Mundo digital principal - basado en imagen de referencia */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full animate-spin-slow opacity-50">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 via-purple-700 to-blue-900 shadow-2xl border border-blue-400/20">
          {/* Patrón de puntos digitales - América del Norte */}
          <div className="absolute top-16 left-20 w-24 h-20">
            <div className="grid grid-cols-6 gap-1 opacity-80">
              <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-300 rounded-full" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full" style={{animationDelay: '0.3s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
          
          {/* Patrón de puntos digitales - Europa/África */}
          <div className="absolute top-12 right-16 w-20 h-24">
            <div className="grid grid-cols-5 gap-1 opacity-70">
              <div className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" style={{animationDelay: '0.6s'}}></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
            </div>
          </div>
          
          {/* Patrón de puntos digitales - Asia */}
          <div className="absolute bottom-20 right-12 w-28 h-16">
            <div className="grid grid-cols-7 gap-1 opacity-85">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-300 rounded-full" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full" style={{animationDelay: '0.3s'}}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full" style={{animationDelay: '0.5s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
          
          {/* Núcleo central con efecto de brillo */}
          <div className="absolute inset-12 rounded-full bg-gradient-to-br from-cyan-400/40 via-blue-500/30 to-purple-600/40 animate-pulse"></div>
          
          {/* Anillos orbitales */}
          <div className="absolute inset-8 rounded-full border border-blue-300/30 border-dashed animate-pulse"></div>
          <div className="absolute inset-16 rounded-full border border-purple-300/20 border-dotted" style={{animationDelay: '0.5s'}}></div>
          
          {/* Puntos de conexión globales */}
          <div className="absolute top-6 left-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-6 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute left-6 top-1/3 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Mundo digital secundario - basado en imagen de referencia */}
      <div className="absolute bottom-16 left-8 w-72 h-72 rounded-full animate-spin-reverse opacity-40">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 via-blue-700 to-purple-900 shadow-xl border border-purple-400/20">
          {/* Patrón de puntos digitales - América del Sur */}
          <div className="absolute bottom-16 left-16 w-16 h-20">
            <div className="grid grid-cols-4 gap-1 opacity-75">
              <div className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
          
          {/* Patrón de puntos digitales - Oceanía */}
          <div className="absolute bottom-12 right-20 w-12 h-12">
            <div className="grid grid-cols-3 gap-1 opacity-70">
              <div className="w-1 h-1 bg-cyan-300 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-blue-300 rounded-full" style={{animationDelay: '0.3s'}}></div>
              <div className="w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
          
          {/* Núcleo central con efecto de brillo */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-400/40 via-blue-500/30 to-cyan-400/30 animate-pulse"></div>
          
          {/* Anillos orbitales */}
          <div className="absolute inset-6 rounded-full border border-purple-300/30 border-dashed animate-pulse"></div>
          <div className="absolute inset-12 rounded-full border border-blue-300/20 border-dotted" style={{animationDelay: '0.7s'}}></div>
          
          {/* Puntos de conexión globales */}
          <div className="absolute top-4 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-4 left-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute right-4 top-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Contenedor de partículas */}
      <div className="particles-container absolute inset-0 pointer-events-none"></div>

      {/* Círculos decorativos */}
      <div className="absolute top-10 right-10 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-20 left-10 w-6 h-6 bg-purple-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-300 rounded-full animate-bounce"></div>

      {/* Formulario de login */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Header con efecto glassmorphism */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              InverX
            </h1>
            <p className="text-blue-200 text-sm">Bienvenido al futuro de las inversiones</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Input de email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Input de contraseña */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-20 text-white placeholder-blue-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-blue-300 hover:text-blue-200 transition-colors duration-200 p-1"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ingresando...
                </div>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          {/* Link de registro */}
          <div className="mt-6 text-center">
            <p className="text-blue-200 text-sm">
              ¿No tienes cuenta?{" "}
              <a href="/register" className="text-blue-400 hover:text-blue-300 underline transition-colors duration-300">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Estilos CSS personalizados */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #60a5fa, #3b82f6);
          border-radius: 50%;
          animation: float-up 5s linear infinite;
          pointer-events: none;
        }
        
        .particle:nth-child(2n) {
          background: radial-gradient(circle, #a78bfa, #8b5cf6);
          width: 3px;
          height: 3px;
        }
        
        .particle:nth-child(3n) {
          background: radial-gradient(circle, #34d399, #10b981);
          width: 2px;
          height: 2px;
        }
      `}</style>
    </div>
  );
}
