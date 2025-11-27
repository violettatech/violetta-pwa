import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../store/useOnboarding'
import { useSession } from '../../store/useSession'

export default function Review() {
  const nav = useNavigate()
  const { session, onboardingDone, setOnboardingDone } = useSession()
  const { goal, frequency, reminder, reset } = useOnboarding()

  useEffect(() => {
    if (!session) nav('/login', { replace: true })
    if (onboardingDone) nav('/dashboard', { replace: true })
  }, [session, onboardingDone, nav])

  const goalLabel =
    goal === 'mood' ? 'Mejorar mi ánimo' :
    goal === 'stress' ? 'Manejar el estrés' :
    goal === 'sleep' ? 'Dormir mejor' : ''

  const freqLabel =
    frequency === 'daily' ? 'Diario' :
    frequency === '3week' ? '3 veces/semana' :
    frequency === '1week' ? '1 vez/semana' : ''

  const remLabel =
    reminder === 'morning' ? 'Mañana' :
    reminder === 'afternoon' ? 'Tarde' :
    reminder === 'evening' ? 'Noche' : ''

  const finish = () => {
    setOnboardingDone(true)
    reset()
    nav('/dashboard', { replace: true })
  }

  return (
    <main className="min-h-dvh grid place-items-center bg-gradient-to-b from-fuchsia-50 to-pink-50">
      <div className="w-[92%] max-w-lg rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">¡Listo! Revisa tus preferencias</h1>
        <ul className="mt-4 space-y-2 text-gray-800">
          <li><span className="font-medium">Objetivo:</span> {goalLabel}</li>
          <li><span className="font-medium">Frecuencia:</span> {freqLabel}</li>
          <li><span className="font-medium">Recordatorio:</span> {remLabel}</li>
        </ul>
        <div className="mt-6 flex justify-between">
          <button onClick={() => nav('/onboarding/reminder')} className="rounded-lg border px-4 py-2">Atrás</button>
          <button onClick={finish} className="rounded-lg bg-fuchsia-600 px-4 py-2 text-white">Comenzar</button>
        </div>
      </div>
    </main>
  )
}
