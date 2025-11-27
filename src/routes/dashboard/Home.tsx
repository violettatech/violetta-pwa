// src/routes/dashboard/Home.tsx
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Smile,
  Frown,
  Meh,
  Annoyed,
  Plus,
  BookOpen,
  MessageSquare,
  Star,
  Users,
  Filter,
} from 'lucide-react'

import { useSession } from '../../store/useSession'
import { useGoals } from '../../store/useGoals'
import { useCheckins } from '../../store/useCheckins'
import type { GrammaticalGender } from '../../store/useSession'
import { g } from '../../utils/gender'
import { MICROCOPY } from '../../lib/microcopy'

// -------------------------------
// Tipos auxiliares (descubrimientos)
type Discovery = {
  icon: React.ComponentType<{ size?: number; className?: string }>
  kind: 'chat' | 'journal' | 'tech' | 'streak' | 'article'
  tone: 'emerald' | 'rose' | 'indigo' | 'amber' | 'cyan'
  title: string
  text: string
  cta: string
  onClick: () => void
}

const toneMap: Record<
  Discovery['tone'],
  { card: string; iconWrap: string; text: string; border: string; cta: string }
> = {
  emerald: {
    card: 'bg-emerald-50/60 border-emerald-100',
    iconWrap: 'bg-emerald-100 text-emerald-700',
    text: 'text-emerald-900',
    border: 'before:bg-emerald-300',
    cta: 'text-emerald-700',
  },
  rose: {
    card: 'bg-rose-50/60 border-rose-100',
    iconWrap: 'bg-rose-100 text-rose-700',
    text: 'text-rose-900',
    border: 'before:bg-rose-300',
    cta: 'text-rose-700',
  },
  indigo: {
    card: 'bg-indigo-50/60 border-indigo-100',
    iconWrap: 'bg-indigo-100 text-indigo-700',
    text: 'text-indigo-900',
    border: 'before:bg-indigo-300',
    cta: 'text-indigo-700',
  },
  amber: {
    card: 'bg-amber-50/60 border-amber-100',
    iconWrap: 'bg-amber-100 text-amber-800',
    text: 'text-amber-900',
    border: 'before:bg-amber-300',
    cta: 'text-amber-700',
  },
  cyan: {
    card: 'bg-cyan-50/60 border-cyan-100',
    iconWrap: 'bg-cyan-100 text-cyan-700',
    text: 'text-cyan-900',
    border: 'before:bg-cyan-300',
    cta: 'text-cyan-700',
  },
}

function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-3 py-1.5 rounded-full text-xs font-medium border transition',
        active
          ? 'bg-violet-600 text-white border-violet-600'
          : 'bg-white/80 text-gray-700 border-gray-200 hover:border-violet-300 hover:text-violet-700',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

// -------------------------------
// Tipos del Micro Check-in
type Contexto = 'pareja' | 'familia' | 'trabajo' | 'amistades' | 'publico' | 'otro'
type Boundary = 'no' | 'duda' | 'si'
type BoundaryTipo =
  | 'control'
  | 'insultos'
  | 'celos'
  | 'aislamiento'
  | 'dinero'
  | 'sexual'
  | 'fisico'
  | 'digital'
type Safety = 'si' | 'no_segura' | 'no'

