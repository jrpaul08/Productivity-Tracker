import { Link } from 'react-router-dom'
import { useEntries } from '../hooks/useEntries.js'
import { CATEGORIES } from '../constants/categories.js'
import { getTodayEntries, getWeekEntries, getCategoryTotals, getMostNeglectedCategory, formatDuration } from '../utils/calculations.js'
import SummaryCard from '../components/SummaryCard.jsx'
import CategoryProgressBar from '../components/CategoryProgressBar.jsx'
import WeeklyBarChart from '../components/WeeklyBarChart.jsx'
import NetworkingTracker from '../components/NetworkingTracker.jsx'

export default function Dashboard() {
  const { entries } = useEntries()
  const todayEntries = getTodayEntries(entries)
  const weekEntries  = getWeekEntries(entries)
  const todayTotals  = getCategoryTotals(todayEntries)
  const weekTotals   = getCategoryTotals(weekEntries)
  const todayMinutes = Object.values(todayTotals).reduce((a, b) => a + b, 0)
  const weekMinutes  = Object.values(weekTotals).reduce((a, b) => a + b, 0)
  const appsThisWeek = weekEntries.filter(e => e.category === 'Job Applications').length
  const neglected    = getMostNeglectedCategory(weekTotals)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Today" value={formatDuration(todayMinutes)} />
        <SummaryCard label="This Week" value={formatDuration(weekMinutes)} />
        <SummaryCard label="Applications (week)" value={appsThisWeek} sub="entries logged" />
        <SummaryCard label="Most Neglected" value={neglected?.shortName ?? '—'} sub="vs weekly target" />
      </div>

      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Today's Progress</h2>
        {todayEntries.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
            Nothing logged yet today —{' '}
            <Link to="/log" className="text-blue-600 font-medium hover:underline">start your first entry →</Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 px-4">
            {CATEGORIES.map(cat => (
              <CategoryProgressBar key={cat.name} category={cat} minutesToday={todayTotals[cat.name] || 0} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">This Week</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <WeeklyBarChart entries={weekEntries} showIdeal title="Minutes per category (Mon–Sun)" />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Networking Days</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <NetworkingTracker weekEntries={weekEntries} />
        </div>
      </section>
    </div>
  )
}
