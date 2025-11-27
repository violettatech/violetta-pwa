import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../../store/useSession'
import { g } from '../../utils/gender'
import type { GrammaticalGender } from '../../store/useSession'
import violettaIsotipoBlanco from '../../assets/violetta-isotipo-blanco.png'

export default function Onboarding3() {
  const nav = useNavigate()
  const { session, setOnboardingDone, setSession } = useSession()

  const gender: GrammaticalGender = session?.grammaticalGender || 'x'
  const name = session?.userName || 'amigue'

  // Crea una sesión demo si no existe (fallback neutro)
  useEffect(() => {
    if (!session) {
      setSession({
        userName: 'amigue',
        userEmail: '',
        hasCompletedOnboarding: false,
        createdAt: new Date().toISOString(),
        grammaticalGender: 'x',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const finish = () => {
    setOnboardingDone(true)
    nav('/dashboard/chat', { replace: true })
  }

  const back = () => nav('/auth/onboarding/2')

  // Evita render hasta tener sesión
  if (!session) return null

  return (
    <main className="min-h-dvh flex flex-col justify-center items-center bg-gradient-to-b from-violet-50 to-pink-50 p-6 text-center">
      <div className="w-full max-w-sm">
        {/* Icono con isotipo */}
        <div className="mb-8">
          <div className="mx-auto grid h-40 w-40 place-items-center rounded-full bg-gradient-to-br from-pink-300 to-purple-300 shadow">
            <img
              src={violettaIsotipoBlanco}
              alt="Violetta"
              className="w-20 select-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-violet-800">¡Todo listo!</h1>

        <p className="mt-2 text-violet-800 font-semibold">
          {g('Bienvenid', gender)}, {name}.
        </p>

        <p className="mt-3 text-gray-600">
          Tu espacio seguro está {g('preparad', gender)} para ti. Recuerda, estoy aquí
          para escucharte sin juicios.
        </p>

        <div className="mt-10">
          <button
            onClick={finish}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 px-4 py-4 font-semibold text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            Empecemos →
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={back}
              className="text-violet-600 hover:underline text-sm font-medium"
            >
              ← Atrás
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
