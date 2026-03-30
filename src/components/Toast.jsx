import { useEffect } from 'react'

export default function Toast({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
      <span className="text-green-400">✓</span>
      {message}
    </div>
  )
}
