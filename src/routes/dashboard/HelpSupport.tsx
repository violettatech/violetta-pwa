import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Componente reutilizable para una pregunta frecuente (FAQ)
function FaqItem({ question, answer }: { question: string, answer: string }) {
  return (
    <details className="py-4 border-b border-gray-100 last:border-b-0 group">
      <summary className="font-medium text-gray-800 cursor-pointer list-none flex justify-between items-center group-open:text-violet-600">
        {question}
        <svg className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <p className="text-sm text-gray-600 mt-3">{answer}</p>
    </details>
  );
}

export default function HelpSupport() {
  const nav = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col bg-white">
      <header className="p-4 flex items-center gap-4 sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100">
        <button onClick={() => nav(-1)} className="text-gray-500 hover:text-violet-600 p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Ayuda / Soporte</h1>
      </header>
      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-violet-700 uppercase tracking-wide pt-4 pb-2">Preguntas Frecuentes</h2>
          <FaqItem
  question="¿Cómo funciona Violetta IA?"
  answer="Violetta IA utiliza un modelo diseñado para acompañarte con calidez y seguridad. No usa tus conversaciones para entrenarse. Sus respuestas se basan en técnicas de bienestar emocional y primeros auxilios emocionales."
/>

<FaqItem
  question="¿Mis datos están seguros?"
  answer="Sí. Tu privacidad es una prioridad. Tus entradas de diario se guardan localmente en tu dispositivo. Tus mensajes con Violetta IA no se utilizan para entrenar modelos y no se comparten con terceros."
/>

<FaqItem
  question="¿Qué hago si estoy en una emergencia?"
  answer="Violetta no es un servicio de emergencia. Si estás en peligro o necesitas ayuda inmediata, llama al 911 o al número de emergencias local de tu país."
/>

<FaqItem
  question="¿Qué tipo de ayuda ofrece la Línea Violetta?"
  answer="La Línea Violetta ofrece apoyo psicológico y emocional. No sustituye a servicios médicos o policiales de emergencia."
/>

<FaqItem
  question="¿Qué es un Contacto de Confianza?"
  answer="Son personas que tú eliges para que puedas llamarlas o enviarles un mensaje rápidamente en caso de necesidad."
/>

<FaqItem
  question="¿Qué mensaje se envía cuando uso la opción de ayuda rápida?"
  answer="Se envía un mensaje predeterminado que puedes personalizar en Ajustes. Si activas el uso de ubicación, se puede adjuntar tu ubicación aproximada."
/>

<FaqItem
  question="¿Puedo usar Violetta sin conexión?"
  answer="Sí. Tu diario, metas y contactos funcionarán sin internet. La IA y los recursos profesionales requieren conexión."
/>

<FaqItem
  question="¿Cómo funcionan la racha y las insignias?"
  answer="La racha aumenta cada día que escribes en tu diario. Las insignias marcan tus primeros logros y se desbloquean conforme avanzas."
/>


          <h2 className="text-sm font-semibold text-violet-700 uppercase tracking-wide pt-6 pb-2">Contacto</h2>
          <p className="text-sm text-gray-600 mb-4">
            Si tienes alguna otra pregunta o necesitas asistencia, puedes contactarnos:
          </p>
          <a
            href="mailto:tech@holasoyvioletta.com" // Email de ejemplo
            className="block w-full text-center py-3 px-4 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700"
          >
            Enviar un Email
          </a>
           {/* Podrías añadir un enlace a redes sociales o un número de teléfono */}
        </div>
      </main>
    </div>
  );
}