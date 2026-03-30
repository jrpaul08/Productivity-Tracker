import { useState, useEffect } from 'react'
import { CATEGORY_MAP, CATEGORY_NAMES } from '../constants/categories.js'
import { formatDuration } from '../utils/calculations.js'

export default function EntryTable({ entries, onDelete, onFilteredChange }) {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate]     = useState('')
  const [selectedCats, setSelectedCats] = useState([])
  const [confirmId, setConfirmId] = useState(null)

  const filtered = entries.filter(e => {
    if (fromDate && e.date < fromDate) return false
    if (toDate   && e.date > toDate)   return false
    if (selectedCats.length && !selectedCats.includes(e.category)) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date)
    return b.createdAt.localeCompare(a.createdAt)
  })

  useEffect(() => {
    onFilteredChange?.(filtered)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, fromDate, toDate, selectedCats.join(',')])

  function toggleCat(name) {
    setSelectedCats(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name])
  }

  const inputClass = 'border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-600">Filters</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-1.5 text-sm text-gray-600">
            From <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className={inputClass} />
          </label>
          <label className="flex items-center gap-1.5 text-sm text-gray-600">
            To <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className={inputClass} />
          </label>
          {(fromDate || toDate || selectedCats.length > 0) && (
            <button onClick={() => { setFromDate(''); setToDate(''); setSelectedCats([]) }} className="text-xs text-blue-600 hover:underline">Clear filters</button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_NAMES.map(name => {
            const cat = CATEGORY_MAP[name]
            const active = selectedCats.includes(name)
            return (
              <button key={name} onClick={() => toggleCat(name)}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${active ? 'text-white' : 'text-gray-600 bg-white border-gray-300 hover:border-gray-400'}`}
                style={active ? { backgroundColor: cat.color, borderColor: cat.color } : {}}>
                {name}
              </button>
            )
          })}
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No entries match the current filters.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Category', 'Activity', 'Duration', 'Notes', ''].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map(entry => {
                  const cat = CATEGORY_MAP[entry.category]
                  const isConfirming = confirmId === entry.id
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{entry.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: cat?.color + '22', color: cat?.color }}>
                          {entry.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800">{entry.activity}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDuration(entry.duration)}</td>
                      <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{entry.notes || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        {isConfirming ? (
                          <span className="flex items-center gap-2 justify-end">
                            <span className="text-xs text-gray-500">Delete?</span>
                            <button onClick={() => { onDelete(entry.id); setConfirmId(null) }} className="text-xs font-semibold text-red-600 hover:underline">Yes</button>
                            <button onClick={() => setConfirmId(null)} className="text-xs text-gray-400 hover:underline">No</button>
                          </span>
                        ) : (
                          <button onClick={() => setConfirmId(entry.id)} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Delete</button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
