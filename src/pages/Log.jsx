import { useState, useCallback } from 'react'
import { useEntries } from '../hooks/useEntries.js'
import { getTodayEntries } from '../utils/calculations.js'
import EntryForm from '../components/EntryForm.jsx'
import DailyLogTable from '../components/DailyLogTable.jsx'
import Toast from '../components/Toast.jsx'

export default function Log() {
  const { entries, addEntry, deleteEntry } = useEntries()
  const [toast, setToast] = useState(null)

  const handleSubmit = useCallback((entry) => {
    addEntry(entry)
    setToast('Entry saved ✓')
  }, [addEntry])

  const todayEntries = getTodayEntries(entries).sort((a, b) => {
    // Sort by time ascending (chronological order - earliest first)
    const timeA = a.time || '00:00'
    const timeB = b.time || '00:00'
    return timeA.localeCompare(timeB)
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Log Entry
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Track your time spent on job search activities
        </p>
      </div>

      <div className="max-w-2xl">
        <EntryForm onSubmit={handleSubmit} />
      </div>

      {todayEntries.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Daily Log — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h2>
          <DailyLogTable entries={todayEntries} onDelete={deleteEntry} />
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
