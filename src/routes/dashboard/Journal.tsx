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

// util: guardar con tolerancia a cuota (recorta las más antiguas)
function safeSave(key: string, items: Entry[]) {
  const payload: StoreShape = { v: STORE_VERSION, items }
  try {
    localStorage.setItem(key, JSON.stringify(payload))
  } catch (err: any) {
    // si excede cuota, borra las más viejas y reintenta
    if (items.length > 1) {
      const trimmed = items.slice(0, Math.max(1, Math.floor(items.length * 0.9)))
      try {
        localStorage.setItem(key, JSON.stringify({ v: STORE_VERSION, items: trimmed }))
      } catch {
        // último intento con 1 elemento
        localStorage.setItem(key, JSON.stringify({ v: STORE_VERSION, items: trimmed.slice(0, 1) }))
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

  // cargar inicial
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoreShape> | Entry[]
        // migración: si es arreglo plano, envuélvelo
        const items: Entry[] = Array.isArray(parsed) ? parsed as Entry[] : (parsed?.items ?? [])
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
            note: 'Expresas gratitud y autoconocimiento. ¡Sigue así!',
          },
          {
            id: 'e2',
            title: 'Reflexión sobre límites',
            dateISO: '2025-10-11',
            emoji: '🌙',
            text:
              'Aprendí que está bien decir que no. No tengo que complacer a todos para ser valiosa. Es un paso difícil pero necesario.',
            note:
              'Tema recurrente: establecer límites. ¿Quieres explorar más sobre esto?',
          },
        ]
        setEntries(seed)
      }
    } catch {
      /* ignore */
    }
  }, [])

  // guardar reactivo (idle si existe)
  useEffect(() => {
    const save = () => safeSave(LS_KEY, entries)
    // @ts-ignore
    const idle = window.requestIdleCallback as undefined | ((cb: () => void) => number)
    if (idle) {
      const id = idle(save)
      return () => {
        // @ts-ignore
        const cancel = window.cancelIdleCallback as undefined | ((id: number) => void)
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

  // UI helpers
  const suggestions = useMemo(
    () => [
      { label: 'Un logro reciente ✨', preset: 'Hoy quiero reconocer un logro…' },
      { label: 'Algo que agradezco 🙏', preset: 'Hoy agradezco…' },
      { label: 'Un desafío 🧗‍♀️', preset: 'Estoy enfrentando este reto…' },
    ],
    []
  )

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

  const inferNote = (content: string): string | undefined => {
    const c = content.toLowerCase()
    if (c.includes('gracias') || c.includes('agrade')) return 'Se aprecia un tono de gratitud. ¡Muy bien!'
    if (c.includes('límite') || c.includes(' no ')) return 'Estás trabajando en poner límites sanos. Eso es valioso.'
    return undefined
  }

  const save = () => {
    const t = title.trim() || 'Mi reflexión'
    const content = text.trim()
    if (!content) return

    const note = inferNote(content)

    if (editingId) {
      setEntries(prev =>
        prev.map(e =>
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
      setEntries(prev => [item, ...prev])
    }

    setOpen(false)
  }

  const remove = (id: string) => {
    if (!confirm('¿Eliminar esta entrada?')) return
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="p-6 pb-4 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="inline-flex -mt-[2px]">
            {/* Icono lleno del navbar */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2.5A2.5 2.5 0 0 1 17.5 22H6.5A2.5 2.5 0 0 1 4 19.5zM6.5 2H20v13H6.5A2.5 2.5 0 0 1 4 12.5v-8A2.5 2.5 0 0 1 6.5 2z"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button
            className="text-gray-500 hover:text-violet-600 p-2 rounded-full hover:bg-gray-100"
            onClick={() => alert('Filtros próximamente ✨')}
            aria-label="Filtros"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>
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
          .suggestions-container { scrollbar-width: none; }
          .suggestions-container::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Sugerencias */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            ¿Sobre qué quieres reflexionar hoy?
          </h2>
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto suggestions-container pb-2">
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => openNew(s.preset)}
                  className="bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap hover:bg-gray-100"
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-gray-50 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-gray-50 to-transparent" />
          </div>

          {query && (
            <p className="mt-3 text-xs text-gray-500">
              Mostrando resultados para: <span className="font-medium">“{query}”</span>{' '}
              <button className="underline hover:text-violet-700" onClick={() => setQuery('')}>
                limpiar
              </button>
            </p>
          )}
        </div>

        {/* Lista */}
        <div className="space-y-4">
          {filtered.map((e) => (
            <article key={e.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{e.title}</h3>
                  <p className="text-xs text-gray-400 font-medium">{fmtDate(e.dateISO)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {e.emoji && <span className="text-2xl">{e.emoji}</span>}
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100"
                    title="Editar"
                    onClick={() => openEdit(e)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21v-3a2 2 0 0 1 2-2h3"></path><path d="M7 17l9-9 3 3-9 9z"></path><path d="M14 4l6 6"></path>
                    </svg>
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100"
                    title="Eliminar"
                    onClick={() => remove(e.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mt-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
                {e.text}
              </p>

              {e.note && (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-300 p-3 rounded-r-lg">
                  <p className="text-xs font-bold text-yellow-800">💡 Violetta nota:</p>
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

      {/* FAB (abre modal) */}
      <button
        onClick={() => openNew()}
        className="fixed bottom-28 right-6 bg-violet-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-300 hover:bg-violet-700 transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-violet-300 z-40"
        aria-label="Nueva entrada"
        title="Nueva entrada"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                  className={`rounded-lg px-2 py-1 text-lg ${emoji === em ? 'bg-violet-100' : 'bg-white border'}`}
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
              <button onClick={() => setOpen(false)} className="flex-1 rounded-xl border px-4 py-2 hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={save} className="flex-1 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-700">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
