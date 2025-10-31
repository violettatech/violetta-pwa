import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../../store/useSession'
import { g } from '../../utils/gender'

export default function Onboarding3() {
  const nav = useNavigate()
  const { session, setOnboardingDone, setSession } = useSession()
  const gender = session?.grammaticalGender || 'x'
  const name = session?.userName || 'amigx'

  // 🔧 Crea una sesión demo si no existe
  useEffect(() => {
    if (!session) {
      setSession({
        userName: 'amiga',
        hasCompletedOnboarding: false,
        createdAt: new Date().toISOString(),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const finish = () => {
    setOnboardingDone(true)
    nav('/dashboard', { replace: true })
  }

  const back = () => nav('/auth/onboarding/2')

  // ✅ Evita render hasta tener sesión
  if (!session) return null

  return (
    <main className="min-h-dvh flex flex-col justify-center items-center bg-gradient-to-b from-violet-50 to-pink-50 p-6 text-center">
      <div className="w-full max-w-sm">
        {/* Ilustración o ícono */}
        <div className="mb-8">
          <div className="bg-violet-200 rounded-full w-40 h-40 mx-auto flex items-center justify-center">
            <span className="text-7xl">✨</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-violet-800">¡Todo listo!</h1>
        <p className="mt-2 text-violet-800 font-semibold">
          {g('Bienvenid', gender)}, {name}.
        </p>
        <p className="mt-3 text-gray-600">
          Tu espacio seguro está {g('preparad', gender)} para ti. Recuerda, estoy aquí para escucharte sin juicios.
        </p>

        <div className="mt-10">
          <button
            onClick={finish}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 px-4 py-4 font-semibold text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            Ir al Dashboard →
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
