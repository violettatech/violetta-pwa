import { g } from '../utils/gender'
import type { GrammaticalGender } from '../store/useSession'

export const MICROCOPY = {
  // --- Pantalla Welcome ---
  welcomeTitle: 'Hola, soy Violetta',
  welcomeMessage: 'Tu confidente digital para crear relaciones sanas.',
  welcomePrimaryCta: 'Platiquemos',
  welcomeSecondaryCta: 'Entrar',
  welcomeFooter: 'Violetta 2025',

  // --- Registro ---
  registerTitle: 'Crear mi espacio',
  registerSubtitle: 'Este será tu espacio, hecho para acompañarte',
  thankYouRegister: (name: string) => `Gracias, ${name}. Tu espacio está listo`,
  privacyNote: 'Tus datos se mantendrán seguros. Solo Violetta los verá.',

  // --- Login ---
  loginTitle: (gender: GrammaticalGender = 'x') =>
    `${g('Bienvenid', gender)} de nuevo`,
  loginSubtitle: 'Ingresa tu correo y te enviaremos un código',

  // --- Verificación ---
  codeTitle: 'Verifica tu código',
  codeSubtitle: 'Te enviamos un código a tu correo',
  codeSent: (email: string) => `Te enviamos un código a ${email}`,
  codeError: 'Este código no coincide. Intenta de nuevo',

  // --- Onboarding ---
  onboarding1Title: 'Violetta te acompaña',
  onboarding1Subtitle:
    'Violetta es un espacio seguro para pausar, expresar y acompañarte día a día.',

  onboarding2Title: 'Tu espacio de calma',
  onboarding2Subtitle: 'Tu confidente digital para crear relaciones sanas.',

  onboarding3Title: (gender: GrammaticalGender = 'x') =>
    `Estás ${g('list', gender)}a para comenzar`,
  onboarding3Subtitle: (gender: GrammaticalGender = 'x') =>
    `Tu espacio está ${g('list', gender)}o. Empieza cuando te sientas ${g('preparad', gender)}`,

  // --- Reutilizables ---
  welcomeBack: (name: string, gender: GrammaticalGender = 'x') =>
    `¡Qué alegría verte de nuevo, ${name}!`,

  emailPlaceholder: '¿Cómo te gustaría que te llamemos?',

  // ======================================================
  // ===================== CHECK-INS ======================
  // ======================================================

  // Mensajes según emoción
  checkinPositiveTitle: 'Me alegra que te sientas así.',
  checkinPositiveBody: 'Si quieres, puedo guardar este momento para ti.',

  checkinNeutralBody:
    'A veces un día neutral es un día tranquilo. ¿Quieres añadir algún detalle?',

  checkinNegativeBody:
    'Lamento que estés pasando por un momento difícil. Compartir un poco más puede ayudarte.',

  // Preguntas del micro check-in
  checkinContextQuestion: '¿Dónde pasó?',
  checkinBoundaryQuestion: '¿Se cruzó algún límite hoy?',
  checkinBoundaryTypeLabel: '¿De qué tipo? Puedes elegir varios.',
  checkinSafetyQuestion: '¿Te sientes segura ahora?',

  // Bloque de apoyo (antes “plan de emergencia”)
  checkinRiskBlockTitle: '¿Quieres apoyo adicional?',
  checkinRiskBlockDescription:
    'Puedes revisar tus contactos de apoyo y los recursos disponibles cuando lo necesites.',
  checkinRiskBlockCta: 'Ir a Mi Red',

  // Botones del check-in
  checkinSave: 'Guardar',
  checkinSaveDiaryPositive: 'Guardar en diario',
  checkinSaveDiary: 'Abrir diario',
}
