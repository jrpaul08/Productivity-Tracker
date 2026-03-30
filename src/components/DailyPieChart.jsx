import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { CATEGORIES, CATEGORY_MAP } from '../constants/categories.js'
import { formatDuration } from '../utils/calculations.js'

const DAILY_GOAL = 360 // 6 hours in minutes

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0]
  
  if (data.name === 'Unproductive Time') {
    return (
      <div 
        className="rounded-xl px-4 py-3 text-xs backdrop-blur-sm" 
        style={{ 
          backgroundColor: 'rgba(26, 35, 55, 0.95)', 
          border: '1px solid rgba(123, 143, 181, 0.3)', 
          color: '#e8edf8',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}
      >
        <p className="font-bold mb-1" style={{ color: '#e8edf8' }}>{data.name}</p>
        <p className="font-semibold" style={{ color: '#7b8fb5' }}>
          {formatDuration(data.value)} to reach 6h goal
        </p>
      </div>
    )
  }
  
  return (
    <div 
      className="rounded-xl px-4 py-3 text-xs backdrop-blur-sm" 
      style={{ 
        backgroundColor: 'rgba(26, 35, 55, 0.95)', 
        border: '1px solid rgba(123, 143, 181, 0.3)', 
        color: '#e8edf8',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
      }}
    >
      <p className="font-bold mb-2 text-sm">{data.name}</p>
      <p className="font-semibold flex items-center gap-2" style={{ color: data.payload.fill }}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.fill }} />
        {formatDuration(data.value)} ({((data.value / DAILY_GOAL) * 100).toFixed(1)}%)
      </p>
    </div>
  )
}

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  
  // Don't show label for very small slices
  if (percent < 0.05) return null
  
  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-bold"
      style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
    >
      {name}
    </text>
  )
}

export default function DailyPieChart({ todayTotals, todayMinutes }) {
  // Build data for pie chart
  const categoryData = CATEGORIES
    .map(cat => ({
      name: cat.name,
      value: todayTotals[cat.name] || 0,
      color: cat.color,
    }))
    .filter(item => item.value > 0)
  
  // Add remaining time slice if under goal
  const remaining = Math.max(0, DAILY_GOAL - todayMinutes)
  if (remaining > 0) {
    categoryData.push({
      name: 'Unproductive Time',
      value: remaining,
      color: 'var(--color-border)',
    })
  }
  
  const percentComplete = Math.min((todayMinutes / DAILY_GOAL) * 100, 100)
  const isGoalMet = todayMinutes >= DAILY_GOAL
  
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      {/* Pie Chart */}
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <defs>
              {categoryData.map((entry, index) => (
                entry.name !== 'Remaining' && (
                  <linearGradient key={index} id={`pieGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.8} />
                  </linearGradient>
                )
              ))}
              <radialGradient id="centerGradient" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(31, 41, 55, 0.8)" />
                <stop offset="100%" stopColor="rgba(21, 29, 46, 0.95)" />
              </radialGradient>
            </defs>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={<CustomLabel />}
              innerRadius={85}
              outerRadius={130}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={false}
            >
              {categoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.name === 'Unproductive Time' ? 'var(--color-border)' : `url(#pieGrad-${index})`}
                  stroke={entry.name === 'Unproductive Time' ? 'var(--color-border-bright)' : entry.color}
                  strokeWidth={2}
                  opacity={entry.name === 'Unproductive Time' ? 0.3 : 1}
                />
              ))}
            </Pie>
            {/* Center circle background */}
            <circle 
              cx="50%" 
              cy="50%" 
              r="85" 
              fill="url(#centerGradient)"
              stroke="var(--color-border-bright)"
              strokeWidth="1"
            />
            <Tooltip 
              content={<CustomTooltip />} 
              position={{ x: 'auto', y: 'auto' }}
              allowEscapeViewBox={{ x: true, y: true }}
              offset={30}
              wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
              {formatDuration(todayMinutes)}
            </div>
            <div className="text-xs font-bold uppercase tracking-[0.15em] mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              of 6h goal
            </div>
            <div className="mt-2 text-sm font-semibold" 
                 style={{ color: isGoalMet ? '#22c55e' : 'var(--color-text-muted)' }}>
              {percentComplete.toFixed(0)}%
              {isGoalMet && ' ✓'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend / Breakdown */}
      <div className="flex-1 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          Today's Breakdown
        </h3>
        {CATEGORIES.map(cat => {
          const minutes = todayTotals[cat.name] || 0
          if (minutes === 0) return null
          const pct = (minutes / DAILY_GOAL) * 100
          return (
            <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl transition-all hover:scale-102" 
                 style={{ backgroundColor: `${cat.color}11`, border: `1px solid ${cat.color}33` }}>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full ring-2 ring-offset-2" 
                     style={{ 
                       backgroundColor: cat.color,
                       boxShadow: `0 0 12px ${cat.color}66`,
                       ringColor: `${cat.color}44`,
                       ringOffsetColor: 'var(--color-card)'
                     }} 
                />
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-mono" style={{ color: cat.color }}>
                  {formatDuration(minutes)}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" 
                      style={{ backgroundColor: `${cat.color}22`, color: cat.color }}>
                  {pct.toFixed(0)}%
                </span>
              </div>
            </div>
          )
        })}
        
        {remaining > 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl opacity-50" 
               style={{ backgroundColor: 'var(--color-surface)', border: '1px dashed var(--color-border-bright)' }}>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--color-border)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                Unproductive Time
              </span>
            </div>
            <span className="text-sm font-bold font-mono" style={{ color: 'var(--color-text-secondary)' }}>
              {formatDuration(remaining)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
