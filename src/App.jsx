import { useEffect, useMemo, useState } from 'react'
import LanguageSwitcher from './components/LanguageSwitcher'
import LowLiteracyMode from './components/LowLiteracyMode'
import VoiceAssistantButton from './components/VoiceAssistantButton'
import LabHomeCollection from './components/LabHomeCollection'
import MedicineSearch from './components/MedicineSearch'
import DoctorDashboard from './components/DoctorDashboard'
import HospitalConsole from './components/HospitalConsole'
import GovAnalytics from './components/GovAnalytics'
import AdminPanel from './components/AdminPanel'
import { useAppointmentSync } from './hooks/useOfflineSync'

function useStrings(lang) {
  const [strings, setStrings] = useState({})
  useEffect(() => {
    import(`./i18n/${lang}.json`).then(mod => setStrings(mod))
      .catch(() => import('./i18n/en.json').then(mod => setStrings(mod)))
  }, [lang])
  return strings
}

function App() {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en')
  const [low, setLow] = useState(false)
  const [role, setRole] = useState('patient')
  const t = useStrings(lang)
  const { online, syncing, lastSync } = useAppointmentSync()

  return (
    <div className="min-h-screen bg-slate-50">
      <LowLiteracyMode enabled={low} />
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-5xl mx-auto p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">RH</div>
          <div className="hidden sm:flex items-center gap-2 ml-4">
            <span className="text-sm text-slate-600">Role</span>
            <select className="border rounded p-1" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="hospital">Hospital</option>
              <option value="government">Government</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className={`text-xs px-2 py-1 rounded ${online ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{online ? 'Online' : 'Offline'}</div>
            <LanguageSwitcher value={lang} onChange={setLang} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={low} onChange={e=>setLow(e.target.checked)} />
              <span>Low Literacy</span>
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Patient home grid */}
        {role === 'patient' && (
          <>
            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <button className="aspect-square rounded-xl bg-white shadow border p-3 text-left">
                <div className="text-4xl">🚑</div>
                <div className="font-bold">SOS</div>
                <div className="text-xs text-slate-500">Emergency</div>
              </button>
              <button className="aspect-square rounded-xl bg-white shadow border p-3 text-left">
                <div className="text-4xl">📅</div>
                <div className="font-bold">Appointments</div>
                <div className="text-xs text-slate-500">Tele/Physical</div>
              </button>
              <button className="aspect-square rounded-xl bg-white shadow border p-3 text-left">
                <div className="text-4xl">💊</div>
                <div className="font-bold">Medicines</div>
                <div className="text-xs text-slate-500">Order/Search</div>
              </button>
              <button className="aspect-square rounded-xl bg-white shadow border p-3 text-left">
                <div className="text-4xl">🧪</div>
                <div className="font-bold">Lab Tests</div>
                <div className="text-xs text-slate-500">Home collection</div>
              </button>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
              <LabHomeCollection />
              <MedicineSearch />
            </div>
          </>
        )}

        {role === 'doctor' && (
          <DoctorDashboard />
        )}

        {role === 'hospital' && (
          <HospitalConsole />
        )}

        {role === 'government' && (
          <GovAnalytics />
        )}

        {role === 'admin' && (
          <AdminPanel />
        )}

        <div className="text-xs text-slate-500">{syncing ? 'Syncing…' : lastSync ? `Last sync: ${lastSync.toLocaleString()}` : 'No sync yet'}</div>
      </main>

      <VoiceAssistantButton onTranscript={(txt) => {
        if (/medicine|drug|tablet/i.test(txt)) {
          alert('Opening Medicines search')
        } else if (/lab|test|blood/i.test(txt)) {
          alert('Opening Lab tests')
        } else if (/sos|help|emergency/i.test(txt)) {
          alert('Triggering SOS')
        } else {
          alert(`Heard: ${txt}`)
        }
      }} />
    </div>
  )
}

export default App
