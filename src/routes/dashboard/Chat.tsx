import { useEffect, useMemo, useRef, useState } from 'react'

type Role = 'user' | 'assistant'
type Msg = {
  id: string
  role: Role
  text: string
  ts: number
}

type Store = { v: number; items: Msg[] }

const LS_KEY = 'violetta-chat'
const STORE_VERSION = 1

// Guardado resiliente
function safeSave(key: string, items: Msg[]) {
  const payload: Store = { v: STORE_VERSION, items }
  try {
    localStorage.setItem(key, JSON.stringify(payload))
  } catch {
    if (items.length > 1) {
      const trimmed = items.slice(-Math.max(1, Math.floor(items.length * 0.9)))
      try {
        localStorage.setItem(key, JSON.stringify({ v: STORE_VERSION, items: trimmed }))
      } catch {
        localStorage.setItem(key, JSON.stringify({ v: STORE_VERSION, items: trimmed.slice(-1) }))
      }
    }
  }
}

function timefmt(ts: number) {
  try {
    const d = new Date(ts)
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

// Conversación de demo mejorada
function seed(): Msg[] {
  const now = Date.now();
  return [
    {
      id: 'm1',
      role: 'assistant',
      ts: now - 50000,
      text: 'Hola 👋 ¿Cómo te sientes hoy?',
    },
    {
      id: 'm2',
      role: 'user',
      ts: now - 40000,
      text: 'Hola Violetta... hoy me siento un poco confundida y triste.'
    },
    {
      id: 'm3',
      role: 'assistant',
      ts: now - 35000,
      text: 'Te escucho. Lamento que te sientas así, es completamente válido. ¿Hay algo en particular que te gustaría compartir sobre esa confusión?'
    },
    {
      id: 'm4',
      role: 'user',
      ts: now - 20000,
      text: 'Es sobre mi relación. Siento que doy mucho y no recibo lo mismo, y ya no sé qué hacer.'
    },
    {
      id: 'm5',
      role: 'assistant',
      ts: now - 10000,
      text: 'Entiendo esa sensación de desequilibrio. Es muy agotador.\n\nRecuerda que tus sentimientos son importantes. ¿Qué te gustaría hacer ahora? Podemos explorarlo juntas.'
    }
  ]
}

export default function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const listRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Cargar historial
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Store> | Msg[]
        const items: Msg[] = Array.isArray(parsed) ? (parsed as Msg[]) : parsed?.items ?? []
        setMsgs(items.length ? items : seed())
      } else {
        setMsgs(seed())
      }
    } catch {
      setMsgs(seed())
    }
  }, [])

  // Guardar al cambiar msgs (con correcciones de ESLint)
  useEffect(() => {
    const save = () => safeSave(LS_KEY, msgs)
    // @ts-expect-error - requestIdleCallback no es estándar en todas las props de window
    const idle = window.requestIdleCallback as undefined | ((cb: () => void) => number)
    if (idle) {
      const id = idle(save)
      return () => {
        // @ts-expect-error - cancelIdleCallback no es estándar
        const cancel = window.cancelIdleCallback as undefined | ((id: number) => void)
        if (cancel) {
          cancel(id);
        }
      }
    } else {
      const t = setTimeout(save, 0)
      return () => clearTimeout(t)
    }
  }, [msgs])


  // --- CAMBIO: LÓGICA DE AUTO-SCROLL CORREGIDA ---
  useEffect(() => {
    const el = listRef.current;
    if (el) {
      // Usamos un setTimeout(0) para asegurar que esta lógica
      // se ejecute DESPUÉS de que el DOM se haya pintado.
      const timerId = setTimeout(() => {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth'
        });
      }, 0); // 0ms es suficiente para moverlo al final de la cola de tareas.

      return () => clearTimeout(timerId); // Limpiamos el timeout
    }
  }, [msgs, typing]); // Las dependencias [msgs, typing] son correctas
  // --- FIN DEL CAMBIO ---


  const canSend = useMemo(() => input.trim().length > 0 && !typing, [input, typing])

  function clearChat() {
    if (!confirm('¿Borrar la conversación?')) return
    const items = seed()
    setMsgs(items)
    inputRef.current?.focus()
  }

  function pushUser(text: string) {
    const m: Msg = { id: `u-${Date.now()}`, role: 'user', text, ts: Date.now() }
    setMsgs(prev => [...prev, m])
  }

  function pushAssistant(text: string) {
    const m: Msg = { id: `a-${Date.now()}`, role: 'assistant', text, ts: Date.now() }
    setMsgs(prev => [...prev, m])
  }

  async function handleSend() {
    const content = input.trim()
    if (!content || typing) return
    setInput('')
    pushUser(content)

    // “escribiendo…”
    setTyping(true)
    await new Promise(r => setTimeout(r, 700 + Math.random() * 600))

    // Respuesta genérica
    const reply =
      'Respuesta genérica 🤖\n\nEn una versión cercana, Violetta IA responderá de forma personalizada. ' +
      'Por ahora, gracias por compartir. ¿Quieres escribirlo en tu diario o probar una técnica de calma?'
    pushAssistant(reply)
    setTyping(false)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey || !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    }
  }

  return (
    <div className="min-h-dvh bg-violet-50 flex flex-col relative">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-gray-100 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="text-violet-600">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-gray-800">Violetta</h1>
            <p className="text-xs text-green-500 font-medium">Siempre aquí para ti</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="text-gray-500 hover:text-violet-600 p-2 rounded-full hover:bg-gray-100"
            title="Borrar conversación"
            aria-label="Borrar conversación"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
              <path d="M10 11v6"></path><path d="M14 11v6"></path>
              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </header>

      {/* Lista de mensajes (con 'pb-24') */}
      <main
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 chat-container pb-24"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {msgs.map(m => (
          <div key={m.id} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            
            <div
              className={`max-w-[75%] p-3 shadow-sm text-sm break-words flex flex-col ${
                m.role === 'assistant'
                  ? 'bg-white text-gray-700 rounded-2xl rounded-bl-lg' // Burbuja de Violetta
                  : 'bg-violet-600 text-white rounded-2xl rounded-br-lg' // Burbuja de Usuario
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              <div className={`mt-1 text-[10px] self-end ${m.role === 'assistant' ? 'text-gray-400' : 'text-violet-200'}`}>
                {timefmt(m.ts)}
              </div>
            </div>
            
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-lg text-gray-500 max-w-[75%] p-3 shadow-sm text-sm">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse [animation-delay:120ms]" />
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse [animation-delay:240ms]" />
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Input fijo (con 'pb-4') */}
      <div className="fixed bottom-24 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] px-4 pt-3 pb-4">
        <div className="relative max-w-md mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribe tu mensaje…"
            className="w-full bg-gray-100 rounded-full py-3 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            autoComplete="off"
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition
              ${canSend ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-gray-300 text-white cursor-not-allowed'}`}
            aria-label="Enviar"
            title="Enviar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <p className="mt-2 text-[11px] text-gray-400 text-center">
          Enter para enviar • Ctrl/⌘+Enter también
        </p>
      </div>
    </div>
  )
}