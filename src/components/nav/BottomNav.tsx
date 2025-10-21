import React from 'react'; // Importar React para usar cloneElement
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const isActive = (p: string) => {
    if (p === '/dashboard/home') {
      return pathname === '/dashboard/home' || pathname === '/dashboard';
    }
    return pathname.startsWith(p);
  };

  const navItems = [
    { path: '/dashboard/home', label: 'Inicio', icon: 
      <svg width="26" height="26" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg> 
    },
    { path: '/dashboard/journal', label: 'Diario', icon: 
      // --- ICONO CAMBIADO ---
      <svg width="26" height="26" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          <line x1="8" y1="7" x2="16" y2="7" />
          <line x1="8" y1="11" x2="16" y2="11" />
      </svg>
      // --- FIN DEL CAMBIO ---
    },
    { path: '/dashboard/journey', label: 'Mi Viaje', icon: 
      <svg width="26" height="26" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mb-1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    },
    { path: '/dashboard/network', label: 'Mi Red', icon: 
      <svg width="26" height="26" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mb-1">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="4"></circle>
        <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
        <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
        <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
        <line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line>
        <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
      </svg>
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100">
      <div className="mx-auto max-w-md">
        <div className="flex justify-around items-center h-[72px] py-2">
          
          {navItems.slice(0, 2).map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => nav(item.path)}
                className={`flex flex-col items-center justify-center w-1/5 h-full transition-colors duration-200 ${
                  active ? 'text-violet-600' : 'text-gray-500 hover:text-violet-600'
                }`}
              >
                {/* Usamos React.cloneElement para añadir la propiedad 'fill' dinámicamente */}
                {React.cloneElement(item.icon, { fill: active ? 'currentColor' : 'none' })}
                <span className={`text-xs ${active ? 'font-semibold' : ''}`}>{item.label}</span>
              </button>
            );
          })}

          {/* Espaciador para el botón flotante del chat */}
          <div className="w-1/5" aria-hidden="true" />

          {navItems.slice(2).map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => nav(item.path)}
                className={`flex flex-col items-center justify-center w-1/5 h-full transition-colors duration-200 ${
                  active ? 'text-violet-600' : 'text-gray-500 hover:text-violet-600'
                }`}
              >
                {/* Hacemos lo mismo para la segunda mitad de los botones */}
                {React.cloneElement(item.icon, { fill: active ? 'currentColor' : 'none' })}
                <span className={`text-xs ${active ? 'font-semibold' : ''}`}>{item.label}</span>
              </button>
            );
          })}
          
        </div>
      </div>
    </footer>
  );
}

