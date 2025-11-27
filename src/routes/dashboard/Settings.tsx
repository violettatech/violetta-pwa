import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Componente reutilizable para un switch (Toggle)
function ToggleSetting({ label, description, initialChecked = false }: { label: string, description: string, initialChecked?: boolean }) {
  const [isChecked, setIsChecked] = useState(initialChecked);

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => setIsChecked(!isChecked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
          isChecked ? 'bg-violet-600' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={isChecked}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isChecked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const nav = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col bg-white">
      <header className="p-4 flex items-center gap-4 sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100">
        <button onClick={() => nav(-1)} className="text-gray-500 hover:text-violet-600 p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Configuración</h1>
      </header>
      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-violet-700 uppercase tracking-wide pt-4 pb-2">Notificaciones</h2>
          <ToggleSetting
            label="Recordatorios diarios"
            description="Recibir una notificación para escribir en tu diario."
            initialChecked={true}
          />
          <ToggleSetting
            label="Descubrimientos"
            description="Recibir notificaciones sobre nuevos descubrimientos."
          />

          <h2 className="text-sm font-semibold text-violet-700 uppercase tracking-wide pt-6 pb-2">Privacidad</h2>
          <ToggleSetting
            label="Permisos de ubicación"
            description="Permitir acceso a la ubicación para funciones específicas."
          />
           <ToggleSetting
            label="Análisis de uso"
            description="Compartir datos anónimos para mejorar la app."
            initialChecked={true}
          />

          <h2 className="text-sm font-semibold text-violet-700 uppercase tracking-wide pt-6 pb-2">Cuenta</h2>
           {/* Podrías añadir opciones para cambiar nombre, email, etc. */}
           <button className="w-full text-left py-4 border-b border-gray-100 text-gray-800 hover:text-violet-600">
             Cambiar nombre de usuario
           </button>
            <button className="w-full text-left py-4 border-b border-gray-100 text-gray-800 hover:text-violet-600">
             Administrar suscripción (si aplica)
           </button>
        </div>
      </main>
    </div>
  );
}