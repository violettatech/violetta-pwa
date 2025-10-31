import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useSession } from '../../store/useSession'
import PronounPicker from '../../components/PronounPicker'
import type { BuiltInPronouns, GrammaticalGender } from '../../store/useSession'

type Provider = 'google' | 'apple' | 'microsoft'

const REQUIRE_CODE_AFTER_OAUTH = false

export default function Register() {
  const nav = useNavigate()
  const { setSession, setPendingEmail, setPendingPhone, setPendingMethod } = useSession()

  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  const [busyForm, setBusyForm] = useState(false)
  const [busyProvider, setBusyProvider] = useState<Provider | null>(null)
  const [error, setError] = useState<string | null>(null)

  // NUEVO: estado local para pronombres y género
  const [pronouns, setPronouns] = useState<{ type: BuiltInPronouns; custom?: { display?: string } }>({ type: 'elle' })
  const [gender, setGender] = useState<GrammaticalGender>('x')

  // --- Crear cuenta con formulario (passwordless por email) ---
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const name = (nameRef.current?.value || '').trim()
    const email = (emailRef.current?.value || '').trim().toLowerCase()

    if (!name) {
      setError('Por favor escribe tu nombre.')
      nameRef.current?.focus()
      return
    }
    if (!email) {
      setError('Necesitamos tu correo para enviarte un código de verificación.')
      emailRef.current?.focus()
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('El correo debe ser válido.')
      emailRef.current?.focus()
      return
    }

    setBusyForm(true)

    // Simula “enviar código” por email y prepara LoginCode
    setTimeout(() => {
      try {
        localStorage.setItem('violetta-pending-email', email)
        localStorage.setItem('violetta-pending-method', 'email')
        localStorage.setItem('violetta-pending-name', name)
        localStorage.setItem('violetta-just-registered', '1')
        // NUEVO: guardar pronombres y género
        localStorage.setItem('violetta-pending-pronouns', JSON.stringify(pronouns))
        localStorage.setItem('violetta-pending-gender', gender)
      } catch { /* ignore storage errors in demo */ }

      try {
        setPendingEmail(email)
        setPendingPhone(undefined)
        setPendingMethod('email')
      } catch { /* ignore */ }

      alert(`Te enviamos un código a ${email}. Revísalo para continuar.`)
      setBusyForm(false)
      nav('/auth/login-code', { replace: true })
    }, 350)
  }

  // --- Crear cuenta con proveedor (OAuth simulado) ---
  const signWith = (p: Provider) => {
    setBusyProvider(p)
    setError(null)

    setTimeout(() => {
      const fake = {
        google:    { email: 'tu.nombre@gmail.com', name: 'Tú (Google)' },
        apple:     { email: 'privado@privaterelay.appleid.com', name: 'Tú (Apple)' },
        microsoft: { email: 'tu.nombre@outlook.com', name: 'Tú (Microsoft)' },
      }[p]

      if (REQUIRE_CODE_AFTER_OAUTH) {
        try {
          localStorage.setItem('violetta-pending-email', fake.email)
          localStorage.setItem('violetta-pending-method', 'email')
          localStorage.setItem('violetta-pending-name', fake.name)
          localStorage.setItem('violetta-just-registered', '1')
          // NUEVO
          localStorage.setItem('violetta-pending-pronouns', JSON.stringify(pronouns))
          localStorage.setItem('violetta-pending-gender', gender)
        } catch { /* ignore */ }

        try {
          setPendingEmail(fake.email)
          setPendingPhone(undefined)
          setPendingMethod('email')
        } catch { /* ignore */ }

        alert(`Te enviamos un código a ${fake.email}. Revísalo para continuar.`)
        setBusyProvider(null)
        nav('/auth/login-code', { replace: true })
        return
      }

      // Sin verificación extra (práctica común)
      try {
        setSession({
          userName: fake.name,
          userEmail: fake.email,
          hasCompletedOnboarding: false,
          createdAt: new Date().toISOString(),
          // NUEVO
          pronouns,
          grammaticalGender: gender,
        })
      } catch { /* ignore */ }

      setBusyProvider(null)
      nav('/auth/onboarding/1', { replace: true })
    }, 500)
  }

  return (
    <main className="min-h-dvh vio-bg">
      <div className="mx-auto max-w-md px-5 py-6 sm:py-10">
        {/* Top bar */}
        <div className="mb-6">
          <button
            onClick={() => nav(-1)}
            className="text-purple-700 hover:underline text-sm"
          >
            ← Volver
          </button>
        </div>

        {/* Icono */}
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pink-300 to-purple-300 text-3xl text-white shadow">
          <span className="select-none">♡</span>
        </div>

        {/* Título + copy */}
        <h1 className="text-center text-3xl font-semibold text-purple-900">
          Crear mi espacio
        </h1>
        <p className="mt-3 text-center text-purple-700">
          Este será tu espacio, hecho para acompañarte
        </p>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="card mt-6 p-5">
          <label className="text-sm font-medium text-purple-800">Tu nombre</label>
          <input
            ref={nameRef}
            placeholder="¿Cómo te gustaría que te llamemos?"
            className="mt-2 w-full rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-purple-800 placeholder-purple-300 outline-none focus:border-purple-300"
            autoFocus
          />

          <label className="mt-4 text-sm font-medium text-purple-800">
            Tu correo
          </label>
          <input
            ref={emailRef}
            type="email"
            inputMode="email"
            placeholder="tu@correo.com"
            className="mt-2 w-full rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-purple-800 placeholder-purple-300 outline-none focus:border-purple-300"
          />

          {/* NUEVO: picker de pronombres */}
          <div className="mt-4">
            <PronounPicker
              value={pronouns}
              gender={gender}
              onChange={({ pronouns: p, gender: ggen }) => {
                setPronouns(p)
                setGender(ggen)
              }}
            />
          </div>

          <p className="mt-3 rounded-2xl bg-purple-50 px-3 py-2 text-xs text-purple-700">
            🔒 Tus datos se mantendrán seguros. Solo Violetta los verá.
          </p>

          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={busyForm}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 px-4 py-3 font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            {busyForm ? 'Enviando código…' : 'Crear y verificar →'}
          </button>
        </form>

        {/* Divisor con punto */}
        <div className="relative my-6">
          <div className="h-px w-full bg-purple-100" />
          <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400" />
        </div>

        {/* Proveedores */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => signWith('google')}
            disabled={busyProvider !== null}
            className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-purple-800 shadow-sm hover:bg-purple-50 transition"
            title="Crear con Google"
          >
            {busyProvider === 'google' ? 'Conectando con Google…' : 'Continuar con Google'}
          </button>

          <button
            type="button"
            onClick={() => signWith('apple')}
            disabled={busyProvider !== null}
            className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-purple-800 shadow-sm hover:bg-purple-50 transition"
            title="Crear con Apple"
          >
            {busyProvider === 'apple' ? 'Conectando con Apple…' : 'Continuar con Apple'}
          </button>

          <button
            type="button"
            onClick={() => signWith('microsoft')}
            disabled={busyProvider !== null}
            className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-purple-800 shadow-sm hover:bg-purple-50 transition"
            title="Crear con Microsoft"
          >
            {busyProvider === 'microsoft' ? 'Conectando con Microsoft…' : 'Continuar con Microsoft'}
          </button>
        </div>
      </div>
    </main>
  )
}
