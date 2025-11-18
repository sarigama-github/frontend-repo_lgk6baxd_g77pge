import { useState, useEffect } from 'react'

const locales = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'ur', label: 'اردو' },
]

export default function LanguageSwitcher({ value, onChange }) {
  const [lang, setLang] = useState(value || localStorage.getItem('lang') || 'en')
  useEffect(() => {
    localStorage.setItem('lang', lang)
    onChange?.(lang)
  }, [lang])

  return (
    <select
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
      value={lang}
      onChange={(e) => setLang(e.target.value)}
    >
      {locales.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  )
}
