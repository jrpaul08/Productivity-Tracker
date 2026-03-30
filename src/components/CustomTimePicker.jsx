import { useState, useRef, useEffect } from 'react'

export default function CustomTimePicker({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedHour, setSelectedHour] = useState('09')
  const [selectedMinute, setSelectedMinute] = useState('00')
  const dropdownRef = useRef(null)

  // Parse value on mount or when value changes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':')
      setSelectedHour(h)
      setSelectedMinute(m)
    }
  }, [value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

  const handleHourClick = (hour) => {
    setSelectedHour(hour)
    onChange(`${hour}:${selectedMinute}`)
  }

  const handleMinuteClick = (minute) => {
    setSelectedMinute(minute)
    onChange(`${selectedHour}:${minute}`)
  }

  const displayValue = value || `${selectedHour}:${selectedMinute}`

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full transition-all duration-200"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: error ? '1px solid #ef4444' : '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          borderRadius: '0.75rem',
          padding: '0.625rem 0.875rem',
          fontSize: '0.875rem',
          outline: 'none',
          textAlign: 'left',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        {displayValue}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 left-0 right-0 rounded-2xl overflow-hidden z-50 animate-slideIn"
          style={{
            backgroundColor: 'var(--color-card)',
            border: '2px solid var(--color-border-bright)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(123, 143, 181, 0.1)',
          }}
        >
          <div className="grid grid-cols-2">
            {/* Hours Column */}
            <div className="border-r" style={{ borderColor: 'var(--color-border-bright)' }}>
              <div className="px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-center border-b"
                   style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)', borderColor: 'var(--color-border-bright)' }}>
                Hours
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleHourClick(hour)}
                    className="w-full px-4 py-2.5 text-center font-mono font-semibold transition-all hover:scale-105"
                    style={{
                      backgroundColor: selectedHour === hour ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                      color: selectedHour === hour ? '#4f46e5' : 'var(--color-text-primary)',
                      borderLeft: selectedHour === hour ? '3px solid #4f46e5' : '3px solid transparent',
                      boxShadow: selectedHour === hour ? '0 0 20px rgba(79, 70, 229, 0.3)' : 'none',
                    }}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes Column */}
            <div>
              <div className="px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-center border-b"
                   style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)', borderColor: 'var(--color-border-bright)' }}>
                Minutes
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => handleMinuteClick(minute)}
                    className="w-full px-4 py-2.5 text-center font-mono font-semibold transition-all hover:scale-105"
                    style={{
                      backgroundColor: selectedMinute === minute ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                      color: selectedMinute === minute ? '#8b5cf6' : 'var(--color-text-primary)',
                      borderLeft: selectedMinute === minute ? '3px solid #8b5cf6' : '3px solid transparent',
                      boxShadow: selectedMinute === minute ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none',
                    }}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="px-4 py-3 border-t" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-bright)' }}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full font-semibold text-xs py-2 rounded-xl transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', color: 'white', boxShadow: '0 4px 12px #2563eb44' }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
