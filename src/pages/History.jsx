import { useState } from 'react'
import { useEntries } from '../hooks/useEntries.js'
import EntryTable from '../components/EntryTable.jsx'
import WeeklyBarChart from '../components/WeeklyBarChart.jsx'

export default function History() {
  const { entries, deleteEntry } = useEntries()
  const [filteredEntries, setFilteredEntries] = useState(entries)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">History</h1>
      <EntryTable entries={entries} onDelete={deleteEntry} onFilteredChange={setFilteredEntries} />
      {filteredEntries.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <WeeklyBarChart entries={filteredEntries} showIdeal={false} title="Total minutes per category (filtered range)" />
        </div>
      )}
    </div>
  )
}
