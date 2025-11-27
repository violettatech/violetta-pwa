// Unifica lectura/escritura de los stores persistidos para exportar/importar/resetear.

type PersistShape = {
  name: string
  state: unknown
  version?: number
}

const KEYS = [
  'violetta-session',
  'violetta-journal',
  'violetta-exercises',
] as const
type Key = typeof KEYS[number]

export type ViolettaBackup = {
  app: 'Violetta'
  version: 1
  exportedAt: string
  stores: Record<Key, PersistShape | null>
}

export function exportAll(): ViolettaBackup {
  const stores: ViolettaBackup['stores'] = {
    'violetta-session': readPersist('violetta-session'),
    'violetta-journal': readPersist('violetta-journal'),
    'violetta-exercises': readPersist('violetta-exercises'),
  }
  return {
    app: 'Violetta',
    version: 1,
    exportedAt: new Date().toISOString(),
    stores,
  }
}

export function downloadBackup(data: ViolettaBackup, filename = 'violetta-backup.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export async function importBackup(file: File): Promise<void> {
  const text = await file.text()
  const parsed = JSON.parse(text) as ViolettaBackup
  if (parsed.app !== 'Violetta' || !parsed.stores) throw new Error('Archivo inválido')

  for (const key of KEYS) {
    const content = parsed.stores[key]
    if (!content) {
      localStorage.removeItem(key)
      continue
    }
    // Guardamos tal cual el formato persist de zustand
    localStorage.setItem(key, JSON.stringify(content))
  }
}

export function resetAll() {
  for (const key of KEYS) localStorage.removeItem(key)
}

function readPersist(key: Key): PersistShape | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
