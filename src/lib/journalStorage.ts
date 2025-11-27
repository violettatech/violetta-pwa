// src/lib/journalStorage.ts
// Almacenamiento local (localStorage) para el Diario

export type JournalEntry = {
  id: string
  title?: string
  emoji?: string
  text: string
  dateISO: string
  note?: string
}

const KEY = 'violetta-journal-v1'

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try { return JSON.parse(raw) as T } catch { return fallback }
}

export function loadEntries(): JournalEntry[] {
  const list = safeParse<JournalEntry[]>(localStorage.getItem(KEY), [])
  // Normalizamos datos viejos (si existieran)
  return list
    .filter(e => e && e.id && e.text)
    .sort((a, b) => (b.dateISO || '').localeCompare(a.dateISO || ''))
}

export function saveEntries(entries: JournalEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries))
}

export function addEntry(entry: Omit<JournalEntry, 'id' | 'dateISO'> & { id?: string; dateISO?: string }): JournalEntry {
  const all = loadEntries()
  const id = entry.id || (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`)
  const dateISO = entry.dateISO || new Date().toISOString()
  const full: JournalEntry = { id, dateISO, title: entry.title, emoji: entry.emoji, text: entry.text, note: entry.note }
  const next = [full, ...all]
  saveEntries(next)
  return full
}

export function updateEntry(id: string, patch: Partial<JournalEntry>) {
  const all = loadEntries()
  const next = all.map(e => (e.id === id ? { ...e, ...patch } : e))
  saveEntries(next)
}

export function removeEntry(id: string) {
  const all = loadEntries()
  const next = all.filter(e => e.id !== id)
  saveEntries(next)
}

export function clearAllEntries() {
  saveEntries([])
}
