import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useSession } from '../../store/useSession'

function DividerDot() {
  return (
    <div className="relative my-6">
      <div className="h-px w-full bg-purple-100" />
      <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400" />
    </div>
  )
}

export default function LoginEmail() {
  const nav = useNavigate()
  const emailRef = useRef<HTMLInputElement | null>(null)
  const { setPendingEmail, setPendingMethod } = useSession()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const email = (emailRef.current?.value || '').trim().toLowerCase()
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!ok) { setError('Ingresa un correo válido'); emailRef.current?.focus(); return }

    setBusy(true)
    try { setPendingEmail(email); setPendingMethod('email') } catch {}
    try {
      localStorage.setItem('violetta-pending-email', email)
      localStorage.setItem('violetta-pending-method', 'email')
    } catch {}
    setTimeout(() => { setBusy(false); nav('/auth/login-code', { replace: true }) }, 250)
  }

  return (
    <main className="min-h-dvh vio-bg">
      <div className="mx-auto max-w-md px-5 py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => nav(-1)} className="text-purple-700 hover:underline text-sm">← Volver</button>
          <button type="button" className="grid h-8 w-8 place-items-center rounded-full border border-purple-200 text-purple-600" title="Privacidad">i</button>
        </div>

        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pink-300 to-purple-300 text-3xl text-white shadow">
          <span className="select-none">♡</span>
        </div>

        <h1 className="text-center text-3xl font-semibold text-purple-900">Bienvenida de nuevo</h1>
        <p className="mt-3 text-center text-purple-700">Elige cómo quieres entrar</p>

        {/* Correo */}
        <form onSubmit={submit} className="card mt-6 p-5">
          <p className="text-sm font-medium text-purple-800">Continuar con correo</p>
          <div className="mt-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">✉️</span>
              <input ref={emailRef} type="email" inputMode="email" placeholder="tu@correo.com"
                className="w-full rounded-2xl border border-purple-100 bg-purple-50 px-10 py-3 text-purple-800 placeholder-purple-300 outline-none focus:border-purple-300" autoFocus />
            </div>
            {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
          </div>
          <button type="submit" disabled={busy}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 px-4 py-3 font-semibold text-white hover:opacity-95 disabled:opacity-60">
            {busy ? 'Enviando…' : 'Enviar código →'}
          </button>
        </form>

        <DividerDot />

        {/* Botones alternos → Teléfono */}
        <div className="space-y-3">
          <button type="button" onClick={() => nav('/auth/login-phone?m=sms')}
            className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-purple-800 shadow-sm hover:bg-purple-50 transition">
            📱 Recibir código por SMS
          </button>
          <button type="button" onClick={() => nav('/auth/login-phone?m=whatsapp')}
            className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-purple-800 shadow-sm hover:bg-purple-50 transition">
            💬 Recibir código por WhatsApp
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-purple-800">
          ¿Primera vez? <Link to="/auth/register" className="underline">Crear mi espacio</Link>
        </p>
      </div>
    </main>
  )
}
