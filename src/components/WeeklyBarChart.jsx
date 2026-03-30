import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts'
import { CATEGORIES } from '../constants/categories.js'
import { getCategoryTotals } from '../utils/calculations.js'

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
      {title && <h3 className="text-sm font-semibold text-gray-600 mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2} barCategoryGap="30%">
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit="m" width={36} />
          <Tooltip formatter={(v, name) => [`${v} min`, name === 'actual' ? 'This week' : 'Weekly target']} />
          {showIdeal && <Legend iconType="square" wrapperStyle={{ fontSize: 11 }} />}
          <Bar dataKey="actual" name="actual" maxBarSize={40}>
            {data.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
          </Bar>
          {showIdeal && (
            <Bar dataKey="target" name="target" maxBarSize={40} fill="transparent" stroke="#9ca3af" strokeDasharray="4 2" strokeWidth={1.5} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
