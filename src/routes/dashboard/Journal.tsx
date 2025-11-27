import { useEffect, useMemo, useRef, useState, useCallback } from 'react'

type Entry = {
  id: string
  title: string
  dateISO: string
  emoji?: string
  text: string
  note?: string
}

type StoreShape = {
  v: number
  items: Entry[]
}

const LS_KEY = 'violetta-journal'
const STORE_VERSION = 1

function fmtDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

// presets de inicio de reflexión
const PRESET_POOL = [
  { emoji: '✨', title: 'Logro reciente', preset: 'Hoy quiero reconocer un logro…' },
  { emoji: '🙏', title: 'Agradecimiento', preset: 'Hoy agradezco…' },
  { emoji: '🌙', title: 'Límites personales', preset: 'Hoy estoy explorando mis límites…' },
  { emoji: '💭', title: 'Algo que me preocupa', preset: 'Últimamente me preocupa…' },
  { emoji: '💡', title: 'Una idea nueva', preset: 'Hoy tuve esta idea…' },
  { emoji: '❤️', title: 'Un momento bonito', preset: 'Hoy viví un momento bonito…' },
  { emoji: '🔥', title: 'Algo que me molesta', preset: 'Hoy algo me hizo sentir molestia…' },
  { emoji: '😔', title: 'Algo que me entristece', preset: 'Hoy me sentí triste por…' },
  { emoji: '🌿', title: 'Algo que me calma', preset: 'Me hace sentir en paz…' },
  { emoji: '🧗‍♀️', title: 'Un desafío', preset: 'Estoy enfrentando este reto…' },
]

function safeSave(key: string, items: Entry[]) {
  const payload: StoreShape = { v: STORE_VERSION, items }
  try {
    localStorage.setItem(key, JSON.stringify(payload))
  } catch (err: any) {
    if (items.length > 1) {
      const trimmed = items.slice(0, Math.max(1, Math.floor(items.length * 0.9)))
      try {
        localStorage.setItem(key, JSON.stringify({ v: STORE_VERSION, items: trimmed }))
      } catch {
        localStorage.setItem(
          key,
          JSON.stringify({ v: STORE_VERSION, items: trimmed.slice(0, 1) })
        )
      }
    }
  }
}

