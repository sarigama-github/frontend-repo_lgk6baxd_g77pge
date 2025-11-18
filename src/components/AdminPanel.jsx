import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'patient', language: 'en' })

  const load = async () => {
    const res = await fetch(`${API_BASE}/api/users`)
    const data = await res.json()
    setUsers(data.items || [])
  }

  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/api/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    await res.json()
    setForm({ name: '', email: '', phone: '', role: 'patient', language: 'en' })
    load()
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow border space-y-4">
      <h3 className="text-lg font-bold">Admin: User Management</h3>
      <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="border rounded p-2" />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="border rounded p-2" />
        <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="border rounded p-2" />
        <select value={form.role} onChange={e=>setForm({...form, role: e.target.value})} className="border rounded p-2">
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="hospital">Hospital</option>
          <option value="government">Government</option>
          <option value="admin">Admin</option>
        </select>
        <select value={form.language} onChange={e=>setForm({...form, language: e.target.value})} className="border rounded p-2">
          <option value="en">English</option>
          <option value="te">తెలుగు</option>
          <option value="hi">हिंदी</option>
          <option value="ta">தமிழ்</option>
          <option value="ur">اردو</option>
        </select>
        <button className="bg-blue-600 text-white rounded px-4">Create</button>
      </form>
      <ul className="divide-y">
        {users.map(u => (
          <li key={u._id} className="py-2 flex items-center justify-between">
            <div>
              <p className="font-medium">{u.name} <span className="text-xs uppercase text-slate-500">({u.role})</span></p>
              <p className="text-xs text-slate-500">{u.email} • {u.phone}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
