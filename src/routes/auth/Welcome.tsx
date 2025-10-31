import { useNavigate } from 'react-router-dom'
import { MICROCOPY } from '../../lib/microcopy'
import violettaIsotipoBlanco from '../../assets/violetta-isotipo-blanco.png'

export default function Welcome(): JSX.Element {
  const nav = useNavigate()

  return (
    <div className="min-h-screen gradient-animate flex flex-col items-center justify-center p-6 fade-in">
      <div className="text-center space-y-6 max-w-md">

        {/* Círculo sólido con gradiente y isotipo blanco */}
        <div className="relative float-up">
          {/* Halo de luz detrás */}
          <div className="absolute inset-0 -z-10 mx-auto w-36 h-36 md:w-44 md:h-44 rounded-full blur-3xl opacity-40 bg-pink-300" />
          
          {/* Círculo principal */}
          <div className="mx-auto w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl
                          bg-gradient-to-br from-pink-400 to-purple-400
                          flex items-center justify-center">
            <img
              src={violettaIsotipoBlanco}
              alt="Violetta"
              className="w-30 md:w-30 select-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
              draggable={false}
            />
          </div>
        </div>

        {/* Separación visual */}
        <div className="h-2 md:h-3" />

        {/* Encabezado */}
        <h1 className="text-4xl font-light text-purple-900 float-up stagger-1">
          Hola, soy Violetta
        </h1>

        {/* Subtítulo */}
        <p className="text-lg text-purple-700 leading-relaxed float-up stagger-2">
          {MICROCOPY.welcomeMessage}
        </p>

        {/* Subcopy opcional */}
        {MICROCOPY.welcomeSubtitle && (
          <p className="text-sm text-purple-600 italic float-up stagger-3">
            {MICROCOPY.welcomeSubtitle}
          </p>
        )}

        {/* Botones */}
        <div className="space-y-4 pt-8">
          <button
            onClick={() => nav('/auth/register')}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-4 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 float-up stagger-4"
          >
            Crear mi espacio 💜
          </button>

          <button
            onClick={() => nav('/auth/login')}
            className="w-full border-2 border-purple-400 text-purple-600 py-4 rounded-full font-medium hover:bg-purple-50 hover:scale-105 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 float-up stagger-5"
          >
            Entrar
          </button>
        </div>

        {/* Firma */}
        <p className="text-xs text-purple-400 pt-4 float-up stagger-5">
          Con amor, Violetta
        </p>
      </div>
    </div>
  )
}