export default function Journal() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [emoji, setEmoji] = useState<string | undefined>(undefined)
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  // presets dinamicos, se eligen una vez al montar
  const suggestions = useMemo(() => {
    const shuffled = [...PRESET_POOL].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }, [])

  // cargar inicial
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoreShape> | Entry[]
        const items: Entry[] = Array.isArray(parsed)
          ? (parsed as Entry[])
          : parsed?.items ?? []
        setEntries(items)
      } else {
        const seed: Entry[] = [
          {
            id: 'e1',
            title: 'Hoy me siento agradecida',
            dateISO: '2025-10-12',
            emoji: '🌸',
            text:
              'Hoy pude reconocer todo lo que he avanzado. Me siento más conectada conmigo misma y con mis decisiones.',
            note:
              'Cuando escribes sobre gratitud pareces sentirte más conectada y tranquila contigo. Notar esto puede ayudarte a repetir esos momentos.',
          },
          {
            id: 'e2',
            title: 'Reflexión sobre límites',
            dateISO: '2025-10-11',
            emoji: '🌙',
            text:
              'Aprendí que está bien decir que no. No tengo que complacer a todos para ser valiosa. Es un paso difícil pero necesario.',
            note:
              'Cuando hablas de poner límites es normal que aparezcan emociones de incomodidad o preocupación. Notarlo es un paso importante para cuidarte mejor.',
          },
        ]
        setEntries(seed)
      }
    } catch {
      /* ignore */
    }
  }, [])

  // guardar reactivo
  useEffect(() => {
    const save = () => safeSave(LS_KEY, entries)
    // @ts-ignore
    const idle = window.requestIdleCallback as undefined | ((cb: () => void) => number)
    if (idle) {
      const id = idle(save)
      return () => {
        // @ts-ignore
        const cancel = window.cancelIdleCallback as
          | undefined
          | ((id: number) => void)
        cancel && cancel(id)
      }
    } else {
      const t = setTimeout(save, 0)
      return () => clearTimeout(t)
    }
  }, [entries])

  // bloquear scroll y ocultar FAB al abrir modal
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    if (open) {
      html.classList.add('hide-fab')
      body.style.overflow = 'hidden'
    } else {
      html.classList.remove('hide-fab')
      body.style.overflow = ''
    }
    return () => {
      html.classList.remove('hide-fab')
      body.style.overflow = ''
    }
  }, [open])

  const emojis = ['😊', '😌', '😕', '😢', '😠', '🌸', '🌙', '⭐', '🌿']

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.text.toLowerCase().includes(q) ||
        (e.note || '').toLowerCase().includes(q)
    )
  }, [entries, query])

  const openNew = (preset?: string) => {
    setEditingId(null)
    setTitle('')
    setEmoji(undefined)
    setText(preset || '')
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 80)
  }

  const openEdit = useCallback((item: Entry) => {
    setEditingId(item.id)
    setTitle(item.title)
    setEmoji(item.emoji)
    setText(item.text)
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 80)
  }, [])

  // nota tipo Violetta, asocia tema y emoción
  const inferNote = (content: string, entryTitle?: string): string | undefined => {
    const all = `${entryTitle || ''} ${content}`.toLowerCase()

    const mentionsGratitude =
      all.includes('gracias') || all.includes('agradec')
    const mentionsLimits =
      all.includes('límite') ||
      all.includes('limite') ||
      all.includes('decir que no') ||
      all.includes('poner límites') ||
      all.includes('poner limites')
    const mentionsAchievement =
      all.includes('logro') || all.includes('orgull') || all.includes('avanzad')
    const mentionsSad =
      all.includes('triste') || all.includes('vacío') || all.includes('vacìo')
    const mentionsAnger =
      all.includes('enoj') || all.includes('molest') || all.includes('frustrad')

    if (mentionsGratitude) {
      return 'Cuando escribes sobre gratitud pareces sentirte más tranquila y conectada contigo. Tal vez puedas buscar más momentos como estos en tu día.'
    }

    if (mentionsLimits) {
      return 'Cuando hablas de poner límites sueles conectar con incomodidad o preocupación. Notar cómo te sientes en estas situaciones puede ayudarte a cuidarte mejor.'
    }

    if (mentionsAchievement) {
      return 'Cuando nombras tus logros pareces sentir orgullo y avance personal. Volver a este tipo de reflexiones puede recordarte todo lo que ya has construido.'
    }

    if (mentionsSad) {
      return 'Cuando describes tristeza tu energía se percibe más baja y vulnerable. Reconocerlo puede ser un primer paso para pedir apoyo o darte descanso.'
    }

    if (mentionsAnger) {
      return 'Cuando hablas de enojo o molestia parece que estás defendiendo algo importante para ti. Observar qué estás protegiendo puede darte mucha claridad.'
    }

    if (content.trim().length > 40) {
      return 'Esta entrada puede ayudarte a notar cómo te sientes en situaciones como esta. Al releerla, pregúntate qué emoción aparece con más fuerza.'
    }

    return undefined
  }

  const save = () => {
    const t = title.trim() || 'Mi reflexión'
    const content = text.trim()
    if (!content) return

    const note = inferNote(content, t)

    if (editingId) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? { ...e, title: t, emoji, text: content, note }
            : e
        )
      )
    } else {
      const item: Entry = {
        id: `e-${Date.now()}`,
        title: t,
        emoji,
        text: content,
        note,
        dateISO: new Date().toISOString(),
      }
      setEntries((prev) => [item, ...prev])
    }

    setOpen(false)
  }

  const remove = (id: string) => {
    if (!confirm('¿Eliminar esta entrada?')) return
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="p-6 pb-4 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="inline-flex -mt-[2px]">
            {/* Icono lleno del navbar */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2.5A2.5 2.5 0 0 1 17.5 22H6.5A2.5 2.5 0 0 1 4 19.5zM6.5 2H20v13H6.5A2.5 2.5 0 0 1 4 12.5v-8A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </span>
          Mi Diario
        </h1>
        <div className="flex items-center gap-2">
          <button
            className="text-gray-500 hover:text-violet-600 p-2 rounded-full hover:bg-gray-100"
            onClick={() => {
              const ph = prompt('Buscar en tu diario')
              if (ph !== null) setQuery(ph)
            }}
            aria-label="Buscar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button
            className="text-gray-500 hover:text-violet-600 p-2 rounded-full hover:bg-gray-100"
            onClick={() => alert('Filtros próximamente ✨')}
            aria-label="Filtros"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main
        ref={wrapRef}
        className="flex-1 overflow-y-auto px-6 pb-28 main-container"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        <style>{`
          .main-container { scrollbar-width: none; }
          .main-container::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Sugerencias dinamicas */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-1">
            ¿Sobre qué quieres reflexionar hoy?
          </h2>
          <p className="text-xs text-gray-400 mb-3">
            Elige un tema para comenzar
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((s) => (
              <button
                key={s.title}
                onClick={() => openNew(s.preset)}
                className="bg-white border border-gray-200 shadow-sm 
                           px-4 py-4 rounded-2xl flex items-center gap-3
                           hover:bg-gray-100 text-left"
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="font-semibold text-gray-700 text-sm">
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          {query && (
            <p className="mt-3 text-xs text-gray-500">
              Mostrando resultados para: <span className="font-medium">“{query}”</span>{' '}
              <button
                className="underline hover:text-violet-700"
                onClick={() => setQuery('')}
              >
                limpiar
              </button>
            </p>
          )}
        </div>

        {/* Lista */}
        <div className="space-y-4">
          {filtered.map((e) => (
            <article
              key={e.id}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{e.title}</h3>
                  <p className="text-xs text-gray-400 font-medium">
                    {fmtDate(e.dateISO)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {e.emoji && <span className="text-2xl">{e.emoji}</span>}
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100"
                    title="Editar"
                    onClick={() => openEdit(e)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 21v-3a2 2 0 0 1 2-2h3"></path>
                      <path d="M7 17l9-9 3 3-9 9z"></path>
                      <path d="M14 4l6 6"></path>
                    </svg>
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100"
                    title="Eliminar"
                    onClick={() => remove(e.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                      <path d="M10 11v6"></path>
                      <path d="M14 11v6"></path>
                      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mt-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
                {e.text}
              </p>

              {e.note && (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-300 p-3 rounded-r-lg">
                  <p className="text-xs font-bold text-yellow-800">
                    💡 Violetta nota:
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">{e.note}</p>
                </div>
              )}
            </article>
          ))}

          {!filtered.length && (
            <p className="text-center text-sm text-gray-500 py-10">
              No encontramos entradas para tu búsqueda.
            </p>
          )}
        </div>
      </main>

      {/* FAB */}
      <button
        onClick={() => openNew()}
        className="fixed bottom-28 right-6 bg-violet-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-300 hover:bg-violet-700 transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-violet-300 z-40"
        aria-label="Nueva entrada"
        title="Nueva entrada"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[80] grid place-items-end sm:place-items-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
          <div
            className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {editingId ? 'Editar entrada' : 'Nueva entrada'}
            </h3>

            <div className="mt-3 grid grid-cols-[1fr,auto] gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título (opcional)"
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
              <button
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
                onClick={() => setEmoji(undefined)}
                title="Quitar emoji"
              >
                {emoji || '🙂'}
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {emojis.map((em) => (
                <button
                  key={em}
                  onClick={() => setEmoji(em)}
                  className={`rounded-lg px-2 py-1 text-lg ${
                    emoji === em ? 'bg-violet-100' : 'bg-white border'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>

            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe aquí..."
              rows={5}
              className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border px-4 py-2 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                className="flex-1 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
