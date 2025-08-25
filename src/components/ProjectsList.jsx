import React from 'react';

const ProjectsList = ({ 
  projects, 
  formatCOP, 
  onInvest
}) => {
  const handleInvestClick = (project) => {
    onInvest(project);
  };

  // Debug information removed

  return (
    <div data-section="projects">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
        Proyectos de Inversión
      </h2>
      
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="relative h-48 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-cyan-600/30">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    project.status === true 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                  }`}>
                    {project.status === true ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {project.name}
                  </h3>
                  <p className="text-gray-200 text-sm line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl border border-white/10">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Rentabilidad</p>
                    <p className="text-2xl font-bold text-purple-300 mt-1">
                      {((project.expectedReturnRate || project.profitability || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-xl border border-white/10">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Duración</p>
                    <p className="text-2xl font-bold text-cyan-300 mt-1">
                      {project.durationDays || project.duration || 'N/A'} días
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Monto fijo del proyecto:</span>
                    <span className="text-white font-semibold">
                      {formatCOP(project.fixedAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Total recaudado:</span>
                    <span className="text-cyan-300 font-semibold">
                      {formatCOP(project.totalRaised || 0)}
                    </span>
                  </div>
                </div>
                
                {/* Barra de progreso */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Progreso del proyecto</span>
                    <span className="text-gray-400 text-xs">
                      {Math.round(((project.totalRaised || 0) / project.fixedAmount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${Math.min(((project.totalRaised || 0) / project.fixedAmount) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleInvestClick(project)}
                  disabled={project.status !== true}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    project.status === true
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-purple-500/25 group-hover:scale-105'
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {project.status === true ? 'Invertir Ahora' : 'No Disponible'}
                  </span>
                  {project.status === true && (
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 text-center shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-gray-300 text-lg font-medium">No hay proyectos disponibles</p>
            <p className="text-gray-400 text-sm">Los proyectos de inversión aparecerán aquí cuando estén disponibles</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;