import { useEffect, useMemo, useState } from 'react';
import { useSession } from '../../store/useSession';
import { useGoals, type Goal } from '../../store/useGoals';
import {
  Shield,
  Check,
  BookText,
  Target,
  Plus,
  Trash2,
  Star,
  Users,
} from 'lucide-react';

// MODO DEMO solo para estadísticas e insignias
const DEMO_MODE = true;

type Entry = {
  id: string;
  title: string;
  dateISO: string;
  emoji?: string;
  text: string;
  note?: string;
};

const LS_JOURNAL = 'violetta-journal';
const LS_CONTACTS = 'violetta-trusted-contacts';

function getUniqueDays(entries: Entry[]) {
  const set = new Set<string>();
  for (const e of entries) {
    const d = new Date(e.dateISO);
    if (!Number.isNaN(d.getTime())) {
      const key = d.toISOString().slice(0, 10);
      set.add(key);
    }
  }
  return Array.from(set).sort();
}

function computeStreak(daysAsc: string[]) {
  if (!daysAsc.length) return 0;
  const todayKey = new Date().toISOString().slice(0, 10);
  let cursor = new Date(
    daysAsc.includes(todayKey)
      ? todayKey
      : new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  );
  const daySet = new Set(daysAsc);
  let streak = 0;
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (daySet.has(key)) {
      streak++;
      cursor = new Date(cursor.getTime() - 86400000);
    } else break;
  }
  return streak;
}

// Meta demo, solo como ejemplo inicial si no hay metas
const demoGoal: Goal = {
  id: 'g-demo',
  text: 'Escribir en mi diario 3 veces por semana.',
  createdAt: Date.now() - 86400000 * 2,
};

type BadgeConfig = {
  label: string;
  achieved: boolean;
  icon: React.ComponentType<{ size?: number }>;
  description: string;
};

type GoalCategory = {
  id: string;
  label: string;
  description: string;
  items: string[];
};

// Categorías de metas, alineadas con el post-it
const goalCategories: GoalCategory[] = [
  {
    id: 'self-knowledge',
    label: 'Conocerme mejor',
    description:
      'Metas orientadas al autoconocimiento, reflexión y comprensión de tus emociones.',
    items: [
      'Escribir en mi diario 3 veces por semana.',
      'Dedicar 10 minutos a observar cómo me siento cada día.',
      'Leer un artículo o contenido sobre bienestar emocional una vez a la semana.',
    ],
  },
  {
    id: 'anxiety',
    label: 'Gestionar mi ansiedad',
    description:
      'Metas para trabajar la ansiedad con respiración, grounding y registro de detonantes.',
    items: [
      'Practicar una técnica de respiración consciente al menos una vez al día.',
      'Usar una técnica de grounding 3 veces esta semana.',
      'Registrar qué situaciones despiertan mi ansiedad en el diario.',
    ],
  },
  {
    id: 'boundaries',
    label: 'Cuidar mis límites',
    description:
      'Metas enfocadas en decir que no, cuidar tu energía y poner límites sanos.',
    items: [
      'Establecer un límite sano esta semana y registrarlo en mi diario.',
      'Identificar una situación reciente en la que no expresé mis límites.',
      'Practicar decir “no” con amabilidad al menos una vez esta semana.',
    ],
  },
  {
    id: 'daily-wellbeing',
    label: 'Bienestar diario',
    description:
      'Metas pequeñas y constantes para cuidar tu día a día y tu energía.',
    items: [
      'Identificar y agradecer una cosa positiva cada día.',
      'Tomar 10 minutos para caminar o despejarme al menos 3 veces esta semana.',
      'Dormir al menos 7 horas durante 3 noches esta semana.',
    ],
  },
  {
    id: 'support-network',
    label: 'Red de apoyo',
    description:
      'Metas para fortalecer tu red segura y no cargar con todo sola.',
    items: [
      'Hablar con una persona de confianza sobre cómo me siento una vez esta semana.',
      'Registrar a mis contactos seguros en la Red Segura de Violetta.',
      'Pedir ayuda o acompañamiento a alguien de mi red segura al menos una vez este mes.',
    ],
  },
];

