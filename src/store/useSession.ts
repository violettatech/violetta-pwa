import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Session = {
  userEmail?: string
  userName?: string
  userPhone?: string
  hasCompletedOnboarding: boolean
  createdAt?: string
} | null

export type PendingMethod = 'email' | 'sms' | 'whatsapp' | undefined

type SessionStore = {
  session: Session

  // Estado previo a verificar código
  pendingMethod: PendingMethod
  pendingEmail?: string
  pendingPhone?: string

  setPendingEmail: (email: string | undefined) => void
  setPendingPhone: (phone: string | undefined) => void
  setPendingMethod: (m: PendingMethod) => void

  setSession: (s: NonNullable<Session>) => void
  setOnboardingDone: (done: boolean) => void
  clear: () => void
}

export const useSession = create<SessionStore>()(
  persist(
    (set, get) => ({
      session: null,

      pendingMethod: undefined,
      pendingEmail: undefined,
      pendingPhone: undefined,

      setPendingEmail: (email) => set({ pendingEmail: email }),
      setPendingPhone: (phone) => set({ pendingPhone: phone }),
      setPendingMethod: (m) => set({ pendingMethod: m }),

      setSession: (s) => set({ session: s, pendingMethod: undefined, pendingEmail: undefined, pendingPhone: undefined }),

      setOnboardingDone: (done) => {
        const cur = get().session
        if (!cur) return
        set({ session: { ...cur, hasCompletedOnboarding: done } })
      },

      clear: () => set({ session: null, pendingMethod: undefined, pendingEmail: undefined, pendingPhone: undefined }),
    }),
    { name: 'violetta-session' }
  )
)
