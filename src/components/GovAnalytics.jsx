import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function GovAnalytics() {
  const [summary, setSummary] = useState({ appointments: [], users_by_role: [] })

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_BASE}/api/analytics/summary?days=14`)
      const data = await res.json()
      setSummary(data)
    }
    load()
  }, [])

  return (
    <div className="p-4 bg-white rounded-xl shadow border space-y-4">
      <h3 className="text-lg font-bold">Government Analytics</h3>

      <div>
        <h4 className="font-semibold mb-2">Appointments (last 14 days)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {summary.appointments.map((d) => (
            <div key={d.date} className="p-2 bg-slate-100 rounded">
              <p className="text-xs text-slate-500">{d.date}</p>
              <p className="text-lg font-bold">{d.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Users by Role</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {summary.users_by_role.map((r) => (
            <div key={r.role} className="p-2 bg-slate-100 rounded text-center">
              <p className="text-xs uppercase text-slate-500">{r.role}</p>
              <p className="text-lg font-bold">{r.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
