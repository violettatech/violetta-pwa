import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Goal = 'mood' | 'stress' | 'sleep' | null
export type Frequency = 'daily' | '3week' | '1week' | null
export type Reminder = 'morning' | 'afternoon' | 'evening' | null

type OnboardingState = {
  goal: Goal
  frequency: Frequency
  reminder: Reminder
  reset: () => void
  setGoal: (g: Goal) => void
  setFrequency: (f: Frequency) => void
  setReminder: (r: Reminder) => void
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      goal: null,
      frequency: null,
      reminder: null,
      setGoal: (g) => set({ goal: g }),
      setFrequency: (f) => set({ frequency: f }),
      setReminder: (r) => set({ reminder: r }),
      reset: () => set({ goal: null, frequency: null, reminder: null }),
    }),
    { name: 'violetta-onboarding' }
  )
)
