import { Link } from 'react-router-dom'
import { useEntries } from '../hooks/useEntries.js'
import { CATEGORIES } from '../constants/categories.js'
import { getTodayEntries, getWeekEntries, getCategoryTotals, getMostNeglectedCategory, formatDuration } from '../utils/calculations.js'
import SummaryCard from '../components/SummaryCard.jsx'
import DailyPieChart from '../components/DailyPieChart.jsx'
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
  const appsThisWeek = weekEntries
    .filter(e => e.category === 'Job Applications')
    .reduce((sum, e) => sum + (e.jobCount || 1), 0)
  const neglected    = getMostNeglectedCategory(weekTotals)
  
  // Find primary focus (category with most time today)
  const primaryFocus = todayMinutes > 0 
    ? CATEGORIES.reduce((max, cat) => {
        const minutes = todayTotals[cat.name] || 0
        return minutes > (todayTotals[max.name] || 0) ? cat : max
      }, CATEGORIES[0])
    : null

  return (
    <div className="space-y-10">
      {/* Hero Section with Summary Cards */}
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Track your job search progress and stay balanced across key activities
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <SummaryCard label="This Week" value={formatDuration(weekMinutes)} accent="#8b5cf6" />
          <SummaryCard label="Applications (week)" value={appsThisWeek} sub="jobs applied" accent="#2196F3" />
          <SummaryCard label="Primary Focus" value={primaryFocus?.shortName ?? '—'} sub="most time today" accent={primaryFocus?.color} />
          <SummaryCard label="Most Neglected" value={neglected?.shortName ?? '—'} sub="vs weekly target" accent="#ef4444" />
        </div>
      </div>

      {/* Today's Progress Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--color-text-primary)' }}>
            Today's Progress
          </h2>
          <Link to="/log" 
                className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
                style={{ 
                  background: 'linear-gradient(135deg, #2563eb, #4f46e5)', 
                  color: 'white',
                  boxShadow: '0 4px 12px #2563eb44'
                }}>
            + Log Entry
          </Link>
        </div>
        {todayEntries.length === 0 ? (
          <div className="rounded-2xl p-8 text-center relative overflow-hidden group hover:scale-[1.02] transition-all duration-300" 
               style={{ 
                 backgroundColor: 'var(--color-card)', 
                 border: '2px dashed var(--color-border-bright)',
                 boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
               }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-5 group-hover:opacity-10 transition-opacity" />
            <p className="text-base font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Nothing logged yet today
            </p>
            <Link to="/log" className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105"
                  style={{ 
                    background: 'linear-gradient(135deg, #2563eb, #4f46e5)', 
                    color: 'white',
                    boxShadow: '0 4px 16px #2563eb55'
                  }}>
              Start your first entry →
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl p-8" 
               style={{ 
                 backgroundColor: 'var(--color-card)', 
                 border: '1px solid var(--color-border)',
                 boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
               }}>
            <DailyPieChart todayTotals={todayTotals} todayMinutes={todayMinutes} />
          </div>
        )}
      </section>

      {/* Weekly Overview Section */}
      <section>
        <h2 className="text-lg font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--color-text-primary)' }}>
          This Week's Overview
        </h2>
        <div className="rounded-2xl p-6" 
             style={{ 
               backgroundColor: 'var(--color-card)', 
               border: '1px solid var(--color-border)',
               boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
             }}>
          <WeeklyBarChart entries={weekEntries} showIdeal title="Minutes per category (Mon–Sun)" />
        </div>
      </section>

      {/* Networking Section */}
      <section>
        <h2 className="text-lg font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Networking Activity
        </h2>
        <div className="rounded-2xl p-6" 
             style={{ 
               backgroundColor: 'var(--color-card)', 
               border: '1px solid var(--color-border)',
               boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
             }}>
          <NetworkingTracker weekEntries={weekEntries} />
        </div>
      </section>
    </div>
  )
}
