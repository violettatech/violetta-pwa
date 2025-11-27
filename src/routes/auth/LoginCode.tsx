import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession, type Session, type BuiltInPronouns, type GrammaticalGender } from '../../store/useSession'

function readLS(key: string) {
  try { return localStorage.getItem(key) || '' } catch { return '' }
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}

export default function LoginCode() {
  const nav = useNavigate()
  const { setSession, setPendingEmail, setPendingPhone, setPendingMethod } = useSession()

  const [method, setMethod] = useState<'email' | 'sms' | 'whatsapp'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // NUEVO: nombre y bandera de “vengo de registro”
  const [pendingName, setPendingName] = useState('')
  const [justRegistered, setJustRegistered] = useState(false)

  // NUEVO: pronombres y género pendientes
  const [pendingPronouns, setPendingPronouns] = useState<{ type: BuiltInPronouns; custom?: { display?: string } } | undefined>(undefined)
  const [pendingGender, setPendingGender] = useState<GrammaticalGender>('x')

  useEffect(() => {
    const m = (readLS('violetta-pending-method') as 'email' | 'sms' | 'whatsapp') || 'email'
    setMethod(m)
    setEmail(readLS('violetta-pending-email').trim().toLowerCase())
    setPhone(readLS('violetta-pending-phone').trim())

    setPendingName(readLS('violetta-pending-name').trim())
    setJustRegistered(readLS('violetta-just-registered').trim() === '1')

    setPendingPronouns(readJSON('violetta-pending-pronouns', undefined))
    try {
      const g = (localStorage.getItem('violetta-pending-gender') || 'x') as GrammaticalGender
      setPendingGender(g)
    } catch { /* ignore */ }

    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const recipient = method === 'email' ? (email || 'tu correo') : (phone || 'tu teléfono')

  const resend = () => {
    alert(`Te reenviamos un código por ${method === 'whatsapp' ? 'WhatsApp' : method.toUpperCase()} a ${recipient}.`)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const clean = code.replace(/\s/g, '')
    if (clean.length < 4) {
      setError('Ingresa el código que te enviamos (4+ dígitos)')
      inputRef.current?.focus()
      return
    }

    setBusy(true)
    setTimeout(() => {
      const userEmail = method === 'email' ? email : undefined
      const userPhone = method !== 'email' ? phone : undefined

      // Prioriza el nombre capturado en Register
      const fallbackName =
        userEmail?.split('@')[0] ||
        (userPhone ? `user_${userPhone.slice(-4)}` : 'usuario')
      const userName = pendingName || fallbackName

      const sess: NonNullable<Session> = {
        userEmail,
        userPhone,
        userName,
        hasCompletedOnboarding: justRegistered ? false : true,
        createdAt: new Date().toISOString(),
        // NUEVO: persistimos pronombres y género en la sesión
        pronouns: pendingPronouns
          ? { type: pendingPronouns.type, custom: pendingPronouns.custom }
          : undefined,
        grammaticalGender: pendingGender || 'x',
      }

      try {
        setSession(sess)
      } catch { /* ignore setSession errors in demo */ }

      // Limpiar pending
      try {
        localStorage.removeItem('violetta-pending-email')
        localStorage.removeItem('violetta-pending-phone')
        localStorage.removeItem('violetta-pending-method')
        localStorage.removeItem('violetta-pending-name')
        localStorage.removeItem('violetta-just-registered')
        localStorage.removeItem('violetta-pending-pronouns')
        localStorage.removeItem('violetta-pending-gender')
        setPendingEmail(undefined); setPendingPhone(undefined); setPendingMethod(undefined)
      } catch { /* ignore storage errors in demo */ }

      setBusy(false)
      nav(justRegistered ? '/auth/onboarding/1' : '/dashboard', { replace: true })
    }, 300)
  }

  return (
    <main className="min-h-dvh vio-bg">
      <div className="mx-auto max-w-md px-5 py-6 sm:py-10">
        <div className="mb-6">
          <button onClick={() => nav(-1)} className="text-purple-700 hover:underline text-sm">← Volver</button>
        </div>

        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pink-300 to-purple-300 text-3xl text-white shadow">
          <span className="select-none">♡</span>
        </div>

        <h1 className="text-center text-3xl font-semibold text-purple-900">
          Verifica tu cuenta
        </h1>
        <p className="mt-3 text-center text-purple-700">
          Te enviamos un código a {recipient}. Escríbelo para continuar.
        </p>

        <form onSubmit={submit} className="card mt-6 p-5">
          <label className="text-sm font-medium text-purple-800">Código de verificación</label>
          <input
            ref={inputRef}
            inputMode="numeric"
            placeholder="• • • •"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-center text-2xl tracking-widest text-purple-800 placeholder-purple-300 outline-none focus:border-purple-300"
          />
          {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 px-4 py-3 font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            {busy ? 'Verificando…' : 'Entrar →'}
          </button>

          <button
            type="button"
            onClick={resend}
            className="mt-3 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-purple-800 shadow-sm hover:bg-purple-50 transition"
          >
            Reenviar código
          </button>
        </form>
      </div>
    </main>
  )
}
