const KEY = 'jsd_entries'

export function getEntries() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveEntries(entries) {
  localStorage.setItem(KEY, JSON.stringify(entries))
}
