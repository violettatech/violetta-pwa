import { g } from '../utils/gender'
import type { GrammaticalGender } from '../store/useSession'

export const MICROCOPY = {
  // --- Pantalla Welcome ---
  welcomeMessage: (gender: GrammaticalGender = 'x') =>
    `${g('Bienvenid', gender)}a un espacio para ti 💜`,
  welcomeSubtitle: 'Aquí podrás conversar, reflexionar y construir relaciones más sanas.',

  // --- Registro ---
  registerTitle: 'Crear mi espacio',
  registerSubtitle: 'Este será tu espacio, hecho para acompañarte',
  thankYouRegister: (name: string) => `Gracias, ${name} 💜. Tu espacio está listo`,
  privacyNote: 'Tus datos se mantendrán seguros. Solo Violetta los verá.',

  // --- Login ---
  loginTitle: (gender: GrammaticalGender = 'x') =>
    `${g('Bienvenid', gender)} de nuevo`,
  loginSubtitle: 'Ingresa tu correo y te enviaremos un código',

  // --- Verificación ---
  codeTitle: 'Verifica tu código',
  codeSubtitle: 'Te enviamos un código a tu correo 💜',
  codeSent: (email: string) => `Te enviamos un código a ${email}`,
  codeError: 'Este código no coincide. Intenta de nuevo 💜',

  // --- Onboarding ---
  onboarding1Title: 'Violetta te acompaña',
  onboarding1Subtitle:
    'Aquí te acompañamos a cuidar de ti y tus vínculos más importantes',

  onboarding2Title: 'Tu espacio de calma',
  onboarding2Subtitle:
    'Podrás conversar, reflexionar y encontrar calma cuando lo necesites',

  onboarding3Title: (gender: GrammaticalGender = 'x') =>
    `Estás ${g('list', gender)}a para comenzar 💜`,
  onboarding3Subtitle: (gender: GrammaticalGender = 'x') =>
    `Tu espacio está ${g('list', gender)}o. Empieza cuando te sientas ${g('preparad', gender)}`,

  // --- Reutilizables ---
  welcomeBack: (name: string, gender: GrammaticalGender = 'x') =>
    `¡Qué alegría verte de nuevo, ${name}! 💜`,

  emailPlaceholder: '¿Cómo te gustaría que te llamemos?',
}
