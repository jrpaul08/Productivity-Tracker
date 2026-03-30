import { useContext } from 'react'
import { EntriesContext } from '../context/EntriesContext.jsx'

export function useEntries() {
  const ctx = useContext(EntriesContext)
  if (!ctx) throw new Error('useEntries must be used inside EntriesProvider')
  return ctx
}