export default function MyJourney() {
  const { session } = useSession();
  const name = session?.userName || 'María';

  const { goals: realGoals, addGoal, removeGoal } = useGoals();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [contactsCount, setContactsCount] = useState<number>(0);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [customGoal, setCustomGoal] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_JOURNAL);
      const parsedEntries = raw ? JSON.parse(raw) : [];
      setEntries(Array.isArray(parsedEntries) ? parsedEntries : []);
    } catch {
      setEntries([]);
    }
    try {
      const rawC = localStorage.getItem(LS_CONTACTS);
      const list = rawC ? JSON.parse(rawC) : [];
      setContactsCount(Array.isArray(list) ? list.length : 0);
    } catch {
      setContactsCount(0);
    }
  }, []);

  const uniqueDays = useMemo(() => getUniqueDays(entries), [entries]);
  const realStreak = useMemo(() => computeStreak(uniqueDays), [uniqueDays]);
  const realDaysCount = uniqueDays.length;
  const realHasFirstDiary = entries.length >= 1;
  const realHasSafeNet = contactsCount >= 1;

  const streak = DEMO_MODE ? 7 : realStreak;
  const daysCount = DEMO_MODE ? 25 : realDaysCount;
  const hasFirstWeek = streak >= 7;
  const hasConsistency = daysCount >= 30;
  const hasFirstDiary = DEMO_MODE ? true : realHasFirstDiary;
  const hasSafeNet = DEMO_MODE ? true : realHasSafeNet;

  // Metas que se muestran
  const hasRealGoals = realGoals.length > 0;
  const goalsToDisplay: Goal[] = hasRealGoals
    ? realGoals
    : DEMO_MODE
    ? [demoGoal]
    : [];

  const badges: BadgeConfig[] = [
    {
      label: 'Primera semana',
      achieved: hasFirstWeek,
      icon: Check,
      description:
        'Reflexionaste al menos un día durante 7 días diferentes.',
    },
    {
      label: 'Primer diario',
      achieved: hasFirstDiary,
      icon: BookText,
      description: 'Escribiste tu primera entrada en el diario.',
    },
    {
      label: 'Constancia 30 días',
      achieved: hasConsistency,
      icon: Star,
      description: 'Registraste tu bienestar al menos en 30 días distintos.',
    },
    {
      label: 'Red segura',
      achieved: hasSafeNet,
      icon: Users,
      description:
        'Agregaste a alguien de confianza a tu red segura.',
    },
  ];

  function handleAddGoal(text: string) {
    const value = text.trim();
    if (!value) return;
    addGoal(value);
    setShowAddGoalModal(false);
    setCustomGoal('');
    setSelectedCategoryId(null);
  }

  function handleRemoveGoal(goal: Goal) {
    if (!hasRealGoals && goal.id === 'g-demo') return;
    removeGoal(goal.id);
  }

  const selectedCategory = selectedCategoryId
    ? goalCategories.find((c) => c.id === selectedCategoryId) ?? null
    : null;

  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col relative overflow-hidden bg-white">
      <header className="px-6 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Mi Viaje</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-28 main-container space-y-8">
        <style>{`.main-container{scrollbar-width:none} .main-container::-webkit-scrollbar{display:none}`}</style>

        {/* Perfil */}
        <section className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-6 text-center text-white relative overflow-hidden shadow-lg">
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full opacity-50"></div>
          <div className="absolute -top-5 -left-12 w-28 h-28 bg-white/10 rounded-full opacity-50"></div>
          <div className="relative">
            <div className="inline-block bg-white/20 p-4 rounded-full mb-4 ring-4 ring-white/10">
              <Shield size={60} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-violet-200 text-sm">Cuidando mi bienestar</p>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-violet-600">{streak}</p>
            <p className="text-sm font-semibold text-gray-600">
              Racha actual 🔥
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-violet-600">{daysCount}</p>
            <p className="text-sm font-semibold text-gray-600">
              Días de reflexión ✍️
            </p>
          </div>
        </section>

        {/* Mis Metas */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Mis Metas</h2>
            <button
              onClick={() => {
                setShowAddGoalModal(true);
                setSelectedCategoryId(null);
              }}
              className="flex items-center gap-1 text-sm bg-violet-100 text-violet-700 font-semibold px-3 py-1 rounded-full hover:bg-violet-200"
            >
              <Plus size={16} /> Agregar
            </button>
          </div>

          {goalsToDisplay.length > 0 ? (
            <div className="space-y-3">
              {goalsToDisplay.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center"
                >
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Target size={18} className="text-teal-500" />
                    {goal.text}
                  </p>
                  <button
                    onClick={() => handleRemoveGoal(goal)}
                    title="Eliminar meta"
                    className={`p-1 ${
                      !hasRealGoals && goal.id === 'g-demo'
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-400 hover:text-rose-500'
                    }`}
                    disabled={!hasRealGoals && goal.id === 'g-demo'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl">
              Aún no tienes metas definidas. Agrégalas para enfocar tu viaje.
            </p>
          )}
        </section>

        {/* Mis Insignias */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Mis Insignias</h2>
          <p className="text-xs text-gray-500 mb-3">
            Se desbloquean con tu uso de Violetta y algunos pasos de cuidado,
            como escribir en tu diario o crear tu red segura.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition-opacity ${
                  badge.achieved ? '' : 'opacity-45 grayscale'
                }`}
              >
                <div
                  className={`rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 transition-colors ${
                    badge.achieved
                      ? 'bg-gradient-to-br from-green-100 to-teal-100 text-teal-600'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <badge.icon size={24} />
                </div>
                <p className="text-[11px] font-semibold text-gray-700 mb-1">
                  {badge.label}
                </p>
                <p className="text-[10px] text-gray-500 leading-snug">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal para agregar metas */}
      {showAddGoalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={() => {
            setShowAddGoalModal(false);
            setSelectedCategoryId(null);
            setCustomGoal('');
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Agregar nueva meta
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Primero elige en qué te quieres enfocar. Después puedes seleccionar
              una meta sugerida o escribir la tuya.
            </p>

            {/* Paso 1: elegir categoría */}
            {!selectedCategory && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 max-h-52 overflow-y-auto">
                {goalCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className="text-left text-sm p-3 rounded-xl border border-violet-100 bg-violet-50 hover:bg-violet-100 text-violet-800 shadow-sm"
                  >
                    <p className="font-semibold text-[13px]">{cat.label}</p>
                    <p className="text-[11px] text-violet-700 mt-1 line-clamp-3">
                      {cat.description}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Paso 2: metas dentro de la categoría seleccionada */}
            {selectedCategory && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Categoría seleccionada
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedCategory.label}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className="text-xs text-violet-600 hover:text-violet-700 underline"
                  >
                    Ver todas las categorías
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Elige una meta sugerida o escribe la tuya más abajo.
                </p>
                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                  {selectedCategory.items.map((text, i) => (
                    <button
                      key={i}
                      onClick={() => handleAddGoal(text)}
                      className="w-full text-left text-sm p-3 bg-violet-50 hover:bg-violet-100 rounded-lg text-violet-800"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Meta personalizada */}
            <textarea
              rows={2}
              placeholder="O escribe tu propia meta aquí..."
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-violet-500 focus:border-violet-500 mb-4"
            ></textarea>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddGoalModal(false);
                  setSelectedCategoryId(null);
                  setCustomGoal('');
                }}
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-center hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleAddGoal(customGoal)}
                className="flex-1 rounded-xl bg-violet-600 px-3 py-2 text-center font-semibold text-white hover:bg-violet-700"
              >
                Guardar meta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
