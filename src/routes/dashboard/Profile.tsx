import { useState } from 'react'
import { useSession, type BuiltInPronouns, type GrammaticalGender } from '../../store/useSession'
import PronounPicker from '../../components/PronounPicker'
import { renderPronouns } from '../../utils/gender'

export default function Profile() {
  const { session, setPronounsAndGender } = useSession()

  // Fallbacks seguros
  const name = session?.userName || 'Usuario'
  const currentPronouns = session?.pronouns || { type: 'elle' as BuiltInPronouns }
  const currentGender: GrammaticalGender = session?.grammaticalGender || 'x'

  // Estado local para edición
  const [p, setP] = useState<{ type: BuiltInPronouns; custom?: { display?: string } }>(currentPronouns)
  const [g, setG] = useState<GrammaticalGender>(currentGender)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState<null | 'ok' | 'err'>(null)

  const pronounsText = renderPronouns(currentPronouns.type, currentPronouns.custom)

  const save = async () => {
    try {
      setBusy(true)
      setSaved(null)
      // Persistimos en la sesión (zustand persist hará el resto)
      setPronounsAndGender({ pronouns: p, grammaticalGender: g })
      // Simulamos latencia mínima para feedback
      await new Promise(res => setTimeout(res, 250))
      setSaved('ok')
    } catch {
      setSaved('err')
    } finally {
      setBusy(false)
      setTimeout(() => setSaved(null), 2000)
    }
  }

  return (
    <main className="space-y-6 pb-24">
      {/* Header de perfil */}
      <section className="card p-5">
        <h1 className="text-xl font-bold text-purple-900">Perfil</h1>
        <div className="mt-3 flex items-center gap-2">
          <div className="text-gray-900 font-semibold">{name}</div>
          {pronounsText && (
            <span className="px-2 py-0.5 rounded-full text-xs border border-purple-200 text-purple-700 bg-purple-50">
              {pronounsText}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Ajusta cómo quieres que nos refiramos a ti y cómo se escriben los textos con género en la app.
        </p>
      </section>

      {/* Editor de pronombres y género */}
      <section className="card p-5 space-y-4">
        <h2 className="text-lg font-semibold text-purple-900">Pronombres y lenguaje</h2>

        <PronounPicker
          value={p}
          gender={g}
          onChange={({ pronouns, gender }) => {
            setP(pronouns)
            setG(gender)
          }}
        />

        {saved === 'ok' && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-2xl px-3 py-2">
            Cambios guardados.
          </div>
        )}
        {saved === 'err' && (
          <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl px-3 py-2">
            No pudimos guardar. Inténtalo de nuevo.
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={busy}
            className="rounded-2xl bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 px-4 py-3 font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            {busy ? 'Guardando…' : 'Guardar cambios'}
          </button>
          <button
            onClick={() => { setP(currentPronouns); setG(currentGender); setSaved(null) }}
            disabled={busy}
            className="rounded-2xl border border-purple-200 bg-white px-4 py-3 text-purple-800 hover:bg-purple-50 transition"
          >
            Deshacer
          </button>
        </div>
      </section>

      {/* Otros ajustes del perfil */}
      <section className="card p-5">
        <h3 className="text-base font-semibold text-purple-900">Más opciones</h3>
        <ul className="mt-2 text-sm text-gray-700 list-disc list-inside space-y-1">
          <li>Editar información básica (próximamente).</li>
          <li>Preferencias de notificaciones (próximamente).</li>
        </ul>
      </section>
    </main>
  )
}
