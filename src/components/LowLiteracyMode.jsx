import { useEffect } from 'react'

export default function LowLiteracyMode({ enabled }) {
  useEffect(() => {
    const root = document.documentElement
    if (enabled) {
      root.classList.add('low-literacy')
    } else {
      root.classList.remove('low-literacy')
    }
  }, [enabled])
  return null
}

// Tailwind helpers (to be used in components when low-literacy is on):
// - Use classes like 'text-xl md:text-2xl', 'p-4', 'space-y-4'
// - Prefer icons and short labels
