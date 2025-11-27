import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import DisclaimerModal from '../components/DisclaimerModal'
import { getBoolean, setBoolean } from '../lib/storage'
import { useSession } from '../store/useSession'

const DISC_KEY = 'violetta-disclaimer-accepted'

export default function Splash() {
  const nav = useNavigate()
  const session = useSession((s) => s.session)
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)

  useEffect(() => {
    if (session) nav('/dashboard', { replace: true })
  }, [session, nav])

  useEffect(() => {
    const accepted = getBoolean(DISC_KEY, false)
    if (!accepted) setDisclaimerOpen(true)
  }, [])

  const acceptDisclaimer = () => {
    setBoolean(DISC_KEY, true)
    setDisclaimerOpen(false)
  }

  return (
    <main className="min-h-dvh bg-gradient-to-b from-fuchsia-50 to-pink-50">
      <header className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[var(--violetta,#a855f7)]" />
          <span className="font-semibold text-fuchsia-700">Violetta</span>
        </div>
        <nav className="text-sm">
          <Link to="/login" className="rounded-lg px-3 py-2 hover:bg-white/60">
            Iniciar sesión
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-bold text-fuchsia-700 md:text-5xl">
            Tu espacio seguro para pausar y estar mejor
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Registra cómo te sientes, recibe ejercicios breves y observa tu progreso día a día.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-xl bg-fuchsia-600 px-5 py-3 font-medium text-white hover:opacity-90"
            >
              Crear mi espacio
            </Link>
            <button
              onClick={() => setDisclaimerOpen(true)}
              className="rounded-xl border px-5 py-3 font-medium hover:bg-white/60"
            >
              Ver aviso
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-600">
            Al continuar aceptas nuestro aviso de alcance y privacidad.
          </p>
        </div>

        <div className="rounded-3xl bg-white/70 p-6 shadow-lg">
          <ul className="space-y-3 text-sm text-gray-800">
            <li>✅ Diario simple con seguimiento de estado de ánimo.</li>
            <li>✅ Ejercicios breves de respiración y grounding.</li>
            <li>✅ Funciona offline y se instala como app.</li>
          </ul>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="h-24 rounded-2xl bg-white shadow-inner" />
            <div className="h-24 rounded-2xl bg-white shadow-inner" />
            <div className="h-24 rounded-2xl bg-white shadow-inner" />
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-4 pb-10 text-xs text-gray-600">
        <button
          className="underline"
          onClick={() => {
            setBoolean(DISC_KEY, false)
            setDisclaimerOpen(true)
          }}
        >
          Restablecer aviso (debug)
        </button>
      </footer>

      <DisclaimerModal
        open={disclaimerOpen}
        onAccept={acceptDisclaimer}
        onClose={() => setDisclaimerOpen(false)}
      />
    </main>
  )
}
