import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExercises, type BreathMode } from '../../store/useExercises'
import { ArrowLeft } from 'lucide-react'

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest'
type Step = { phase: Phase; secs: number }

/** Patrón por modo (ACTUALIZADO CON 4 MODOS) */
function getPattern(mode: BreathMode): Step[] {
  switch (mode) {
    case '478':
      return [
        { phase: 'inhale', secs: 4 },
        { phase: 'hold', secs: 7 },
        { phase: 'exhale', secs: 8 },
      ]
    case 'coherent55':
      return [
        { phase: 'inhale', secs: 5 },
        { phase: 'exhale', secs: 5 },
      ]
    case 'relax48':
      return [
        { phase: 'inhale', secs: 4 },
        { phase: 'exhale', secs: 8 },
      ]
    case 'box44': // Default
    default:
      return [
        { phase: 'inhale', secs: 4 },
        { phase: 'hold', secs: 4 },
        { phase: 'exhale', secs: 4 },
        { phase: 'rest', secs: 4 },
      ]
  }
}

function PhaseLabel({ p }: { p: Phase }) {
  const map: Record<Phase, string> = {
    inhale: 'Inhala',
    hold: 'Mantén',
    exhale: 'Exhala',
    rest: 'Descansa',
  }
  return <>{map[p]}</>
}

// --- COMPONENTES DE VISTA ---

