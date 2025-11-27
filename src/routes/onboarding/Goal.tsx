import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../store/useOnboarding'
import { useSession } from '../../store/useSession'

const Card = ({
  active,
  label,
  onClick,
}: { active: boolean; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full rounded-2xl border p-4 text-left shadow-sm transition
    ${active ? 'border-fuchsia-500 ring-2 ring-fuchsia-200' : 'hover:bg-gray-50'}`}
  >
    <p className="text-lg font-semibold">{label}</p>
    <p className="text-sm text-gray-600 mt-1">
      {label === 'Mejorar mi ánimo' && 'Registrar emociones y practicar hábitos.'}
      {label === 'Manejar el estrés' && 'Pausas breves y grounding diario.'}
      {label === 'Dormir mejor' && 'Rutina corta para descansar mejor.'}
    </p>
  </button>
)

export default function Goal() {
  const nav = useNavigate()
  const { session, onboardingDone } = useSession()
  const { goal, setGoal } = useOnboarding()

  useEffect(() => {
    if (!session) nav('/login', { replace: true })
    if (onboardingDone) nav('/dashboard', { replace: true })
  }, [session, onboardingDone, nav])

  return (
    <main className="min-h-dvh grid place-items-center bg-gradient-to-b from-fuchsia-50 to-pink-50">
      <div className="w-[92%] max-w-lg rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">¿Cuál es tu objetivo principal?</h1>
        <div className="mt-4 grid gap-3">
          <Card active={goal === 'mood'} label="Mejorar mi ánimo" onClick={() => setGoal('mood')} />
          <Card active={goal === 'stress'} label="Manejar el estrés" onClick={() => setGoal('stress')} />
          <Card active={goal === 'sleep'} label="Dormir mejor" onClick={() => setGoal('sleep')} />
        </div>
        <div className="mt-6 flex justify-end">
          <button
            disabled={!goal}
            onClick={() => nav('/onboarding/frequency')}
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-white disabled:opacity-50"
          >
            Continuar
          </button>
        </div>
      </div>
    </main>
  )
}
