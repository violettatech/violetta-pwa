import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../store/useSession';
import { useGoals } from '../../store/useGoals';
import {
  Smile,
  Frown,
  Meh,
  Annoyed,
  Plus,
  BookOpen,
  MessageSquare,
  Target,
  Star,
  Users,
  Filter
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Tipos auxiliares
type Discovery = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  kind: 'chat' | 'journal' | 'tech' | 'streak' | 'article';
  tone: 'emerald' | 'rose' | 'indigo' | 'amber' | 'cyan';
  title: string;
  text: string;
  cta: string;
  onClick: () => void;
};

// Paletas por “tone”
const toneMap: Record<
  Discovery['tone'],
  { card: string; iconWrap: string; text: string; border: string; cta: string }
> = {
  emerald: {
    card: 'bg-emerald-50/60 border-emerald-100',
    iconWrap: 'bg-emerald-100 text-emerald-700',
    text: 'text-emerald-900',
    border: 'before:bg-emerald-300',
    cta: 'text-emerald-700'
  },
  rose: {
    card: 'bg-rose-50/60 border-rose-100',
    iconWrap: 'bg-rose-100 text-rose-700',
    text: 'text-rose-900',
    border: 'before:bg-rose-300',
    cta: 'text-rose-700'
  },
  indigo: {
    card: 'bg-indigo-50/60 border-indigo-100',
    iconWrap: 'bg-indigo-100 text-indigo-700',
    text: 'text-indigo-900',
    border: 'before:bg-indigo-300',
    cta: 'text-indigo-700'
  },
  amber: {
    card: 'bg-amber-50/60 border-amber-100',
    iconWrap: 'bg-amber-100 text-amber-800',
    text: 'text-amber-900',
    border: 'before:bg-amber-300',
    cta: 'text-amber-700'
  },
  cyan: {
    card: 'bg-cyan-50/60 border-cyan-100',
    iconWrap: 'bg-cyan-100 text-cyan-700',
    text: 'text-cyan-900',
    border: 'before:bg-cyan-300',
    cta: 'text-cyan-700'
  }
};

// Chip reutilizable
function Chip({
  active,
  children,
  onClick
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-3 py-1.5 rounded-full text-xs font-medium border transition',
        active
          ? 'bg-violet-600 text-white border-violet-600'
          : 'bg-white/80 text-gray-700 border-gray-200 hover:border-violet-300 hover:text-violet-700'
      ].join(' ')}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Sección Descubrimientos (rediseñada)
