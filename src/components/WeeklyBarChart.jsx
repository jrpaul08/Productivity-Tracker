import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts'
import { CATEGORIES } from '../constants/categories.js'
import { getCategoryTotals } from '../utils/calculations.js'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: '#1a2337', border: '1px solid #2a3a58', color: '#e8edf8' }}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill !== 'transparent' ? p.fill : '#7b8fb5' }}>
          {p.name === 'actual' ? 'This week' : 'Target'}: {p.value} min
        </p>
      ))}
    </div>
  )
}

export default function WeeklyBarChart({ entries, showIdeal = true, title }) {
  const totals = getCategoryTotals(entries)
  const data = CATEGORIES.map(cat => ({
    name: cat.shortName,
    actual: totals[cat.name] || 0,
    target: showIdeal && cat.dailyIdeal ? cat.dailyIdeal * 5 : undefined,
    color: cat.color,
  }))

  return (
    <div>
      {title && <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-secondary)' }}>{title}</h3>}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2} barCategoryGap="30%">
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7b8fb5' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#7b8fb5' }} unit="m" width={36} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e2a4222' }} />
          {showIdeal && <Legend iconType="square" wrapperStyle={{ fontSize: 11, color: '#7b8fb5' }} />}
          <Bar dataKey="actual" name="actual" maxBarSize={40} radius={[3, 3, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Bar>
          {showIdeal && (
            <Bar dataKey="target" name="target" maxBarSize={40} fill="transparent" stroke="#3d4f6e" strokeDasharray="4 2" strokeWidth={1.5} radius={[3, 3, 0, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
