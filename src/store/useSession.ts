import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// === Pronombres & género gramatical ===
export type BuiltInPronouns = 'ella' | 'él' | 'elle' | 'otro' // 'otro' = personalizado
export type CustomPronouns = {
  display?: string // cómo se muestra en UI (p. ej. "elle", "ella/elle", etc.)
}
export type GrammaticalGender = 'f' | 'm' | 'x' // femenino, masculino, neutro/no binario

export type Session = {
  userEmail?: string
  userName?: string
  userPhone?: string
  hasCompletedOnboarding: boolean
  createdAt?: string

  // === NUEVO ===
  pronouns?: {
    type: BuiltInPronouns
    custom?: CustomPronouns
  }
  grammaticalGender?: GrammaticalGender
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

  // === NUEVO === actualizar pronombres y género
  setPronounsAndGender: (args: {
    pronouns?: { type: BuiltInPronouns; custom?: CustomPronouns }
    grammaticalGender?: GrammaticalGender
  }) => void

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

      setSession: (s) =>
        set({
          session: s,
          pendingMethod: undefined,
          pendingEmail: undefined,
          pendingPhone: undefined,
        }),

      setOnboardingDone: (done) => {
        const cur = get().session
        if (!cur) return
        set({ session: { ...cur, hasCompletedOnboarding: done } })
      },

      // === NUEVO ===
      setPronounsAndGender: ({ pronouns, grammaticalGender }) => {
        const cur = get().session
        if (!cur) return
        set({
          session: {
            ...cur,
            pronouns: pronouns ?? cur.pronouns,
            grammaticalGender: grammaticalGender ?? cur.grammaticalGender,
          },
        })
      },

      clear: () =>
        set({
          session: null,
          pendingMethod: undefined,
          pendingEmail: undefined,
          pendingPhone: undefined,
        }),
    }),
    { name: 'violetta-session' }
  )
)
