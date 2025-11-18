import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null)
  const [online, setOnline] = useState(false)
  const [profile, setProfile] = useState({ name: '', specialization: '', years_experience: 0, qualifications: '', registration_number: '' })
  const [patients, setPatients] = useState([])
  const [records, setRecords] = useState([])
  const [rx, setRx] = useState([{ name: '', dose: '', notes: '' }])
  const [interactionWarnings, setInteractionWarnings] = useState([])

  useEffect(() => {
    // Load one doctor for demo
    const loadDoctor = async () => {
      const res = await fetch(`${API_BASE}/api/users?role=doctor`)
      const data = await res.json()
      const d = data.items?.[0]
      if (d) {
        setDoctor(d)
        setOnline(!!d.online_status)
        setProfile({
          name: d.name || '',
          specialization: d.specialization || '',
          years_experience: d.years_experience || 0,
          qualifications: (d.qualifications || []).join(', '),
          registration_number: d.registration_number || ''
        })
      }
    }
    loadDoctor()
  }, [])

  const toggleAvailability = async () => {
    if (!doctor) return
    const res = await fetch(`${API_BASE}/api/doctors/${doctor._id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ online_status: !online })
    })
    const data = await res.json()
    setOnline(data.online_status)
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    if (!doctor) return
    // Minimal patch; in real app, dedicated endpoint
    const res = await fetch(`${API_BASE}/api/users?role=doctor`) // refetch only
    await res.json()
    alert('Saved (demo)')
  }

  const addRxRow = () => setRx(prev => [...prev, { name: '', dose: '', notes: '' }])
  const updateRx = (idx, field, value) => setRx(prev => prev.map((r,i)=> i===idx? {...r,[field]:value} : r))
  const removeRx = (idx) => setRx(prev => prev.filter((_,i)=> i!==idx))

  useEffect(() => {
    const checkInteractions = async () => {
      if (rx.length === 0) { setInteractionWarnings([]); return }
      // Very naive check using medicine search to get interactions list
      const names = rx.map(r => r.name).filter(Boolean)
      let warnings = []
      for (const n of names) {
        const res = await fetch(`${API_BASE}/api/medicines/search?q=${encodeURIComponent(n)}`)
        const data = await res.json()
        const m = data.items?.[0]
        if (m && Array.isArray(m.interactions) && m.interactions.length>0) {
          warnings = warnings.concat(m.interactions)
        }
      }
      setInteractionWarnings(Array.from(new Set(warnings)))
    }
    checkInteractions()
  }, [rx])

  const submitRecord = async (e) => {
    e.preventDefault()
    if (!doctor) return
    const patientId = patients[0]?._id || 'demo-patient'
    const record = {
      patient_id: patientId,
      doctor_id: doctor._id,
      visit_date: new Date().toISOString(),
      diagnosis: 'General checkup',
      prescription: rx.filter(r=>r.name).map(r=>({ name: r.name, dose: r.dose, notes: r.notes })),
      vitals: { BP: '120/80', HR: 72 },
      privacy_level: 'doctor'
    }
    const res = await fetch(`${API_BASE}/api/records`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record) })
    const data = await res.json()
    alert('Record saved: ' + data.id)
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Doctor Dashboard</h3>
        <button onClick={toggleAvailability} className={`px-3 py-1 rounded ${online? 'bg-green-600':'bg-slate-600'} text-white`}>{online? 'Online':'Offline'}</button>
      </div>

      <form onSubmit={saveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Name</label>
          <input value={profile.name} onChange={e=>setProfile({...profile, name: e.target.value})} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm">Specialization</label>
          <input value={profile.specialization} onChange={e=>setProfile({...profile, specialization: e.target.value})} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm">Years Experience</label>
          <input type="number" value={profile.years_experience} onChange={e=>setProfile({...profile, years_experience: Number(e.target.value)})} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm">Qualifications (comma-separated)</label>
          <input value={profile.qualifications} onChange={e=>setProfile({...profile, qualifications: e.target.value})} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm">Registration Number</label>
          <input value={profile.registration_number} onChange={e=>setProfile({...profile, registration_number: e.target.value})} className="w-full border rounded p-2" />
        </div>
        <div className="sm:col-span-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Profile</button>
        </div>
      </form>

      <div className="space-y-2">
        <h4 className="font-semibold">Prescription Pad</h4>
        {rx.map((r, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input placeholder="Medicine" value={r.name} onChange={e=>updateRx(idx, 'name', e.target.value)} className="flex-1 border rounded p-2" />
            <input placeholder="Dose" value={r.dose} onChange={e=>updateRx(idx, 'dose', e.target.value)} className="w-32 border rounded p-2" />
            <input placeholder="Notes" value={r.notes} onChange={e=>updateRx(idx, 'notes', e.target.value)} className="flex-1 border rounded p-2" />
            <button onClick={()=>removeRx(idx)} className="px-2 py-1 bg-red-600 text-white rounded">X</button>
          </div>
        ))}
        <button onClick={addRxRow} className="px-3 py-1 bg-slate-200 rounded">Add</button>
        {interactionWarnings.length>0 && (
          <div className="text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded">
            <p className="font-medium">Warnings</p>
            <ul className="list-disc ml-5 text-sm">
              {interactionWarnings.map((w,i)=>(<li key={i}>{w}</li>))}
            </ul>
          </div>
        )}
        <button onClick={submitRecord} className="px-4 py-2 bg-green-600 text-white rounded">Save Consultation</button>
      </div>
    </div>
  )
}
