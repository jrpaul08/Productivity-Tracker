import { useState } from 'react'
import { useEntries } from '../hooks/useEntries.js'
import EntryTable from '../components/EntryTable.jsx'
import WeeklyBarChart from '../components/WeeklyBarChart.jsx'

export default function History() {
  const { entries, deleteEntry } = useEntries()
  const [filteredEntries, setFilteredEntries] = useState(entries)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          History
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          View and manage all your logged entries
        </p>
      </div>
      
      <EntryTable entries={entries} onDelete={deleteEntry} onFilteredChange={setFilteredEntries} />
      
      {filteredEntries.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Summary
          </h2>
          <div className="rounded-2xl p-6" 
               style={{ 
                 backgroundColor: 'var(--color-card)', 
                 border: '1px solid var(--color-border)',
                 boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
               }}>
            <WeeklyBarChart entries={filteredEntries} showIdeal={false} title="Total minutes per category (filtered range)" />
          </div>
        </div>
      )}
    </div>
  )
}
