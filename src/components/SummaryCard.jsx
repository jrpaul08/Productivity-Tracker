// Props: label, value, sub, accent (optional hex color for left border glow)
export default function SummaryCard({ label, value, sub, accent }) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-2 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderLeft: accent ? `3px solid ${accent}` : '1px solid var(--color-border)',
      }}
    >
      {accent && (
        <div
          className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 0% 50%, ${accent}, transparent 70%)` }}
        />
      )}
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </span>
      <span className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
      {sub && <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{sub}</span>}
    </div>
  )
}
