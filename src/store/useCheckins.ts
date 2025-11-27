import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CheckIn = {
  id: string
  timestamp: string
  mood: string | null
  contexto: 'pareja' | 'familia' | 'trabajo' | 'amistades' | 'publico' | 'otro' | null
  boundary: 'no' | 'duda' | 'si'
  boundaryTipos: ('control'|'insultos'|'celos'|'aislamiento'|'dinero'|'sexual'|'fisico'|'digital')[]
  safety: 'si' | 'no_segura' | 'no' | null
}

type State = {
  items: CheckIn[]
  add: (ci: Omit<CheckIn, 'id'>) => CheckIn
  clear: () => void
}

export const useCheckins = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      add: (ci) => {
        const newItem: CheckIn = { id: crypto.randomUUID(), ...ci }
        set({ items: [newItem, ...get().items] })
        return newItem
      },
      clear: () => set({ items: [] }),
    }),
    { name: 'violetta-checkins' }
  )
)
