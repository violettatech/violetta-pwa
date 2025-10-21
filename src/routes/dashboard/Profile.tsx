import { useState } from 'react'
import { useSession } from '../../store/useSession'

export default function Profile() {
  const { session, setSession, clear } = useSession()
  const [name, setName] = useState(session?.userName || '')
  const [email, setEmail] = useState(session?.userEmail || '')

  const save = () => {
    if (!session) return
    setSession({
      ...session,
      userName: name.trim() || session.userName,
      userEmail: email.trim() || undefined,
    })
    alert('Perfil actualizado ✅')
  }

  return (
    <div className="pb-24 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Mi Perfil</h2>

      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm space-y-3">
        <label className="text-sm text-gray-700">Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Tu nombre"
        />

        <label className="mt-3 text-sm text-gray-700">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border px-3 py-2"
          placeholder="tu@correo.com"
        />

        <button onClick={save} className="mt-4 w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white">
          Guardar
        </button>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <button
          onClick={() => { clear(); location.href = '/auth/welcome' }}
          className="w-full rounded-xl border px-4 py-3 text-rose-600 hover:bg-rose-50"
        >
          Cerrar sesión
        </button>
      </section>
    </div>
  )
}
