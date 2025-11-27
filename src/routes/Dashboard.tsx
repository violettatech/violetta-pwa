import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../store/useSession'
import BottomNav from '../components/nav/BottomNav'

export default function Dashboard() {
  const { session, clear } = useSession()
  const nav = useNavigate()
  const name = session?.userName || 'María'
  const [menuOpen, setMenuOpen] = useState(false)

  const to = (path: string) => () => nav(path)
  const logout = () => {
    clear()
    nav('/auth/welcome', { replace: true })
  }

  return (
    <main className="min-h-dvh bg-white pb-24">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur">
        <div className="relative mx-auto flex max-w-md items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            Hola, {name} <span className="align-[-2px]">🐣</span>
          </h1>

          {/* Hamburguesa */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-gray-50"
            aria-label="Abrir menú"
            title="Menú"
          >
            <span className="block h-[2px] w-5 rounded bg-gray-800" />
            <span className="mt-1 block h-[2px] w-5 rounded bg-gray-800" />
            <span className="mt-1 block h-[2px] w-5 rounded bg-gray-800" />
          </button>

          {/* Menú flotante */}
          {menuOpen && (
            <>
              <button
                aria-hidden
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-40 bg-black/10"
              />
              <div
                className="absolute right-4 top-14 z-50 w-72 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                role="menu"
                aria-label="Menú principal"
              >
                <MenuItem label="Mi Perfil" onClick={to('/dashboard/profile')} />
                <MenuItem label="Plan de Emergencia" onClick={to('/dashboard/emergency')} />
                <MenuItem label="Respira" onClick={to('/dashboard/breathe')} />
                <div className="my-1 h-px bg-gray-100" />
                <ActionCard
                  title="Línea Violetta"
                  text={
                    <>
                      Si quieres hablar directamente con una psicóloga, puedes llamar en México a la línea Violetta:
                      <br />
                      <span className="font-semibold">+52 55 1204 5773</span>.
                      <br />
                      Esta atención gratuita está disponible en cualquier momento del día gracias a nuestra alianza con Fundación Origen.
                    </>
                  }
                  primary={{
                    label: 'Llamar ahora',
                    href: 'tel:+525512045773',
                  }}
                />
                <ActionLink
                  label="Directorio de Apoyo"
                  href="https://holasoyvioletta.com/ayuda-profesional/"
                />
                <div className="my-2 h-px bg-gray-100" />
                <MenuItem label="Cerrar sesión" danger onClick={logout} />
              </div>
            </>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 pt-2 space-y-6">
        {/* ¿Cómo te sientes hoy? */}
        <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-center text-lg font-bold text-gray-900">¿Cómo te sientes hoy?</p>
          <p className="mt-1 text-center text-sm text-gray-500">Registra tu emoción para empezar tu día</p>

          <div className="mt-4 flex items-center justify-center gap-3">
            {['😊','😥','😠','😕'].map((m) => (
              <button
                key={m}
                onClick={to('/dashboard/journal')}
                className="grid h-12 w-12 place-items-center rounded-full border border-gray-200 bg-white text-xl shadow-sm hover:bg-gray-50"
                aria-label={`Registrar ${m}`}
              >
                {m}
              </button>
            ))}
            <button
              onClick={to('/dashboard/journal')}
              className="grid h-12 w-12 place-items-center rounded-full border border-gray-200 bg-white text-xl shadow-sm hover:bg-gray-50"
              aria-label="Otra emoción"
              title="Otra emoción"
            >
              +
            </button>
          </div>
        </section>

        {/* Descubrimientos (tarjeta clicable completa) */}
        <section>
          <h2 className="px-1 text-lg font-extrabold text-gray-900">Descubrimientos para ti</h2>

          <div className="mt-3 space-y-3">
            <DiscoveryCard
              bg="bg-violet-50"
              icon="📖"
              iconColor="text-violet-600"
              text={
                <>
                  He notado que los días que mencionas <span className="font-semibold">“trabajo”</span>, también registras más estrés.
                </>
              }
              cta="Explorar técnica"
              onClick={to('/dashboard/chat')}
            />

            <DiscoveryCard
              bg="bg-emerald-50"
              icon="⭐"
              iconColor="text-emerald-600"
              text={
                <>
                  Has reflexionado <span className="font-semibold">3 días seguidos</span>. ¡Estás construyendo un gran hábito!
                </>
              }
              cta="Ver mi viaje"
              onClick={to('/dashboard/insights')}
            />

            <DiscoveryCard
              bg="bg-rose-50"
              icon="👥"
              iconColor="text-rose-600"
              text={
                <>
                  Has mencionado a <span className="font-semibold">“Mamá”</span> en tu diario. ¿Quieres reflexionar sobre este vínculo?
                </>
              }
              cta="Añadir al diario"
              onClick={to('/dashboard/journal')}
            />
          </div>
        </section>
      </div>

      {/* Bottom nav + FAB central de chat */}
      <BottomNav />
      <button
        onClick={to('/dashboard/chat')}
        className="fixed bottom-10 left-1/2 z-40 -translate-x-1/2 grid h-14 w-14 place-items-center rounded-full bg-violet-600 text-white shadow-xl"
        aria-label="Abrir chat"
        title="Conversar"
      >
        💬
      </button>
    </main>
  )
}

function MenuItem({
  label,
  onClick,
  danger,
}: {
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`w-full rounded-xl px-3 py-3 text-left transition hover:bg-gray-50 ${
        danger ? 'text-rose-600 font-semibold' : 'text-gray-800'
      }`}
    >
      {label}
    </button>
  )
}

function ActionLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      className="mt-2 block rounded-xl px-3 py-3 text-left text-violet-700 hover:bg-violet-50"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label} →
    </a>
  )
}

function ActionCard({
  title,
  text,
  primary,
}: {
  title: string
  text: React.ReactNode
  primary: { label: string; href: string }
}) {
  return (
    <div className="m-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="mt-1 text-sm text-gray-700">{text}</p>
      <a
        href={primary.href}
        className="mt-2 inline-block rounded-full bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
      >
        {primary.label}
      </a>
    </div>
  )
}

function DiscoveryCard({
  bg,
  icon,
  iconColor,
  text,
  cta,
  onClick,
}: {
  bg: string
  icon: string
  iconColor: string
  text: React.ReactNode
  cta: string
  onClick: () => void
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={`flex cursor-pointer gap-3 rounded-2xl ${bg} p-4 outline-none transition hover:brightness-[.98] focus:ring-2 focus:ring-violet-300`}
    >
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white ${iconColor} shadow-sm`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[15px] text-gray-800">{text}</p>
        <span className="mt-2 inline-block text-[12px] font-extrabold uppercase tracking-wide text-gray-700">
          {cta} &gt;
        </span>
      </div>
    </article>
  )
}
