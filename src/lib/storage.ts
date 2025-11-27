// utilidades simples para LocalStorage con tipos
export function getBoolean(key: string, fallback = false): boolean {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return raw === 'true'
  } catch {
    return fallback
  }
}

export function setBoolean(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value ? 'true' : 'false')
  } catch {
    // ignore quota errors
  }
}
