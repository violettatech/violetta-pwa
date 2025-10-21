import { useEffect, useMemo, useState } from 'react';
import { useSession } from '../../store/useSession';
import { useGoals, type Goal } from '../../store/useGoals'; // Importa Goal también
import { Shield, Check, BookText, Target, Plus, Trash2, Star, Users } from 'lucide-react';

// --- ¡MODO DEMO! ---
// Pon esto en 'true' para forzar los datos de la demo.
// Pon esto en 'false' para usar los datos reales de localStorage.
const DEMO_MODE = true;
// ---

// Define el tipo Entry si no está ya importado de otro sitio
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

// --- Funciones Helper (sin cambios) ---
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
// --- Fin Helpers ---


// Lista de metas predefinidas
const predefinedGoals = [
  "Escribir en mi diario 3 veces por semana.",
  "Practicar un ejercicio de respiración cada día.",
  "Identificar y agradecer una cosa positiva al día.",
  "Dedicar 10 minutos a la reflexión personal diariamente.",
  "Establecer un límite sano esta semana.",
];

// Meta de ejemplo para el modo demo
const demoGoal: Goal = {
  id: 'g-demo',
  text: 'Escribir en mi diario 3 veces por semana.',
  createdAt: Date.now() - 86400000 * 2 // Creada hace 2 días
};

