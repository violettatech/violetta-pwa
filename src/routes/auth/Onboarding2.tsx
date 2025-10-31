import { useNavigate } from 'react-router-dom'
import { useSession } from '../../store/useSession'

export default function Onboarding2() {
  const nav = useNavigate()
  // Importado por consistencia; útil si luego personalizas textos según la sesión
  const { session } = useSession()
  const next = () => nav('/auth/onboarding/3')
  const back = () => nav('/auth/onboarding/1')
  const skip = () => nav('/auth/onboarding/3')

  return (
    <main className="min-h-dvh vio-bg">
      <div className="mx-auto max-w-md px-5 py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={back} className="text-purple-700 hover:underline text-sm">← Atrás</button>
          <span className="text-sm text-purple-600">2 / 3</span>
        </div>

        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pink-300 to-purple-300 text-3xl text-white shadow">
          <span className="select-none">♡</span>
        </div>

        <h1 className="text-center text-3xl font-semibold text-purple-900">
          Cuidar tu privacidad y seguridad es nuestra prioridad
        </h1>
        <p className="mt-3 text-center text-purple-700">
          Cuidamos tu información con respeto y transparencia. Solo usamos tus datos para mejorar tu experiencia y ayudar a más personas de forma anónima.
        </p>

        <section className="card mt-6 p-5 space-y-3 text-purple-900">
          <p>• Tus conversaciones y datos son confidenciales y están protegidos con cifrado.</p>
          <p>• Solo usamos datos anónimos para generar estadísticas que nos ayuden a prevenir la violencia de género, cuidando siempre tu identidad.</p>
        </section>

        <div className="mt-6 flex gap-3">
          <button
            onClick={skip}
            className="flex-1 rounded-2xl border border-purple-200 bg-white px-4 py-3 text-purple-800 hover:bg-purple-50 transition"
          >
            Omitir
          </button>
          <button
            onClick={next}
            className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 px-4 py-3 font-semibold text-white"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </main>
  )
}
