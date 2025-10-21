import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession, type Session } from '../../store/useSession'

function readLS(key: string) {
  try { return localStorage.getItem(key) || '' } catch { return '' }
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

  useEffect(() => {
    const m = (readLS('violetta-pending-method') as 'email' | 'sms' | 'whatsapp') || 'email'
    setMethod(m)
    setEmail(readLS('violetta-pending-email').trim().toLowerCase())
    setPhone(readLS('violetta-pending-phone').trim())
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
    if (clean.length < 4) { setError('Ingresa el código que te enviamos (4+ dígitos)'); inputRef.current?.focus(); return }

    setBusy(true)
    setTimeout(() => {
      const userEmail = method === 'email' ? email : undefined
      const userPhone = method !== 'email' ? phone : undefined
      const userName = userEmail?.split('@')[0] || (userPhone ? `user_${userPhone.slice(-4)}` : 'usuario')

      const sess: NonNullable<Session> = {
        userEmail, userPhone, userName,
        hasCompletedOnboarding: true,
        createdAt: new Date().toISOString(),
      }

      try {
        setSession(sess)
      } catch (_e) { /* ignore setSession errors in demo */ }

      try {
        localStorage.removeItem('violetta-pending-email')
        localStorage.removeItem('violetta-pending-phone')
        localStorage.removeItem('violetta-pending-method')
        setPendingEmail(undefined); setPendingPhone(undefined); setPendingMethod(undefined)
      } catch (_e) { /* ignore storage errors in demo */ }

      setBusy(false)
      nav('/dashboard', { replace: true })
    }, 300)
  }

  return (
    <main className="min-h-dvh vio-bg">
      {/* …(UI igual que tenías)… */}
      {/* Para brevedad, omitido. Mantén tu UI actual y solo deja el handler corregido. */}
      <form onSubmit={submit} className="card mt-6 p-5">
        <label className="text-sm font-medium text-purple-800">Código de verificación</label>
        <input ref={inputRef} inputMode="numeric" placeholder="• • • •" value={code} onChange={(e) => setCode(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-center text-2xl tracking-widest text-purple-800 placeholder-purple-300 outline-none focus:border-purple-300" />
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        <button type="submit" disabled={busy} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 px-4 py-3 font-semibold text-white hover:opacity-95 disabled:opacity-60">
          {busy ? 'Verificando…' : 'Entrar →'}
        </button>
        <button type="button" onClick={resend} className="mt-3 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-purple-800 shadow-sm hover:bg-purple-50 transition">
          Reenviar código
        </button>
      </form>
    </main>
  )
}
