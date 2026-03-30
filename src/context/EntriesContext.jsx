import { createContext, useState, useCallback } from 'react'
import { getEntries, saveEntries } from '../utils/storage.js'

export const EntriesContext = createContext(null)

export function EntriesProvider({ children }) {
  const [entries, setEntries] = useState(() => getEntries())

  const addEntry = useCallback((entry) => {
    setEntries(prev => {
      const next = [entry, ...prev]
      saveEntries(next)
      return next
    })
  }, [])

  const deleteEntry = useCallback((id) => {
    setEntries(prev => {
      const next = prev.filter(e => e.id !== id)
      saveEntries(next)
      return next
    })
  }, [])

  return (
    <EntriesContext.Provider value={{ entries, addEntry, deleteEntry }}>
      {children}
    </EntriesContext.Provider>
  )
}
