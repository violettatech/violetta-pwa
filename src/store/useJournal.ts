import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type JournalEntry = {
  id: string
  dateISO: string   // e.g. "2025-10-19"
  mood: 1 | 2 | 3 | 4 | 5
  note: string
}

type JournalStore = {
  entries: JournalEntry[]
  add: (e: Omit<JournalEntry, 'id'>) => string
  update: (id: string, patch: Partial<JournalEntry>) => void
  remove: (id: string) => void
  clear: () => void
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export const useJournal = create<JournalStore>()(
  persist(
    (set, get) => ({
      entries: [],
      add: (e) => {
        const id = uid()
        set({ entries: [{ id, ...e }, ...get().entries] })
        return id
      },
      update: (id, patch) =>
        set({
          entries: get().entries.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        }),
      remove: (id) => set({ entries: get().entries.filter((x) => x.id !== id) }),
      clear: () => set({ entries: [] }),
    }),
    { name: 'violetta-journal' }
  )
)
