import { useNavigate } from 'react-router-dom'

export default function Home() {
  const nav = useNavigate()
  const to = (p: string) => nav(p)

  const Card = ({
    onClick,
    bg,
    iconCircleBg,
    icon,
    body,
    cta,
  }: {
    onClick: () => void
    bg: string
    iconCircleBg: string
    icon: React.ReactNode
    body: React.ReactNode
    cta: string
  }) => (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl ${bg} p-4 flex items-center gap-4 text-left transition hover:brightness-[0.98]`}
    >
      <div className={`${iconCircleBg} p-3 rounded-full grid place-items-center`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-gray-700 font-medium text-sm">{body}</p>
        <p className="mt-1 text-xs font-bold text-current uppercase">{cta}</p>
      </div>
    </button>
  )

  return (
    <div className="pb-24 space-y-8">
      {/* Card principal de estado */}
      <section className="bg-white p-5 rounded-3xl border border-violet-100 shadow-sm text-center">
        <p className="text-lg font-semibold text-gray-800">¿Cómo te sientes hoy?</p>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Registra tu emoción para empezar tu día
        </p>

        <div className="flex justify-center gap-3">
          {['😊', '😢', '😠', '🤔'].map((m) => (
            <button
              key={m}
              onClick={() => to('/dashboard/journal')}
              className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center text-2xl transition-transform hover:scale-110"
              aria-label={`Registrar ${m}`}
              title={`Registrar ${m}`}
            >
              {m}
            </button>
          ))}
          <button
            onClick={() => to('/dashboard/journal')}
            className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl transition-transform hover:scale-110"
            aria-label="Otra emoción"
            title="Otra emoción"
          >
            {/* plus */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </section>

      {/* Descubrimientos para ti */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          Descubrimientos para ti
        </h2>

        <div className="space-y-3">
          {/* Insight del Diario */}
          <Card
            onClick={() => to('/dashboard/chat')}
            bg="bg-violet-50"
            iconCircleBg="bg-violet-200"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-violet-700"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            }
            body={
              <>
                He notado que los días que mencionas{' '}
                <span className="font-semibold">'trabajo'</span>, también
                registras más estrés.
              </>
            }
            cta="EXPLORAR TÉCNICA >"
          />

          {/* Sugerencia de Mi Viaje */}
          <Card
            onClick={() => to('/dashboard/journey')}
            bg="bg-green-50"
            iconCircleBg="bg-green-200"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-700"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            }
            body={
              <>
                Has reflexionado <span className="font-semibold">3 días seguidos</span>. ¡Estás
                construyendo un gran hábito!
              </>
            }
            cta="VER MI VIAJE >"
          />

          {/* Insight de vínculo */}
          <Card
            onClick={() => to('/dashboard/journal')}
            bg="bg-pink-50"
            iconCircleBg="bg-pink-200"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pink-700"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            body={
              <>
                Has mencionado a <span className="font-semibold">'Mamá'</span> en tu diario. ¿Quieres
                reflexionar sobre este vínculo?
              </>
            }
            cta="AÑADIR AL DIARIO >"
          />
        </div>
      </section>
    </div>
  )
}
