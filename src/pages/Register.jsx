import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import Modal from "../components/Modal";

export default function Register({ onRegister }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/register", {
        fullName,
        email,
        phoneNumber,
        password,
        referralCode: referralCode || null,
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      alert("Error al registrar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onRegister();
  };

  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      particle.style.opacity = Math.random();
      
      const colors = ['bg-blue-400', 'bg-purple-400', 'bg-green-400'];
      const sizes = ['w-1 h-1', 'w-2 h-2', 'w-1.5 h-1.5'];
      
      particle.classList.add(
        ...colors[Math.floor(Math.random() * colors.length)].split(' '),
        ...sizes[Math.floor(Math.random() * sizes.length)].split(' '),
        'rounded-full',
        'absolute',
        'animate-float-up'
      );
      
      const container = document.querySelector('.particle-container');
      if (container) {
        container.appendChild(particle);
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 5000);
      }
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes float-up {
            0% {
              transform: translateY(100vh) translateX(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100px) translateX(50px);
              opacity: 0;
            }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          .animate-spin-reverse {
            animation: spin-reverse 15s linear infinite;
          }
          .animate-float-up {
            animation: float-up 5s linear infinite;
          }
        `}
      </style>
      
      {/* Fondo animado con gradientes */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-800/50 via-transparent to-purple-800/50 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Contenedor de partículas */}
      <div className="particle-container absolute inset-0 pointer-events-none"></div>

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

      {/* Elementos decorativos */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-3/4 right-1/3 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-green-400 rounded-full animate-bounce opacity-50"></div>
      <div className="absolute top-1/2 right-1/4 w-5 h-5 bg-cyan-400 rounded-full animate-pulse opacity-45" style={{animationDelay: '0.5s'}}></div>

      {/* Contenedor principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Formulario con efecto glassmorphism */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                InverX
              </h1>
              <p className="text-white/80 text-lg">Únete al futuro de las inversiones</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Campo Nombre completo */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Campo Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Campo Teléfono */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  placeholder="Número de teléfono"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              {/* Campo Contraseña */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Campo Código de referido */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Código de referido (opcional)"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              </div>

              {/* Botón de registro */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </div>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </form>

            {/* Link a login */}
            <div className="mt-6 text-center">
              <p className="text-white/70">
                ¿Ya tienes cuenta?{' '}
                <a 
                  href="/login" 
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
                >
                  Inicia sesión
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de registro exitoso */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="¡Registro Exitoso!"
        type="success"
      >
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700 mb-6">
            Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión con tus credenciales.
          </p>
          <button
            onClick={handleSuccessModalClose}
            className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-300"
          >
            Ir al Login
          </button>
        </div>
      </Modal>
    </div>
  );
}
