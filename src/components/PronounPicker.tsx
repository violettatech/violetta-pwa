import { useId, useState } from 'react'
import type {
  BuiltInPronouns,
  CustomPronouns,
  GrammaticalGender,
} from '../store/useSession'

type Props = {
  value?: { type: BuiltInPronouns; custom?: CustomPronouns }
  gender?: GrammaticalGender
  onChange?: (next: {
    pronouns: { type: BuiltInPronouns; custom?: CustomPronouns }
    gender: GrammaticalGender
  }) => void
  disabled?: boolean
}

function defaultGenderFor(type: BuiltInPronouns): GrammaticalGender {
  if (type === 'ella') return 'f'
  if (type === 'él') return 'm'
  return 'x' // elle u otro => neutro por defecto
}

export default function PronounPicker({
  value,
  gender,
  onChange,
  disabled,
}: Props) {
  const radioName = useId()
  const [type, setType] = useState<BuiltInPronouns>(value?.type || 'elle')
  const [display, setDisplay] = useState<string>(value?.custom?.display || '')
  const [g, setG] = useState<GrammaticalGender>(gender || defaultGenderFor(type))

  const commit = (
    t: BuiltInPronouns = type,
    d: string = display,
    gg: GrammaticalGender = g
  ) => {
    onChange?.({
      pronouns: { type: t, custom: t === 'otro' ? { display: d } : undefined },
      gender: gg,
    })
  }

  const changeType = (t: BuiltInPronouns) => {
    setType(t)
    const gg = defaultGenderFor(t)
    setG(gg)
    commit(t, display, gg)
  }

  const changeDisplay = (d: string) => {
    setDisplay(d)
    commit(type, d, g)
  }

  const changeGender = (gg: GrammaticalGender) => {
    setG(gg)
    commit(type, display, gg)
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-purple-800">Pronombres</label>

      <div className="grid grid-cols-2 gap-2">
        {(['ella', 'él', 'elle', 'otro'] as BuiltInPronouns[]).map((opt) => (
          <label
            key={opt}
            className={`rounded-2xl border px-3 py-2 text-sm cursor-pointer transition
              ${
                type === opt
                  ? 'border-fuchsia-400 bg-fuchsia-50'
                  : 'border-purple-200 bg-white hover:bg-purple-50'
              }`}
          >
            <input
              type="radio"
              name={radioName}
              className="sr-only"
              checked={type === opt}
              onChange={() => changeType(opt)}
              disabled={disabled}
            />
            {opt}
          </label>
        ))}
      </div>

      {type === 'otro' && (
        <div>
          <input
            value={display}
            onChange={(e) => changeDisplay(e.target.value)}
            placeholder="Escribe cómo se mostrará (p. ej. elle/ellas)"
            className="mt-1 w-full rounded-2xl border border-purple-100 bg-purple-50 px-4 py-2 text-purple-800 placeholder-purple-300 outline-none focus:border-purple-300"
            disabled={disabled}
          />
          <p className="mt-1 text-xs text-purple-700">
            Se mostrará junto a tu nombre.
          </p>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-purple-800">
          Género gramatical para el lenguaje
        </label>
        <div className="mt-2 flex gap-2">
          {(['f', 'm', 'x'] as GrammaticalGender[]).map((gg) => (
            <button
              key={gg}
              type="button"
              disabled={disabled}
              onClick={() => changeGender(gg)}
              className={`rounded-2xl border px-3 py-2 text-sm
                ${
                  g === gg
                    ? 'border-fuchsia-400 bg-fuchsia-50'
                    : 'border-purple-200 bg-white hover:bg-purple-50'
                }`}
            >
              {gg === 'f' ? 'Femenino (a)' : gg === 'm' ? 'Masculino (o)' : 'Neutro (e)'}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-purple-700">
          Ajusta palabras como “bienvenida/o/e”.
        </p>
      </div>
    </div>
  )
}