export default function MyJourney() {
  const { session } = useSession();
  const name = session?.userName || 'María';
  // Obtenemos las funciones de useGoals, pero usaremos una lista dummy si DEMO_MODE es true
  const { goals: realGoals, addGoal, removeGoal } = useGoals();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [contactsCount, setContactsCount] = useState<number>(0);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // Carga de diario y contactos (se mantiene para cuando DEMO_MODE sea false)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_JOURNAL);
      const parsedEntries = raw ? JSON.parse(raw) : [];
      setEntries(Array.isArray(parsedEntries) ? parsedEntries : []);
    } catch { setEntries([]); }
    try {
      const rawC = localStorage.getItem(LS_CONTACTS);
      const list = rawC ? JSON.parse(rawC) : [];
      setContactsCount(Array.isArray(list) ? list.length : 0);
    } catch { setContactsCount(0); }
  }, []);

  // --- LÓGICA DE DEMO PARA ESTADÍSTICAS E INSIGNIAS ---
  const uniqueDays = useMemo(() => getUniqueDays(entries), [entries]);
  const realStreak = useMemo(() => computeStreak(uniqueDays), [uniqueDays]);
  const realDaysCount = uniqueDays.length;
  const realHasFirstDiary = entries.length >= 1;
  const realHasSafeNet = contactsCount >= 1;

  // Usa valores fijos si DEMO_MODE es true
  const streak = DEMO_MODE ? 7 : realStreak;
  const daysCount = DEMO_MODE ? 25 : realDaysCount;
  const hasFirstWeek = streak >= 7; // Calculado (true en demo)
  const hasConsistency = daysCount >= 30; // Calculado (false en demo)
  const hasFirstDiary = DEMO_MODE ? true : realHasFirstDiary; // Forzado en demo
  const hasSafeNet = DEMO_MODE ? true : realHasSafeNet; // Forzado en demo

  // Usa la meta demo si DEMO_MODE es true
  const goalsToDisplay = DEMO_MODE ? [demoGoal] : realGoals;
  // --- FIN LÓGICA DE DEMO ---

  // Insignias con estado basado en los valores finales (demo o real)
  const badges = [
    { label: 'Primera Semana', achieved: hasFirstWeek, icon: Check },
    { label: 'Primer Diario', achieved: hasFirstDiary, icon: BookText },
    { label: 'Constancia', achieved: hasConsistency, icon: Star },
    { label: 'Red Segura', achieved: hasSafeNet, icon: Users },
  ];

  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col relative overflow-hidden bg-white">
      <header className="px-6 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Mi Viaje</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-28 main-container space-y-8">
        <style>{`.main-container{scrollbar-width:none} .main-container::-webkit-scrollbar{display:none}`}</style>

        {/* Card de Perfil */}
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

        {/* Estadísticas (Mostrarán 7 y 25 en demo) */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-violet-600">{streak}</p>
            <p className="text-sm font-semibold text-gray-600">Racha actual 🔥</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-violet-600">{daysCount}</p>
            <p className="text-sm font-semibold text-gray-600">Días de reflexión ✍️</p>
          </div>
        </section>

        {/* SECCIÓN: MIS METAS (Mostrará la meta demo) */}
        <section>
          <div className="flex justify-between items-center mb-3">
             <h2 className="text-lg font-bold text-gray-800">Mis Metas</h2>
             <button
                onClick={() => setShowAddGoalModal(true)}
                className="flex items-center gap-1 text-sm bg-violet-100 text-violet-700 font-semibold px-3 py-1 rounded-full hover:bg-violet-200"
             >
               <Plus size={16} /> Agregar
             </button>
          </div>
          {/* Usa goalsToDisplay ahora */}
          {goalsToDisplay.length > 0 ? (
            <div className="space-y-3">
              {goalsToDisplay.map(goal => (
                <div key={goal.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                   <p className="text-sm text-gray-700 flex items-center gap-2">
                     <Target size={18} className="text-teal-500" />
                     {goal.text}
                   </p>
                   {/* Deshabilitar eliminar en modo demo o usar lógica diferente */}
                   <button 
                      onClick={() => !DEMO_MODE && removeGoal(goal.id)} 
                      title="Eliminar meta" 
                      className={`p-1 ${DEMO_MODE ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-rose-500'}`}
                      disabled={DEMO_MODE && goal.id === 'g-demo'} // Deshabilita borrar la meta demo
                   >
                      <Trash2 size={16} />
                   </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl">
              Aún no tienes metas definidas. ¡Agrégalas para enfocar tu viaje!
            </p>
          )}
        </section>

        {/* Insignias (Mostrarán las desbloqueadas en demo) */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Mis Insignias</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {badges.map((badge) => (
              <div key={badge.label} className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition-opacity ${badge.achieved ? '' : 'opacity-40 grayscale'}`}>
                <div className={`rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 transition-colors ${badge.achieved ? 'bg-gradient-to-br from-green-100 to-teal-100 text-teal-600' : 'bg-gray-200 text-gray-400'}`}>
                  {badge.icon && <badge.icon size={24} />}
                </div>
                <p className="text-xs font-semibold text-gray-700">{badge.label}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* MODAL PARA AGREGAR METAS */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => setShowAddGoalModal(false)}>
           <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Agregar Nueva Meta</h3>
              <p className="text-sm text-gray-600 mb-4">Puedes elegir una sugerencia o escribir la tuya:</p>
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                 {predefinedGoals.map((text, i) => (
                    <button
                       key={i}
                       onClick={() => { addGoal(text); setShowAddGoalModal(false); }}
                       className="w-full text-left text-sm p-3 bg-violet-50 hover:bg-violet-100 rounded-lg text-violet-800"
                    >
                      {text}
                    </button>
                 ))}
              </div>
              <textarea
                 id="custom-goal-input"
                 rows={2}
                 placeholder="O escribe tu propia meta aquí..."
                 className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-violet-500 focus:border-violet-500 mb-4"
              ></textarea>
              <div className="flex gap-3">
                 <button
                    onClick={() => setShowAddGoalModal(false)}
                    className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-center hover:bg-gray-100"
                 >
                   Cancelar
                 </button>
                 <button
                    onClick={() => {
                       const input = document.getElementById('custom-goal-input') as HTMLTextAreaElement;
                       if (input?.value) {
                         // Llama a addGoal (que guarda en localStorage si DEMO_MODE es false)
                         addGoal(input.value);
                       }
                       setShowAddGoalModal(false);
                    }}
                    className="flex-1 rounded-xl bg-violet-600 px-3 py-2 text-center font-semibold text-white hover:bg-violet-700"
                 >
                   Guardar Meta
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}