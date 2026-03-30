import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Label, Cell } from 'recharts'
import { CATEGORIES } from '../constants/categories.js'
import { getCategoryTotals } from '../utils/calculations.js'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
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
      <p className="flex items-center gap-2 font-semibold" style={{ color: data.color }}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
        Logged: {data.actual} min
      </p>
      {data.target && (
        <p className="flex items-center gap-2 font-semibold" style={{ color: data.color, opacity: 0.7 }}>
          <span className="w-2 h-2 rounded-full border-2 border-dashed" style={{ borderColor: data.color }} />
          Target: {data.target} min
        </p>
      )}
    </div>
  )
}

// Custom shape that draws both target and actual bars overlaid
const CustomBar = (props) => {
  const { x, y, width, height, payload, background } = props
  const { target, actual, color, maxValue } = payload
  
  // Get chart dimensions from background
  const chartBottom = background?.y + background?.height
  const chartHeight = background?.height
  
  if (!chartBottom || !chartHeight || !maxValue) {
    return null
  }
  
  // Calculate scale factor: pixels per minute based on chart's max value
  const scale = chartHeight / maxValue
  
  // Calculate bar dimensions based on actual values
  const targetHeight = target * scale
  const actualHeight = actual * scale
  const targetY = chartBottom - targetHeight
  const actualY = chartBottom - actualHeight
  
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={0.8} />
        </linearGradient>
        <filter id={`shadow-${color.replace('#', '')}`}>
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor={color} floodOpacity="0.4"/>
        </filter>
      </defs>
      
      {/* Target bar (background) */}
      {target > 0 && (
        <rect
          x={x}
          y={targetY}
          width={width}
          height={targetHeight}
          fill={color}
          fillOpacity={0.25}
          stroke={color}
          strokeWidth={2}
          strokeDasharray="6 3"
          strokeOpacity={0.6}
          rx={8}
        />
      )}
      
      {/* Actual bar (foreground) */}
      {actual > 0 && (
        <rect
          x={x}
          y={actualY}
          width={width}
          height={actualHeight}
          fill={`url(#grad-${color.replace('#', '')})`}
          rx={8}
          filter={`url(#shadow-${color.replace('#', '')})`}
        />
      )}
    </g>
  )
}

export default function WeeklyBarChart({ entries, showIdeal = true, title }) {
  const totals = getCategoryTotals(entries)
  
  // Find max value for proper scaling
  const tempData = CATEGORIES.map(cat => ({
    actual: totals[cat.name] || 0,
    target: showIdeal && cat.dailyIdeal ? cat.dailyIdeal * 5 : 0,
  }))
  const maxValue = Math.max(...tempData.map(d => Math.max(d.actual, d.target || 0)), 1)
  
  const data = CATEGORIES.map(cat => ({
    name: cat.shortName,
    actual: totals[cat.name] || 0,
    target: showIdeal && cat.dailyIdeal ? cat.dailyIdeal * 5 : 0,
    color: cat.color,
    maxValue: maxValue,  // Pass maxValue to custom shape
  }))

  return (
    <div>
      {title && (
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ left: 10, bottom: 45, right: 10 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#7b8fb5', fontWeight: 600 }} 
            axisLine={false} 
            tickLine={false} 
            dy={8}
          >
            <Label 
              value="Tasks" 
              position="bottom" 
              offset={25}
              style={{ fontSize: 12, fill: '#7b8fb5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }} 
            />
          </XAxis>
          <YAxis 
            domain={[0, maxValue]}
            tick={{ fontSize: 11, fill: '#7b8fb5', fontWeight: 500 }} 
            width={50} 
            axisLine={false} 
            tickLine={false}
            dx={-4}
          >
            <Label 
              value="Minutes" 
              angle={-90} 
              position="left" 
              offset={0}
              style={{ fontSize: 12, fill: '#7b8fb5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textAnchor: 'middle' }} 
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e2a4233' }} />
          {/* Use a single Bar with custom shape that draws both overlaid */}
          <Bar 
            dataKey="actual"
            shape={<CustomBar />}
            barSize={52}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
