import type { GrammaticalGender } from '../store/useSession'

/**
 * Aplica género gramatical a una raíz.
 * g('Bienvenid', 'f') => 'Bienvenida'
 * g('Bienvenid', 'm') => 'Bienvenido'
 * g('Bienvenid', 'x') => 'Bienvenide'
 */
export function g(root: string, gender: GrammaticalGender = 'x') {
  if (gender === 'f') return `${root}a`
  if (gender === 'm') return `${root}o`
  return `${root}e`
}

/**
 * Devuelve el texto de pronombres para la UI.
 * - 'ella' | 'él' | 'elle' => se muestran tal cual
 * - 'otro' => muestra custom.display si existe; si no, '—'
 */
export function renderPronouns(
  type: 'ella' | 'él' | 'elle' | 'otro',
  custom?: { display?: string }
) {
  if (type === 'otro') return (custom?.display || '').trim() || '—'
  return type
}
