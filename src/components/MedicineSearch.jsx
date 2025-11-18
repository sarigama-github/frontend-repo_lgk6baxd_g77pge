import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function MedicineSearch() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])
  const [facilityId, setFacilityId] = useState('facility-001')
  const [stock, setStock] = useState({})

  useEffect(() => {
    const fetchStock = async () => {
      const res = await fetch(`${API_BASE}/api/stock/check?facility_id=${facilityId}`)
      const data = await res.json()
      const map = {}
      data.stocks?.forEach(s => {
        map[s.medicine_id] = s.quantity
      })
      setStock(map)
    }
    fetchStock()
  }, [facilityId])

  const search = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/api/medicines/search?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setItems(data.items || [])
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow border space-y-3">
      <h3 className="text-lg font-bold">Search Medicines</h3>
      <form onSubmit={search} className="flex gap-2">
        <input className="flex-1 border rounded-md p-2" placeholder="Paracetamol" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 rounded-lg">Search</button>
      </form>
      <ul className="divide-y">
        {items.map(m => (
          <li key={m._id} className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{m.name} {m.strength ? `(${m.strength})` : ''}</p>
              <p className="text-xs text-slate-500">{m.generic_name || ''}</p>
            </div>
            <div className="text-sm">
              <span className={`px-2 py-1 rounded ${stock[m._id] > 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {stock[m._id] > 0 ? `Local: ${stock[m._id]}` : 'Check central stock'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
