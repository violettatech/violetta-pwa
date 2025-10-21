import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSession } from '../../store/useSession'
import BottomNav from '../../components/nav/BottomNav'
// Importa el nuevo ícono
import { User, Settings, Info, LogOut, HelpCircle } from 'lucide-react'; 

// --- UPDATED MenuSheet ---
function MenuSheet({
  open, onClose, onProfile, onSettings, onAbout, onHelp, onLogout, // Añadido onHelp
}: {
  open: boolean
  onClose: () => void
  onProfile: () => void
  onSettings: () => void
  onAbout: () => void
  onHelp: () => void // Nuevo prop
  onLogout: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex justify-end" onClick={onClose} role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative h-full w-[80%] max-w-[320px] bg-white shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b">
          <p className="text-lg font-semibold text-gray-900">Menú</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => { onClose(); onProfile() }}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
          >
            <User size={20} />
            <span>Mi Perfil</span>
          </button>
          <button
            onClick={() => { onClose(); onSettings() }}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
          >
            <Settings size={20} />
            <span>Configuración</span>
          </button>
          {/* --- NUEVO BOTÓN --- */}
          <button
            onClick={() => { onClose(); onHelp() }}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
          >
            <HelpCircle size={20} />
            <span>Ayuda / Soporte</span>
          </button>
          {/* --- FIN NUEVO BOTÓN --- */}
          <button
            onClick={() => { onClose(); onAbout() }}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
          >
            <Info size={20} />
            <span>Acerca de Violetta</span>
          </button>
        </nav>
        <div className="p-3 border-t">
          <button
            onClick={() => { onClose(); onLogout() }}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  )
}


export default function DashboardLayout() {
  const { session, clear } = useSession()
  const nav = useNavigate()
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false)
  const name = session?.userName || 'María'

  // La condición solo afecta al H1 ahora
  const showGreeting = location.pathname === '/dashboard' || location.pathname === '/dashboard/home';

  const logout = () => { clear(); nav('/auth/welcome', { replace: true }) }
  const goToSettings = () => nav('/dashboard/settings');
  const goToAbout = () => nav('/dashboard/about');
  const goToHelp = () => nav('/dashboard/help'); // Nueva función handler

  return (
    <main className="min-h-dvh bg-white pb-24">

      {/* --- HEADER SIEMPRE PRESENTE --- */}
      {/* El botón hamburguesa ahora está siempre visible */}
      <header className="p-6 flex justify-between items-center sticky top-0 z-40 bg-white/95 backdrop-blur">
        {/* El H1 solo se renderiza si showGreeting es true */}
        {showGreeting ? (
          <h1 className="text-2xl font-bold text-gray-800">
            Hola, {name} <span className="align-[-2px]">✨</span>
          </h1>
        ) : (
          // Si no se muestra el H1, dejamos un div vacío para mantener el layout
          <div className="w-6"></div> // Espaciador invisible
        )}

        <button
          onClick={() => setMenuOpen(true)}
          className="text-gray-500 hover:text-gray-800 p-1"
          aria-label="Menú"
        >
          {/* Icono Hamburguesa */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>
      {/* --- FIN HEADER --- */}

      {/* Ajusta el padding superior si el header de saludo no está */}
      <div className={`mx-auto max-w-md px-6 ${showGreeting ? 'pt-2' : 'pt-0'}`}>
        <Outlet />
      </div>

      {/* FAB central del chat */}
      <button
        onClick={() => nav('/dashboard/chat')}
        className="violetta-fab fixed bottom-10 left-1/2 z-[55] -translate-x-1/2 bg-violet-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg shadow-violet-300 hover:bg-violet-700 transition-transform hover:scale-110"
        aria-label="Conversar"
        title="Conversar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      <BottomNav />

      {/* Pasa la nueva función onHelp al MenuSheet */}
      <MenuSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onProfile={() => nav('/dashboard/profile')}
        onSettings={goToSettings}
        onAbout={goToAbout}
        onHelp={goToHelp} // Pasamos la nueva función
        onLogout={logout}
      />

      {/* El bloque <style> se simplifica, ya no ocultamos el header aquí */}
      <style>{`
        .hide-fab .violetta-fab {
          display: none !important;
        }
        
        /* Oculta solo la nav y el FAB en el modo inmersivo */
        .hide-main-nav footer, 
        .hide-main-nav .violetta-fab {
          display: none !important;
        }

        /* Quita el padding-bottom cuando la nav está oculta */
        .hide-main-nav { 
          padding-bottom: 0 !important;
        }
      `}</style>

    </main>
  )
}