/** Vista 1: Configuración (ACTUALIZADA) */
function SetupView({
  breathMode,
  setMode,
  sessionMinutes,
  setMinutes,
  isFinished,
}: {
  breathMode: BreathMode
  setMode: (m: BreathMode) => void
  sessionMinutes: number
  setMinutes: (m: number) => void
  isFinished: boolean
}) {
  return (
    <div className="w-full px-6 text-left transition-opacity duration-500">
      <p className="text-center text-gray-600 mb-8">
        Selecciona un modo y la duración de tu sesión para comenzar.
      </p>
      
      {isFinished && (
        <div className="mb-6 p-4 text-center bg-green-100 text-green-800 rounded-xl">
          <p className="font-semibold">¡Buen trabajo! 🌿</p>
          <p className="text-sm">Sesión completada.</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="breath-mode" className="block text-sm font-medium text-gray-700">
            Modo
          </label>
          {/* Opciones del <select> actualizadas */}
          <select
            id="breath-mode"
            className="mt-1 block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm rounded-xl"
            value={breathMode}
            onChange={(e) => setMode(e.target.value as BreathMode)}
          >
            <option value="box44">Caja 4-4 (Enfoque)</option>
            <option value="coherent55">Coherente 5-5 (Ansiedad)</option>
            <option value="relax48">Relajación 4-8 (Pánico)</option>
            <option value="478">4-7-8 (Sueño)</option>
          </select>
        </div>
        <div>
          <label htmlFor="session-minutes" className="block text-sm font-medium text-gray-700">
            Minutos
          </label>
          <input
            type="number"
            id="session-minutes"
            value={sessionMinutes}
            onChange={(e) => setMinutes(Math.max(1, Number(e.target.value)))}
            min="1"
            max="10"
            className="mt-1 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-xl py-3 px-3"
          />
        </div>
      </div>

      {/* Sugerencias (ACTUALIZADAS) */}
      <div className="rounded-xl border bg-white p-4 text-sm text-gray-700 shadow-sm mt-8">
        <p className="font-medium">Sugerencias</p>
        <ul className="mt-2 list-disc pl-5">
          {/* Se eliminó la línea de "mareas" */}
          <li>Mantén la espalda cómoda y los hombros sueltos.</li>
          <li>Empieza por 1–2 minutos y sube cuando te sientas lista.</li>
        </ul>
      </div>
    </div>
  )
}

/** Vista 2: Animador del ejercicio (Sin cambios) */
function ExerciseView({
  progress,
  phase,
  secsLeft,
  phaseDuration,
}: {
  progress: number
  phase: Phase
  secsLeft: number
  phaseDuration: number
}) {
  const { scale, color } = useMemo(() => {
    switch (phase) {
      case 'inhale':
        return { scale: 1.5, color: 'bg-violet-300' }
      case 'hold':
        return { scale: 1.5, color: 'bg-pink-300' }
      case 'exhale':
        return { scale: 1.0, color: 'bg-violet-300' }
      case 'rest':
        return { scale: 1.0, color: 'bg-gray-300' }
    }
  }, [phase])

  const ringRadius = 120 

  return (
    <div className="w-full flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%" cy="50%" r={ringRadius}
            className="fill-none stroke-violet-200/50"
            strokeWidth="8"
          />
          <circle
            cx="50%" cy="50%" r={ringRadius}
            className="fill-none stroke-violet-500"
            strokeWidth="8"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - progress}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div
          className={`w-32 h-32 rounded-full ${color}`}
          style={{
            transition: `transform ${phaseDuration}s ease-in-out, background-color 0.5s ease-in-out`,
            transform: `scale(${scale})`,
          }}
        />
        <div className="absolute text-center pointer-events-none">
          <p className="text-3xl font-bold text-gray-800">
            <PhaseLabel p={phase} />
          </p>
          <p className="text-lg text-gray-600">{secsLeft}s</p>
        </div>
      </div>
    </div>
  )
}

// --- COMPONENTE PRINCIPAL (Sin cambios en la lógica) ---

export default function Exercises() {
  const nav = useNavigate()
  const { breathMode, setMode, sessionMinutes, setMinutes, markCompleted } =
    useExercises()

  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [cycleTick, setCycleTick] = useState(0)

  const totalSecs = sessionMinutes * 60
  const pattern = useMemo(() => getPattern(breathMode), [breathMode])
  const cycleSecs = useMemo(() => pattern.reduce((a, s) => a + s.secs, 0), [pattern])

  useEffect(() => {
    if (!running) return
    
    setElapsed(s => s + 1);
    setCycleTick(s => s + 1);

    const id = setInterval(() => {
      setElapsed((s) => s + 1)
      setCycleTick((s) => s + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  const current = useMemo(() => {
    let t = cycleTick % cycleSecs
    if (cycleTick === 0) t = 0; 

    for (let i = 0; i < pattern.length; i++) {
      const segs = pattern[i].secs
      if (t < segs) return { i, phase: pattern[i].phase as Phase, left: segs - t, duration: segs }
      t -= segs
    }
    return { i: 0, phase: pattern[0].phase as Phase, left: pattern[0].secs, duration: pattern[0].secs }
  }, [cycleTick, cycleSecs, pattern])


  useEffect(() => {
    if (!running) return
    if (elapsed >= totalSecs) {
      setRunning(false)
      markCompleted()
    }
  }, [elapsed, totalSecs, running, markCompleted])

  const progress = totalSecs ? Math.min(1, elapsed / totalSecs) : 0
  const isFinished = !running && elapsed >= totalSecs 

  useEffect(() => {
    const html = document.documentElement
    if (running) {
      html.classList.add('hide-main-nav')
    } else {
      html.classList.remove('hide-main-nav')
    }
    return () => {
      html.classList.remove('hide-main-nav')
    }
  }, [running])


  function handleMainAction() {
    if (running) {
      setRunning(false)
      setElapsed(0)
      setCycleTick(0)
    } else {
      setElapsed(0)
      setCycleTick(0)
      setRunning(true)
    }
  }
  
  function handleBack() {
    if (running) {
      setRunning(false);
      setElapsed(0);
      setCycleTick(0);
    } else {
      nav(-1); 
    }
  }

  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col relative overflow-hidden bg-violet-50">

      <header className="p-4 flex items-center justify-between bg-violet-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-violet-100">
        <button onClick={handleBack} className="text-gray-500 hover:text-violet-600 p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Respiración Guiada</h1>
        <div className="w-7"></div>
      </header>
      
      <main className="flex-1 flex flex-col justify-center items-center text-center p-6 transition-all duration-500">
        {!running ? (
          <SetupView
            breathMode={breathMode}
            setMode={setMode}
            sessionMinutes={sessionMinutes}
            setMinutes={setMinutes}
            isFinished={isFinished}
          />
        ) : (
          <ExerciseView
            progress={progress}
            phase={current.phase}
            secsLeft={current.left}
            phaseDuration={current.duration}
          />
        )}
      </main>

      <footer className="p-6 bg-violet-50/80 backdrop-blur-sm border-t border-violet-100">
        <button
          onClick={handleMainAction}
          className="w-full bg-violet-600 text-white font-bold py-4 px-6 rounded-full hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          {running ? 'Finalizar' : 'Empezar'}
        </button>
      </footer>
    </div>
  )
}