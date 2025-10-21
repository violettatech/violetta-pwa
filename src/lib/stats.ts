import type { JournalEntry } from '../store/useJournal'

function toISO(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function fromISO(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function addDays(date: Date, delta: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + delta)
  return d
}
function diffDays(aISO: string, bISO: string) {
  const a = fromISO(aISO)
  const b = fromISO(bISO)
  // normalizar a medianoche
  a.setHours(0, 0, 0, 0)
  b.setHours(0, 0, 0, 0)
  const ms = a.getTime() - b.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

/** Racha actual (consecutivos hacia atrás desde hoy). */
export function currentStreak(entries: JournalEntry[], today = new Date()) {
  const days = new Set(entries.map((e) => e.dateISO))
  let count = 0
  let d = new Date(today)
  let iso = toISO(d)
  while (days.has(iso)) {
    count++
    d = addDays(d, -1)
    iso = toISO(d)
  }
  return count
}

/** Mejor racha histórica. */
export function bestStreak(entries: JournalEntry[]) {
  const uniq = Array.from(new Set(entries.map((e) => e.dateISO))).sort()
  if (uniq.length === 0) return 0
  let best = 1
  let cur = 1
  for (let i = 1; i < uniq.length; i++) {
    const prev = uniq[i - 1]
    const curr = uniq[i]
    if (diffDays(curr, prev) === 1) {
      cur++
      if (cur > best) best = cur
    } else {
      cur = 1
    }
  }
  return best
}

/** Últimos N días (incluye hoy) con flag si hay entrada. */
export function lastNDaysActivity(entries: JournalEntry[], n = 7, today = new Date()) {
  const days = new Set(entries.map((e) => e.dateISO))
  const out: { iso: string; hasEntry: boolean; weekday: string }[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = addDays(today, -i)
    const iso = toISO(d)
    const wd = d.toLocaleDateString(undefined, { weekday: 'short' })
    out.push({ iso, hasEntry: days.has(iso), weekday: wd })
  }
  return out
}

/** Conteo por estado de ánimo 1..5 */
export function moodHistogram(entries: JournalEntry[]) {
  const hist: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const e of entries) hist[e.mood as 1 | 2 | 3 | 4 | 5]++
  return hist
}
