const STORAGE_KEY = 'kitty:recent-splits'
const MAX_RECENT = 10

export function getRecentSplits(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function addRecentSplit(id: string): void {
  try {
    const existing = getRecentSplits().filter((existingId) => existingId !== id)
    const updated = [id, ...existing].slice(0, MAX_RECENT)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable (private browsing, etc.) — recent-splits is a nice-to-have, fail silently.
  }
}
