import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BreathMode = 'box44' | '478'

type ExercisesStore = {
  breathMode: BreathMode
  sessionMinutes: number      // duración total del ejercicio
  lastCompletedISO: string | null

  setMode: (m: BreathMode) => void
  setMinutes: (min: number) => void
  markCompleted: () => void
}

export const useExercises = create<ExercisesStore>()(
  persist(
    (set) => ({
      breathMode: 'box44',
      sessionMinutes: 2,
      lastCompletedISO: null,

      setMode: (m) => set({ breathMode: m }),
      setMinutes: (min) => set({ sessionMinutes: Math.max(1, Math.min(10, min)) }),
      markCompleted: () => set({ lastCompletedISO: new Date().toISOString() }),
    }),
    { name: 'violetta-exercises' }
  )
)
