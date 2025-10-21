import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSession } from '../../store/useSession'

function prettyMethod(m?: string) {
  return m === 'whatsapp' ? 'WhatsApp' : 'SMS'
}
function isE164(phone: string) {
  return /^\+?[1-9]\d{7,14}$/.test(phone) // validación simple E.164 (8–15 dígitos)
}

export default function LoginPhone() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const initialMethod = (params.get('m') as 'sms' | 'whatsapp') || 'sms'

  const { setPendingPhone, setPendingMethod } = useSession()
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const [method, setMethod] = useState<'sms' | 'whatsapp'>(initialMethod)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // ejemplo: set default country code MX (+52) o internacional (+1)
    if (!phoneRef.current?.value) phoneRef.current!.value = '+52'
  }, [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const phone = (phoneRef.current?.value || '').replace(/\s/g, '')
    if (!isE164(phone)) {
      setError('Ingresa un teléfono con prefijo internacional (ej. +521234567890)')
      phoneRef.current?.focus()
      return
    }

    setBusy(true)
    try {
      setPendingPhone(phone)
      setPendingMethod(method)
      localStorage.setItem('violetta-pending-phone', phone)
      localStorage.setItem('violetta-pending-method', method)
    } catch {}

    // PROTOTIPO: simula “envío” y navega a código
    setTimeout(() => {
      alert(`Te enviamos un código por ${prettyMethod(method)} a ${phone}.`)
      setBusy(false)
      nav('/auth/login-code', { replace: true })
    }, 300)
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

        <h1 className="text-center text-3xl font-semibold text-purple-900">Inicia con tu número</h1>
        <p className="mt-3 text-center text-purple-700">Recibe un código por {prettyMethod(method)}</p>

        <form onSubmit={submit} className="card mt-6 p-5">
          <div className="flex gap-2">
            <button type="button" onClick={() => setMethod('sms')}
              className={`flex-1 rounded-2xl border px-4 py-2 ${method==='sms' ? 'bg-fuchsia-600 text-white border-fuchsia-600' : 'bg-white hover:bg-purple-50'}`}>
              SMS
            </button>
            <button type="button" onClick={() => setMethod('whatsapp')}
              className={`flex-1 rounded-2xl border px-4 py-2 ${method==='whatsapp' ? 'bg-fuchsia-600 text-white border-fuchsia-600' : 'bg-white hover:bg-purple-50'}`}>
              WhatsApp
            </button>
          </div>

          <label className="mt-4 text-sm font-medium text-purple-800">Tu teléfono (E.164)</label>
          <input ref={phoneRef} placeholder="+521234567890"
            className="mt-2 w-full rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-purple-800 placeholder-purple-300 outline-none focus:border-purple-300" />
          {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}

          <button type="submit" disabled={busy}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 px-4 py-3 font-semibold text-white hover:opacity-95 disabled:opacity-60">
            {busy ? 'Enviando…' : 'Enviar código →'}
          </button>
        </form>
      </div>
    </main>
  )
}
