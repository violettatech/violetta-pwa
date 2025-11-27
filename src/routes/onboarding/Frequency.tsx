import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../store/useOnboarding'
import { useSession } from '../../store/useSession'

const Opt = ({
  active,
  label,
  sub,
  onClick,
}: { active: boolean; label: string; sub: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full rounded-xl border p-4 text-left shadow-sm transition
    ${active ? 'border-fuchsia-500 ring-2 ring-fuchsia-200' : 'hover:bg-gray-50'}`}
  >
    <p className="font-medium">{label}</p>
    <p className="text-sm text-gray-600">{sub}</p>
  </button>
)

export default function Frequency() {
  const nav = useNavigate()
  const { session, onboardingDone } = useSession()
  const { frequency, setFrequency } = useOnboarding()

  useEffect(() => {
    if (!session) nav('/login', { replace: true })
    if (onboardingDone) nav('/dashboard', { replace: true })
  }, [session, onboardingDone, nav])

  return (
    <main className="min-h-dvh grid place-items-center bg-gradient-to-b from-fuchsia-50 to-pink-50">
      <div className="w-[92%] max-w-lg rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">¿Con qué frecuencia quieres usar Violetta?</h1>
        <div className="mt-4 grid gap-3">
          <Opt active={frequency === 'daily'} label="Diario" sub="5–10 minutos" onClick={() => setFrequency('daily')} />
          <Opt active={frequency === '3week'} label="3 veces por semana" sub="Lun-Mié-Vie" onClick={() => setFrequency('3week')} />
          <Opt active={frequency === '1week'} label="1 vez por semana" sub="Elige un día fijo" onClick={() => setFrequency('1week')} />
        </div>
        <div className="mt-6 flex justify-between">
          <button onClick={() => nav('/onboarding/goal')} className="rounded-lg border px-4 py-2">Atrás</button>
          <button
            disabled={!frequency}
            onClick={() => nav('/onboarding/reminder')}
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-white disabled:opacity-50"
          >
            Continuar
          </button>
        </div>
      </div>
    </main>
  )
}
