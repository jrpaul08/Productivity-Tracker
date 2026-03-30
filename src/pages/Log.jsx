import { useState, useCallback } from 'react'
import { useEntries } from '../hooks/useEntries.js'
import EntryForm from '../components/EntryForm.jsx'
import Toast from '../components/Toast.jsx'

export default function Log() {
  const { addEntry } = useEntries()
  const [toast, setToast] = useState(null)

  const handleSubmit = useCallback((entry) => {
    addEntry(entry)
    setToast('Entry saved ✓')
  }, [addEntry])

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-gray-800">Log Entry</h1>
      <EntryForm onSubmit={handleSubmit} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
