import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExercises } from '../../store/useExercises'
import { useEmergency } from '../../store/useEmergency'

/** Widget de respiración embebido (4-4-6 por defecto) */
function BreathingWidget({
  inhale = 4,
  hold = 4,
  exhale = 6,
  rounds = 3,
  onDone,
}: {
  inhale?: number
  hold?: number
  exhale?: number
  rounds?: number
  onDone?: () => void
}) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'done'>('inhale')
  const [count, setCount] = useState(inhale)
  const [round, setRound] = useState(1)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    const step = () => {
      setCount((c) => {
        if (c > 1) return c - 1
        // cambiar de fase
        setPhase((p) => {
          if (p === 'inhale') {
            setCount(hold || 1)
            return hold > 0 ? 'hold' : 'exhale'
          }
          if (p === 'hold') {
            setCount(exhale)
            return 'exhale'
          }
          // exhale
          if (round >= rounds) {
            onDone?.()
            return 'done'
          }
          setRound((r) => r + 1)
          setCount(inhale)
          return 'inhale'
        })
        return 0
      })
    }
    if (phase === 'done') return
    timer.current = window.setInterval(step, 1000)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [phase, inhale, hold, exhale, rounds, round, onDone])

  const label =
    phase === 'inhale' ? 'Inhala' : phase === 'hold' ? 'Sostén' : phase === 'exhale' ? 'Exhala' : 'Listo'

  if (phase === 'done') {
    return (
      <div className="text-center">
        <p className="text-lg font-medium text-green-700">Bien ✨</p>
        <p className="text-sm text-gray-600">Respiración completada</p>
      </div>
    )
  }

  return (
    <div className="grid place-items-center gap-2">
      <div className="h-24 w-24 rounded-full border-4 border-fuchsia-300 grid place-items-center text-3xl font-bold text-fuchsia-700">
        {count || (phase === 'exhale' ? exhale : inhale)}
      </div>
      <p className="text-sm text-gray-700">{label}</p>
      <p className="text-xs text-gray-500">Ronda {round}/{rounds}</p>
    </div>
  )
}

export default function Emergency() {
  const nav = useNavigate()
  const { markCompleted } = useExercises()
  const {
    contacts, resources, shareStatusPublic,
    addContact, updateContact, removeContact, setPrimary, setShareStatusPublic,
  } = useEmergency()
  const primary = useMemo(() => contacts.find(c => c.isPrimary) || contacts[0], [contacts])

  const [showBreath, setShowBreath] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const startBreath = () => setShowBreath(true)
  const doneBreath = () => {
    markCompleted()
    setShowBreath(false)
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Plan de emergencia</h2>
        <p className="text-sm text-gray-600">
          Acciones rápidas para cuando lo necesites. Tu información se guarda en este dispositivo.
        </p>
      </header>

      {/* Acciones inmediatas */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Paso 1</p>
          <h3 className="mt-1 font-semibold">Respirar ahora</h3>
          {!showBreath ? (
            <button
              onClick={startBreath}
              className="mt-3 w-full rounded-xl bg-fuchsia-600 px-4 py-2 text-white hover:opacity-90"
            >
              Iniciar respiración 4-4-6
            </button>
          ) : (
            <div className="mt-3">
              <BreathingWidget onDone={doneBreath} />
              <button
                onClick={doneBreath}
                className="mt-3 w-full rounded-xl border px-4 py-2 hover:bg-gray-50"
              >
                Terminar
              </button>
            </div>
          )}
          <p className="mt-3 text-xs text-gray-500">
            Consejo: 3 rondas suelen bajar la activación en &lt;2 min.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Paso 2</p>
          <h3 className="mt-1 font-semibold">Contactar a alguien</h3>
          {primary ? (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-700">
                Principal: <span className="font-medium">{primary.name}</span>
              </p>
              <div className="flex gap-2">
                {primary.phone ? (
                  <a
                    href={`tel:${primary.phone}`}
                    className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-center text-white hover:opacity-90"
                  >
                    Llamar
                  </a>
                ) : (
                  <button
                    onClick={() => nav('/dashboard/profile')}
                    className="flex-1 rounded-xl border px-4 py-2 hover:bg-gray-50"
                  >
                    Agregar teléfono
                  </button>
                )}
                <button
                  onClick={() => nav('/dashboard/profile')}
                  className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                >
                  Cambiar
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-600">Agrega un contacto abajo.</p>
          )}
          <p className="mt-3 text-xs text-gray-500">
            Si estás en riesgo, utiliza servicios de emergencia de tu país.
          </p>
        </div>
      </div>

      {/* Recursos rápidos */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <p className="text-sm font-medium">Recursos</p>
        {resources.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">Sin recursos. Puedes añadir los tuyos.</p>
        ) : (
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {resources.map((r) => (
              <li key={r.id}>
                {r.url.startsWith('/') ? (
                  <button
                    onClick={() => nav(r.url)}
                    className="w-full rounded-xl border px-4 py-2 text-left hover:bg-gray-50"
                  >
                    {r.label}
                  </button>
                ) : (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-xl border px-4 py-2 hover:bg-gray-50"
                  >
                    {r.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Contactos de confianza (edición rápida) */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Contactos de confianza</p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={shareStatusPublic}
              onChange={(e) => setShareStatusPublic(e.target.checked)}
            />
            Estado visible públicamente (on/off)
          </label>
        </div>

        <ul className="mt-3 space-y-2">
          {contacts.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-2 rounded-xl border p-3">
              <input
                className="min-w-[10rem] flex-1 rounded-lg border px-3 py-1.5"
                value={c.name}
                onChange={(e) => updateContact(c.id, { name: e.target.value })}
                placeholder="Nombre"
              />
              <input
                className="min-w-[10rem] flex-1 rounded-lg border px-3 py-1.5"
                value={c.phone || ''}
                onChange={(e) => updateContact(c.id, { phone: e.target.value })}
                placeholder="Teléfono (opcional)"
              />
              <button
                onClick={() => setPrimary(c.id)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  c.isPrimary ? 'border-fuchsia-500 text-fuchsia-700' : 'hover:bg-gray-50'
                }`}
                title="Marcar principal"
              >
                {c.isPrimary ? 'Principal' : 'Hacer principal'}
              </button>
              <button
                onClick={() => removeContact(c.id)}
                className="rounded-lg border px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-50"
              >
                Borrar
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex flex-wrap items-end gap-2">
          <input
            className="min-w-[12rem] flex-1 rounded-lg border px-3 py-2"
            placeholder="Nuevo contacto — nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="min-w-[12rem] flex-1 rounded-lg border px-3 py-2"
            placeholder="Teléfono (opcional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            onClick={() => {
              if (!name.trim()) return
              addContact({ name: name.trim(), phone: phone.trim() || undefined, isPrimary: false })
              setName(''); setPhone('')
            }}
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-white hover:opacity-90"
          >
            Añadir
          </button>
        </div>
      </div>
    </section>
  )
}
