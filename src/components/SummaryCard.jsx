// Props: label, value, sub, accent (optional hex color for left border glow)
export default function SummaryCard({ label, value, sub, accent }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-2 relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderLeft: accent ? `4px solid ${accent}` : '1px solid var(--color-border)',
        boxShadow: accent 
          ? `0 4px 20px ${accent}22, 0 0 0 1px ${accent}11` 
          : '0 2px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      {accent && (
        <div
          className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-20"
          style={{ background: `radial-gradient(ellipse at 0% 50%, ${accent}, transparent 70%)` }}
        />
      )}
      <span className="text-xs font-bold uppercase tracking-[0.15em] relative z-10" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </span>
      <span className="text-2xl font-bold relative z-10 bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent truncate">
        {value}
      </span>
      {sub && <span className="text-xs relative z-10 font-medium" style={{ color: 'var(--color-text-muted)' }}>{sub}</span>}
    </div>
  )
}
