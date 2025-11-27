import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSession } from '../store/useSession'

export default function Login() {
  const { session, setSession } = useSession()
  const nav = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) nav('/onboarding', { replace: true })
  }, [session, nav])

  const validateEmail = (value?: string) =>
    !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const email = inputRef.current?.value?.trim()
    if (!validateEmail(email)) {
      setError('Ingresa un correo válido')
      return
    }
    setError(null)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setSession({ email: email! })
    nav('/onboarding', { replace: true })
  }

  function loginWithGoogle() {
    setLoading(true)
    setTimeout(() => {
      setSession({ email: 'demo.google@violetta.app' })
      nav('/onboarding', { replace: true })
    }, 500)
  }

  return (
    <main className="min-h-dvh grid place-items-center bg-gradient-to-b from-fuchsia-50 to-pink-50">
      <div className="w-[92%] max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <header className="mb-4 flex items-center justify-between">
          <Link to="/" className="text-fuchsia-700 font-semibold">Violetta</Link>
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Volver</Link>
        </header>

        <h1 className="text-xl font-semibold">Inicia sesión</h1>
        <p className="mt-1 text-sm text-gray-600">Usa tu correo para continuar. Es una demo local.</p>

        <form className="mt-4 space-y-3" onSubmit={onSubmit} noValidate>
          <label className="block text-sm font-medium text-gray-700">
            Correo
            <input
              ref={inputRef}
              type="email"
              placeholder="tu@correo.com"
              className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-300"
              onChange={() => error && setError(null)}
              required
            />
          </label>
          {error && <p className="text-sm text-rose-600" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-lg bg-fuchsia-600 px-3 py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Cargando…' : 'Continuar'}
          </button>
        </form>

        <div className="my-4 h-px w-full bg-gray-200" />

        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full rounded-lg border px-3 py-2 font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          Ingresar con Google (demo)
        </button>
      </div>
    </main>
  )
}
