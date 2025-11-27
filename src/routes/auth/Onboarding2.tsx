import { useNavigate } from 'react-router-dom'
import { useSession } from '../../store/useSession'
import { g } from '../../utils/gender'
import type { GrammaticalGender } from '../../store/useSession'
import violettaIsotipoBlanco from '../../assets/violetta-isotipo-blanco.png'

export default function Onboarding2() {
  const nav = useNavigate()
  const { session } = useSession()

  const gender: GrammaticalGender = session?.grammaticalGender || 'x'

  const next = () => nav('/auth/onboarding/3')
  const back = () => nav('/auth/onboarding/1')
  const skip = () => nav('/auth/onboarding/3')

  return (
    <main className="min-h-dvh vio-bg">
      <div className="mx-auto max-w-md px-5 py-6 sm:py-10">

        {/* Back + step */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={back}
            className="text-purple-700 hover:underline text-sm"
          >
            ← Atrás
          </button>
          <span className="text-sm text-purple-600">2 / 3</span>
        </div>

        {/* Icono con isotipo */}
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pink-300 to-purple-300 shadow">
          <img
            src={violettaIsotipoBlanco}
            alt="Violetta"
            className="w-12 select-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
          />
        </div>

        {/* Título */}
        <h1 className="text-center text-3xl font-semibold text-purple-900">
          Tu privacidad es lo más importante
        </h1>

        {/* Subtítulo con género correcto */}
        <p className="mt-3 text-center text-purple-700">
  {`Queremos que te sientas ${g('tranquil', gender)} y ${g('acompañad', gender)}.`}{' '}
  {'Por eso cuidamos tu información con claridad y honestidad.'}
</p>

        {/* Bullets claros y directos */}
        <section className="card mt-6 p-5 space-y-3 text-purple-900">
          <p>• Nadie verá tus conversaciones.</p>
          <p>• Tus datos se usan solo para crear reportes generales.</p>
          <p>• Es anónimo: no sabemos quién eres ni podemos identificarte.</p>
        </section>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={skip}
            className="flex-1 rounded-2xl border border-purple-200 bg-white px-4 py-3 text-purple-800 hover:bg-purple-50 transition"
          >
            Omitir
          </button>

          <button
            onClick={next}
            className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 px-4 py-3 font-semibold text-white"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </main>
  )
}
