import { useEffect } from 'react'

export default function Toast({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  return (
    <div
      className="fixed bottom-6 right-6 z-50 text-sm font-medium px-5 py-3 rounded-xl flex items-center gap-3"
      style={{ backgroundColor: '#1e2535', border: '1px solid #2a3a58', color: '#e8edf8', boxShadow: '0 8px 32px #00000066' }}
    >
      <span style={{ color: '#22c55e', fontSize: '1rem' }}>✓</span>
      {message}
    </div>
  )
}