function DiscoveriesSection({ name }: { name: string }) {
  const nav = useNavigate();

  const source: Discovery[] = useMemo(
    () => [
      {
        icon: BookOpen,
        kind: 'article',
        tone: 'emerald',
        title: 'Artículo sugerido',
        text: 'Cómo establecer límites sanos en tus relaciones.',
        cta: 'Leer artículo >',
        onClick: () => window.open('#', '_blank', 'noreferrer')
      },
      {
        icon: MessageSquare,
        kind: 'chat',
        tone: 'cyan',
        title: '¿Necesitas hablar?',
        text: `${name}, registraste sentirte abrumado hoy. ¿Quieres contarlo conmigo?`,
        cta: 'Continuar chat >',
        onClick: () => nav('/dashboard/chat')
      },
      {
        icon: Star,
        kind: 'streak',
        tone: 'amber',
        title: 'Buen ritmo',
        text: 'Has reflexionado 3 días seguidos. ¡Estás construyendo un gran hábito!',
        cta: 'Ver mi viaje >',
        onClick: () => nav('/dashboard/journey')
      },
      {
        icon: Users,
        kind: 'journal',
        tone: 'rose',
        title: 'Vínculo familiar',
        text: 'Mencionaste a “Mamá” en tu diario. ¿Quieres profundizar en este tema?',
        cta: 'Añadir al diario >',
        onClick: () => nav('/dashboard/journal')
      },
      {
        icon: BookOpen,
        kind: 'tech',
        tone: 'indigo',
        title: 'Patrón detectado',
        text: `${name}, los días que mencionas “trabajo” también reportas más estrés.`,
        cta: 'Explorar técnica >',
        onClick: () => nav('/dashboard/exercises')
      }
    ],
    [nav, name]
  );

  const [filter, setFilter] = useState<'all' | Discovery['kind']>('all');
  const [expanded, setExpanded] = useState(false);

  const filtered = source.filter(d => (filter === 'all' ? true : d.kind === filter));
  const visible = expanded ? filtered : filtered.slice(0, 3);

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-800">Descubrimientos para ti</h2>
        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
          <Filter size={14} /> Contenido según tu registro
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
          Todos
        </Chip>
        <Chip active={filter === 'chat'} onClick={() => setFilter('chat')}>
          Chat
        </Chip>
        <Chip active={filter === 'journal'} onClick={() => setFilter('journal')}>
          Diario
        </Chip>
        <Chip active={filter === 'tech'} onClick={() => setFilter('tech')}>
          Técnicas
        </Chip>
        <Chip active={filter === 'streak'} onClick={() => setFilter('streak')}>
          Hábito
        </Chip>
        <Chip active={filter === 'article'} onClick={() => setFilter('article')}>
          Artículos
        </Chip>
      </div>

      <div className="grid gap-3">
        {visible.map((d, i) => {
          const tone = toneMap[d.tone];
          const Icon = d.icon;
          return (
            <article
              key={i}
              className={[
                'relative overflow-hidden rounded-2xl border p-4 shadow-sm transition hover:shadow-md',
                tone.card,
                'before:absolute before:left-0 before:top-0 before:h-full before:w-1',
                tone.border
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <div className={['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', tone.iconWrap].join(' ')}>
                  <Icon size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-800">{d.title}</h3>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/60 text-gray-700 border border-white/70">
                      NEW
                    </span>
                  </div>
                  <p className={`mt-1 text-sm leading-relaxed ${tone.text}`}>{d.text}</p>

                  <button
                    onClick={d.onClick}
                    className={['mt-2 text-sm font-semibold inline-flex items-center gap-1 hover:underline', tone.cta].join(' ')}
                  >
                    {d.cta}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length > 3 && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-full text-center text-sm font-semibold text-violet-700 hover:underline"
          >
            {expanded ? 'Ver menos' : 'Ver más descubrimientos >'}
          </button>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Página Home
export default function Home() {
  const nav = useNavigate();
  const { session } = useSession();
  const { goals } = useGoals();
  const name = session?.userName || 'Carlos';

  useEffect(() => {
    console.log('[Home.tsx] Goals loaded by useGoals:', goals);
  }, [goals]);

  const hasGoals = !!(goals && goals.length > 0);
  const goalProgress = hasGoals ? 50 : 0;

  const emotions = [
    { icon: Smile, label: 'Feliz', color: 'text-green-500', hoverBg: 'hover:bg-green-100', hoverIcon: 'group-hover:text-green-600' },
    { icon: Frown, label: 'Triste', color: 'text-blue-500', hoverBg: 'hover:bg-blue-100', hoverIcon: 'group-hover:text-blue-600' },
    { icon: Meh, label: 'Neutral', color: 'text-gray-500', hoverBg: 'hover:bg-gray-100', hoverIcon: 'group-hover:text-gray-600' },
    { icon: Annoyed, label: 'Molesta', color: 'text-red-500', hoverBg: 'hover:bg-red-100', hoverIcon: 'group-hover:text-red-600' }
  ];

  const handleEmotionClick = (emotionLabel: string) => {
    console.log(`Emotion selected: ${emotionLabel}`);
    nav('/dashboard/journal');
  };

  return (
    <div className="space-y-8 pb-32">
      {/* 1. Registro de Emociones */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">¿Cómo te sientes hoy?</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">Toca un ícono para registrar cómo te sientes ahora.</p>
        <div className="flex justify-around items-center">
          {emotions.map(({ icon: Icon, label, color, hoverBg, hoverIcon }) => (
            <button
              key={label}
              onClick={() => handleEmotionClick(label)}
              className="flex flex-col items-center text-center text-gray-600 transition-colors group"
              title={label}
            >
              <div className={`w-16 h-16 rounded-full bg-gray-100 ${hoverBg} flex items-center justify-center mb-2 transition-colors duration-200`}>
                <Icon size={32} className={`${color} ${hoverIcon} transition-colors duration-200`} />
              </div>
            </button>
          ))}
          <button
            onClick={() => console.log('Abrir selector de más emociones')}
            className="flex flex-col items-center text-center text-gray-600 transition-colors group"
            title="Más opciones"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 group-hover:border-violet-300 flex items-center justify-center mb-2 transition-colors duration-200">
              <Plus size={28} className="text-gray-400 group-hover:text-violet-500 transition-colors duration-200" />
            </div>
          </button>
        </div>
      </section>

      {/* 1.5 Acceso rápido al chat */}
      <section>
        <button
          onClick={() => nav('/dashboard/chat')}
          className="w-full text-left bg-gradient-to-br from-violet-50 to-purple-50 p-5 rounded-2xl border border-violet-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-lg bg-white/50 text-violet-600 flex items-center justify-center shrink-0">
            <MessageSquare size={24} />
          </div>
          <div className="flex-grow">
            <h2 className="text-lg font-bold text-gray-800">¿Necesitas hablar?</h2>
            <p className="text-sm text-gray-600">Violetta está aquí para escucharte.</p>
          </div>
          <div className="text-violet-500 transition-transform group-hover:translate-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </button>
      </section>

      {/* 2. Metas con progreso */}
      <section>
        <button
          onClick={() => nav('/dashboard/journey')}
          className="w-full text-left bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-3">Mis Metas</h2>
          {hasGoals ? (
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-600">Tu progreso general:</p>
                <p className="text-sm font-semibold text-teal-700">{goalProgress}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-teal-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
              <span className="block text-sm text-violet-600 font-semibold mt-4">VER MIS METAS {'>'}</span>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-3">Aún no has agregado metas. Definir objetivos te ayuda a crecer.</p>
              <span className="inline-block text-sm bg-violet-100 text-violet-700 font-semibold px-4 py-2 rounded-full">
                + Agregar Meta
              </span>
            </div>
          )}
        </button>
      </section>

      {/* 3. Descubrimientos (nuevo) */}
      <DiscoveriesSection name={name} />
    </div>
  );
}
