import { useNavigate } from 'react-router-dom'
import { useSession } from '../../store/useSession'
import { g } from '../../utils/gender'
import { MICROCOPY } from '../../lib/microcopy'
import violettaIsotipoBlanco from '../../assets/violetta-isotipo-blanco.png'

export default function Onboarding1() {
  const nav = useNavigate()
  const { session } = useSession()
  const gender = session?.grammaticalGender || 'x'
  const name = session?.userName || 'amigue'

  const next = () => nav('/auth/onboarding/2')
  const skip = () => nav('/auth/onboarding/3')

  return (
    <main className="min-h-dvh vio-bg">
      <div className="mx-auto max-w-md px-5 py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => nav(-1)}
            className="text-purple-700 hover:underline text-sm"
          >
            ← Volver
          </button>
          <span className="text-sm text-purple-600">1 / 3</span>
        </div>

        {/* Icono con isotipo */}
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pink-300 to-purple-300 shadow">
          <img
            src={violettaIsotipoBlanco}
            alt="Violetta"
            className="w-12 select-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
          />
        </div>

        <h1 className="text-center text-3xl font-semibold text-purple-900">
          {g('Bienvenid', gender)}, {name} ✨
        </h1>

        <p className="mt-3 text-center text-purple-700">
          {MICROCOPY.onboarding1Subtitle}
        </p>

        <section className="card mt-6 p-5 space-y-3 text-purple-900">
          <p>
            • Escribe cómo te sientes y comprende mejor tus emociones.
          </p>
          <p>
            • Accede a recursos y orientación cuando necesites apoyo.
          </p>
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
