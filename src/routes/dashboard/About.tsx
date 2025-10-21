import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const nav = useNavigate();

  // Información obtenida (o simulada si la API falló)
  const aboutInfo = {
    mission: "Acompañar a las mujeres en sus procesos de bienestar emocional, prevención y atención de las violencias, brindando herramientas que les permitan construir relaciones sanas y fortalecer su autonomía.",
    vision: "Ser una comunidad de apoyo referente para las mujeres en Latinoamérica, reconocida por su impacto en la promoción de la salud mental, la equidad de género y la erradicación de las violencias.",
    values: ["Sororidad", "Empatía", "Respeto", "Confidencialidad", "Profesionalismo", "Interseccionalidad"],
    offerings: [
      "Línea de ayuda psicológica y legal gratuita 24/7.",
      "Talleres y capacitaciones en temas de bienestar, género y prevención.",
      "Contenido psicoeducativo a través de redes sociales y blog.",
      "Una aplicación móvil con herramientas de autogestión emocional."
    ],
    // Puedes añadir más detalles aquí si los obtienes
  };

  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col bg-white">
      <header className="p-4 flex items-center gap-4 sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100">
        <button onClick={() => nav(-1)} className="text-gray-500 hover:text-violet-600 p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Acerca de Violetta</h1>
      </header>
      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-6 text-gray-700 text-sm leading-relaxed">
        
        <p className="text-center text-lg font-semibold text-violet-700 mt-2">
          Somos una comunidad de apoyo para mujeres.
        </p>

        <div>
          <h2 className="font-semibold text-gray-800 mb-2">Nuestra Misión</h2>
          <p>{aboutInfo.mission}</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 mb-2">Nuestra Visión</h2>
          <p>{aboutInfo.vision}</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 mb-2">Nuestros Valores</h2>
          <ul className="list-disc pl-5 space-y-1">
            {aboutInfo.values.map(value => <li key={value}>{value}</li>)}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 mb-2">¿Qué Ofrecemos?</h2>
          <ul className="list-disc pl-5 space-y-1">
             {aboutInfo.offerings.map((offer, index) => <li key={index}>{offer}</li>)}
          </ul>
        </div>
        
        {/* Puedes añadir versión de la app, enlaces a políticas, etc. */}
        <div className="pt-4 text-xs text-gray-400 text-center">
          <p>Violetta App v1.0.0 (Demo)</p>
          <a href="https://holasoyvioletta.com/politica-de-privacidad/" target="_blank" rel="noreferrer" className="underline hover:text-violet-600">Política de Privacidad</a>
          {' - '}
          <a href="https://holasoyvioletta.com/terminos-y-condiciones/" target="_blank" rel="noreferrer" className="underline hover:text-violet-600">Términos y Condiciones</a>
        </div>

      </main>
    </div>
  );
}