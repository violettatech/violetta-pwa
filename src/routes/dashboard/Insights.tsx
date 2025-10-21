import { useMemo } from 'react'
import { useJournal } from '../../store/useJournal'
import { useExercises } from '../../store/useExercises'
import { bestStreak, currentStreak, lastNDaysActivity, moodHistogram } from '../../lib/stats'

const MOOD_KEYS = [1, 2, 3, 4, 5] as const
type MoodKey = typeof MOOD_KEYS[number]

const moodLabel: Record<MoodKey, string> = {
  1: 'Muy bajo',
  2: 'Bajo',
  3: 'Neutral',
  4: 'Bien',
  5: 'Muy bien',
}
const moodEmoji: Record<MoodKey, string> = {
  1: '😞',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
}

export default function Insights() {
  const { entries } = useJournal()
  const { lastCompletedISO } = useExercises()

  const stats = useMemo(() => {
    const streakNow = currentStreak(entries)
    const streakBest = bestStreak(entries)
    const activity7 = lastNDaysActivity(entries, 7)
    const hist = moodHistogram(entries)
    const total = entries.length || 1
    const histPct = (v: number) => Math.round((v / total) * 100)
    return { streakNow, streakBest, activity7, hist, histPct, total }
  }, [entries])

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Insights</h2>
        <p className="text-sm text-gray-600">
          Tendencias simples para cuidar tu constancia y bienestar.
        </p>
      </header>

      {/* Racha */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <p className="text-sm text-gray-600">Racha actual</p>
        <div className="mt-2 flex items-end gap-6">
          <div>
            <p className="text-4xl font-bold text-fuchsia-700">{stats.streakNow}</p>
            <p className="text-sm text-gray-600">días al hilo</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mejor racha</p>
            <p className="text-lg font-semibold">{stats.streakBest} días</p>
          </div>
        </div>

        {/* Actividad de 7 días */}
        <div className="mt-5">
          <p className="text-sm font-medium">Últimos 7 días</p>
          <div className="mt-2 flex gap-2">
            {stats.activity7.map((d) => (
              <div key={d.iso} className="text-center">
                <div
                  title={d.iso}
                  className={`h-8 w-8 rounded-lg border ${
                    d.hasEntry ? 'bg-fuchsia-500 border-fuchsia-500' : 'bg-gray-100'
                  }`}
                />
                <p className="mt-1 text-[11px] text-gray-600">{d.weekday}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribución de estados de ánimo */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <p className="text-sm font-medium">Estados de ánimo registrados</p>
        <ul className="mt-3 space-y-2">
          {MOOD_KEYS.map((k) => {
            const count = stats.hist[k]
            const pct = stats.histPct(count)
            return (
              <li key={k} className="grid grid-cols-[80px_1fr_40px] items-center gap-2">
                <span className="text-sm text-gray-700">
                  {moodEmoji[k]} {moodLabel[k]}
                </span>
                <div className="h-2 rounded bg-gray-100">
                  <div
                    className="h-2 rounded bg-fuchsia-500"
                    style={{ width: `${pct}%` }}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                  />
                </div>
                <span className="text-xs text-gray-600 tabular-nums">{pct}%</span>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          Total de entradas: <span className="font-medium">{stats.total}</span>
        </p>
      </div>

      {/* Última sesión de ejercicios */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <p className="text-sm font-medium">Ejercicios</p>
        {lastCompletedISO ? (
          <p className="mt-2 text-gray-700">
            Última sesión completada:{' '}
            <span className="font-medium">
              {new Date(lastCompletedISO).toLocaleString()}
            </span>
          </p>
        ) : (
          <p className="mt-2 text-gray-600">
            Aún no has completado una sesión. Prueba la respiración guiada en{' '}
            <span className="font-medium">Ejercicios</span>.
          </p>
        )}
      </div>
    </section>
  )
}
