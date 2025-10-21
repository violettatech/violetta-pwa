import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TrustedContact = {
  id: string
  name: string
  phone?: string
  notes?: string
  isPrimary?: boolean
}

export type ResourceLink = {
  id: string
  label: string
  url: string
}

type EmergencyState = {
  shareStatusPublic: boolean
  contacts: TrustedContact[]
  resources: ResourceLink[]
}

type EmergencyStore = EmergencyState & {
  addContact: (c: Omit<TrustedContact, 'id'>) => void
  updateContact: (id: string, patch: Partial<TrustedContact>) => void
  removeContact: (id: string) => void
  setPrimary: (id: string) => void
  addResource: (r: Omit<ResourceLink, 'id'>) => void
  removeResource: (id: string) => void
  setShareStatusPublic: (v: boolean) => void
  clear: () => void
}

const initial: EmergencyState = {
  shareStatusPublic: false,
  contacts: [
    { id: 'c1', name: 'Contacto principal', phone: '', isPrimary: true },
  ],
  resources: [
    { id: 'r1', label: 'Respirar ahora (esta app)', url: '/dashboard/emergency' },
  ],
}

export const useEmergency = create<EmergencyStore>()(
  persist(
    (set, get) => ({
      ...initial,
      addContact: (c) =>
        set((s) => ({
          contacts: [...s.contacts, { id: crypto.randomUUID(), ...c }],
        })),
      updateContact: (id, patch) =>
        set((s) => ({
          contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      removeContact: (id) =>
        set((s) => ({ contacts: s.contacts.filter((c) => c.id !== id) })),
      setPrimary: (id) =>
        set((s) => ({
          contacts: s.contacts.map((c) => ({ ...c, isPrimary: c.id === id })),
        })),
      addResource: (r) =>
        set((s) => ({
          resources: [...s.resources, { id: crypto.randomUUID(), ...r }],
        })),
      removeResource: (id) =>
        set((s) => ({ resources: s.resources.filter((r) => r.id !== id) })),
      setShareStatusPublic: (v) => set({ shareStatusPublic: v }),
      clear: () => set({ ...initial }),
    }),
    { name: 'violetta-emergency' }
  )
)
