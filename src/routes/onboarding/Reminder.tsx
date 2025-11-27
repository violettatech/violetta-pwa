import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../store/useOnboarding'
import { useSession } from '../../store/useSession'

const Chip = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-4 py-2 text-sm border transition
    ${active ? 'border-fuchsia-500 bg-fuchsia-50' : 'hover:bg-gray-50'}`}
  >
    {label}
  </button>
)

export default function Reminder() {
  const nav = useNavigate()
  const { session, onboardingDone } = useSession()
  const { reminder, setReminder } = useOnboarding()

  useEffect(() => {
    if (!session) nav('/login', { replace: true })
    if (onboardingDone) nav('/dashboard', { replace: true })
  }, [session, onboardingDone, nav])

  return (
    <main className="min-h-dvh grid place-items-center bg-gradient-to-b from-fuchsia-50 to-pink-50">
      <div className="w-[92%] max-w-lg rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">¿En qué momento prefieres tus recordatorios?</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip active={reminder === 'morning'}  label="Mañana (8–10 am)" onClick={() => setReminder('morning')} />
          <Chip active={reminder === 'afternoon'} label="Tarde (1–3 pm)"  onClick={() => setReminder('afternoon')} />
          <Chip active={reminder === 'evening'}  label="Noche (8–9 pm)"  onClick={() => setReminder('evening')} />
        </div>
        <div className="mt-6 flex justify-between">
          <button onClick={() => nav('/onboarding/frequency')} className="rounded-lg border px-4 py-2">Atrás</button>
          <button
            disabled={!reminder}
            onClick={() => nav('/onboarding/review')}
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-white disabled:opacity-50"
          >
            Continuar
          </button>
        </div>
      </div>
    </main>
  )
}