// Chips del modal (no interfieren con los de filtros)
function MicroChip<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T | null
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              active
                ? 'bg-violet-600 text-white'
                : 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function MicroMultiChip<T extends string>({
  options,
  values,
  onToggle,
}: {
  options: { value: T; label: string }[]
  values: T[]
  onToggle: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = values.includes(opt.value)
        return (
          <button
            key={opt.value}
            onClick={() => onToggle(opt.value)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              active
                ? 'bg-rose-600 text-white'
                : 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// -------------------------------
// Sección Descubrimientos
function DiscoveriesSection({
  name,
  gender,
}: {
  name: string
  gender: GrammaticalGender
}) {
  const nav = useNavigate()

  const source: Discovery[] = useMemo(
    () => [
      {
        icon: MessageSquare,
        kind: 'chat',
        tone: 'cyan',
        title: '¿Quieres platicarlo conmigo?',
        text:
          'Si registras emociones difíciles, puedo acompañarte a hablarlo con calma cuando lo necesites.',
        cta: 'Abrir chat',
        onClick: () => nav('/dashboard/chat'),
      },
      {
        icon: BookOpen,
        kind: 'journal',
        tone: 'rose',
        title: '¿Quieres guardar esto en tu diario?',
        text:
          'A veces escribir ayuda a ordenar lo que vives. Puedes registrar cualquier momento importante.',
        cta: 'Escribir en mi diario',
        onClick: () => nav('/dashboard/journal'),
      },
      {
        icon: Star,
        kind: 'article',
        tone: 'emerald',
        title: 'Recurso recomendado para ti',
        text:
          'Un artículo sencillo sobre cómo cuidar tu bienestar emocional en relaciones importantes.',
        cta: 'Leer artículo',
        onClick: () => window.open('#', '_blank', 'noreferrer'),
      },
      // 🔁 Tarjeta 4 actualizada, enfocada en analizar progreso
      {
        icon: Users,
        kind: 'streak',
        tone: 'amber',
        title: 'Revisa tu progreso',
        text:
          'Ve cómo han cambiado tus registros y celebra tus avances a tu ritmo.',
        cta: 'Ver mi progreso',
        onClick: () => nav('/dashboard/journey'),
      },
    ],
    [nav, name, gender],
  )

  const [filter, setFilter] = useState<'all' | Discovery['kind']>('all')
  const filtered = source.filter((d) =>
    filter === 'all' ? true : d.kind === filter,
  )

  return (
    <section>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-gray-800">
          {MICROCOPY.discoveriesTitle}
        </h2>
        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
          <Filter size={14} /> {MICROCOPY.discoveriesSubtitle}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Estas sugerencias se basan en lo que registras en tus check-ins,
        tu diario y tus conversaciones conmigo.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'chat', 'journal', 'article', 'streak'] as const).map(
          (key) => (
            <Chip
              key={key}
              active={filter === key}
              onClick={() => setFilter(key as any)}
            >
              {key === 'all'
                ? 'Todos'
                : key === 'chat'
                ? 'Chat'
                : key === 'journal'
                ? 'Diario'
                : key === 'article'
                ? 'Artículos'
                : 'Progreso'}
            </Chip>
          ),
        )}
      </div>

      <div className="grid gap-3">
        {filtered.map((d, i) => {
          const tone = toneMap[d.tone]
          const Icon = d.icon
          return (
            <article
              key={i}
              className={[
                'relative overflow-hidden rounded-2xl border p-4 shadow-sm transition hover:shadow-md',
                tone.card,
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <div
                  className={[
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    tone.iconWrap,
                  ].join(' ')}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {d.title}
                  </h3>
                  <p className={`mt-1 text-sm ${tone.text}`}>{d.text}</p>
                  <button
                    onClick={d.onClick}
                    className={[
                      'mt-2 text-sm font-semibold hover:underline',
                      tone.cta,
                    ].join(' ')}
                  >
                    {d.cta}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}


// -------------------------------
// Página Home
export default function Home() {
  const nav = useNavigate()

  const { session } = useSession()
  const { goals } = useGoals()
  const { add } = useCheckins()

  const name = session?.userName || 'amiga'
  const gender: GrammaticalGender = session?.grammaticalGender || 'x'

  const hasGoals = !!(goals && goals.length > 0)
  const goalProgress = hasGoals ? 50 : 0

  // Estado del micro check-in
  const [checkOpen, setCheckOpen] = useState(false)
  const [mood, setMood] = useState<string | null>(null)
  const [contexto, setContexto] = useState<Contexto | null>(null)
  const [boundary, setBoundary] = useState<Boundary>('no')
  const [boundaryTipos, setBoundaryTipos] = useState<BoundaryTipo[]>([])
  const [safety, setSafety] = useState<Safety | null>(null)

  // Lógica de riesgo
  const riesgo = boundary !== 'no' || safety === 'no' || safety === 'no_segura'

  const flowType = useMemo(() => {
    if (!mood) return null
    if (['Feliz'].includes(mood)) return 'positive'
    if (['Neutral'].includes(mood)) return 'neutral'
    return 'negative'
  }, [mood])

  const openCheck = (m: string) => {
    setMood(m)
    setContexto(null)
    setBoundary('no')
    setBoundaryTipos([])
    setSafety(null)
    setCheckOpen(true)
  }

  const save = (action: 'guardar' | 'diario' | 'ayuda') => {
    const payload = {
      timestamp: new Date().toISOString(),
      mood,
      contexto,
      boundary,
      boundaryTipos,
      safety,
    }

    const created = add(payload)
    console.log('Check-in guardado:', created)

    setCheckOpen(false)

    if (action === 'ayuda') return nav('/dashboard/emergency')
    if (action === 'diario') {
      return nav('/dashboard/journal', { state: { checkIn: created } })
    }
  }

  const emotions = [
    { icon: Smile, label: 'Feliz' },
    { icon: Frown, label: 'Triste' },
    { icon: Meh, label: 'Neutral' },
    { icon: Annoyed, label: 'Molestia' },
  ]

  return (
    <div className="space-y-8 pb-32">
      {/* ¿Cómo te sientes hoy? */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
          ¿Cómo te sientes hoy?
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Toca un ícono para registrar cómo te sientes ahora.
        </p>
        <div className="flex justify-around items-center">
          {emotions.map(({ icon: Icon, label }) => (
            <button key={label} onClick={() => openCheck(label)} title={label}>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Icon size={32} />
              </div>
            </button>
          ))}
          <button onClick={() => openCheck('Otro')} title="Más opciones">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-2">
              <Plus size={28} className="text-gray-400" />
            </div>
          </button>
        </div>
      </section>

      {/* ¿Necesitas hablar? */}
      <section>
        <button
          onClick={() => nav('/dashboard/chat')}
          className="w-full text-left bg-gradient-to-br from-violet-50 to-purple-50 p-5 rounded-2xl border border-violet-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-lg bg-white/50 text-violet-600 flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">¿Necesitas hablar?</h2>
            <p className="text-sm text-gray-600">Estoy aquí para escucharte.</p>
          </div>
        </button>
      </section>

      {/* Mis metas */}
      <section>
        <button
          onClick={() => nav('/dashboard/journey')}
          className="w-full text-left bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-3">Mis metas</h2>
          {hasGoals ? (
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-600">Tu progreso general:</p>
                <p className="text-sm font-semibold text-teal-700">
                  {goalProgress}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-teal-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
              <span className="block text-sm text-violet-600 font-semibold mt-4">
                VER MIS METAS {'>'}
              </span>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Aún no has agregado metas. Definir objetivos te ayuda a crecer.
              </p>
              <span className="inline-block text-sm bg-violet-100 text-violet-700 font-semibold px-4 py-2 rounded-full">
                + Agregar meta
              </span>
            </div>
          )}
        </button>
      </section>

      {/* Descubrimientos */}
      <DiscoveriesSection name={name} gender={gender} />

      {/* Modal Micro Check-in */}
      {checkOpen && (
        <>
          <button
            aria-hidden
            onClick={() => setCheckOpen(false)}
            className="fixed inset-0 z-[80] bg-black/10 backdrop-blur-sm"
          />
          <div
            className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-md rounded-t-3xl border border-gray-100 bg-white p-4 shadow-2xl max-h-[70vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Chequeo rápido"
            style={{ bottom: 'calc(env(safe-area-inset-bottom) + 88px)' }}
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-gray-200" />
            <div className="mt-2">
              <p className="text-center text-sm text-gray-500">
                Emoción seleccionada
              </p>
              <p className="mt-1 text-center text-2xl font-semibold text-gray-800">
                {mood}
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {flowType === 'positive' && (
                <div className="text-left p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-800">
                    ¡Qué buena noticia!
                  </h3>
                  <p className="text-sm text-emerald-700 mt-1">
                    Me alegra que te sientas así. ¿Quieres guardar este momento en
                    tu diario?
                  </p>
                </div>
              )}
              {flowType === 'neutral' && (
                <div className="text-left p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-700">
                    A veces un día neutral también es un buen día. ¿Quieres añadir
                    algún detalle o contexto?
                  </p>
                </div>
              )}
              {flowType === 'negative' && (
                <div className="text-left p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <p className="text-sm text-rose-700">
                    Lamento que te sientas así. Contarme un poco más puede ayudarme
                    a acompañarte mejor.
                  </p>
                </div>
              )}

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-gray-900">
                  ¿Dónde pasó?
                </legend>
                <MicroChip<Contexto>
                  options={[
                    { value: 'pareja', label: 'Pareja' },
                    { value: 'familia', label: 'Familia' },
                    { value: 'trabajo', label: 'Trabajo' },
                    { value: 'amistades', label: 'Amistades' },
                    { value: 'publico', label: 'Espacio público' },
                    { value: 'otro', label: 'Otro' },
                  ]}
                  value={contexto}
                  onChange={setContexto}
                />
              </fieldset>

              {flowType === 'negative' && (
                <>
                  <fieldset>
                    <legend className="mb-2 text-sm font-semibold text-gray-900">
                      ¿Se cruzó algún límite hoy?
                    </legend>
                    <MicroChip<Boundary>
                      options={[
                        { value: 'no', label: 'No' },
                        { value: 'duda', label: 'Tengo dudas' },
                        { value: 'si', label: 'Sí' },
                      ]}
                      value={boundary}
                      onChange={(v) => {
                        setBoundary(v)
                        if (v === 'no') setBoundaryTipos([])
                      }}
                    />
                    {(boundary === 'duda' || boundary === 'si') && (
                      <div className="mt-3">
                        <p className="mb-2 text-xs text-gray-600">
                          ¿De qué tipo? (Puedes marcar varios)
                        </p>
                        <MicroMultiChip<BoundaryTipo>
                          options={[
                            { value: 'control', label: 'Control' },
                            { value: 'insultos', label: 'Insultos' },
                            { value: 'celos', label: 'Celos' },
                            { value: 'aislamiento', label: 'Aislamiento' },
                            { value: 'dinero', label: 'Dinero' },
                            { value: 'sexual', label: 'Sexual' },
                            { value: 'fisico', label: 'Físico' },
                            { value: 'digital', label: 'Digital' },
                          ]}
                          values={boundaryTipos}
                          onToggle={(val) =>
                            setBoundaryTipos((curr) =>
                              curr.includes(val)
                                ? curr.filter((x) => x !== val)
                                : [...curr, val],
                            )
                          }
                        />
                      </div>
                    )}
                  </fieldset>

                  <fieldset>
                    <legend className="mb-2 text-sm font-semibold text-gray-900">
                      ¿Te sientes segura ahora?
                    </legend>
                    <MicroChip<Safety>
                      options={[
                        { value: 'si', label: 'Sí' },
                        { value: 'no_segura', label: 'No estoy segura' },
                        { value: 'no', label: 'No' },
                      ]}
                      value={safety}
                      onChange={setSafety}
                    />
                  </fieldset>
                </>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                onClick={() => save('guardar')}
                className="flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Guardar
              </button>

              <button
                onClick={() => save('diario')}
                className="flex-1 rounded-full bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                {flowType === 'positive' ? 'Guardar en diario' : 'Abrir diario'}
              </button>
            </div>

            {riesgo && (
              <div className="mt-3 rounded-2xl bg-rose-50 p-3 text-rose-700">
                <p className="text-sm font-semibold">
                  ¿Necesitas apoyo con esto?
                </p>
                <p className="mt-1 text-xs">
                  Puedes revisar tu red de apoyo y los recursos que tienes a la
                  mano.
                </p>
                <button
                  onClick={() => save('ayuda')}
                  className="mt-2 w-full rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  Ir a Mi red
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
