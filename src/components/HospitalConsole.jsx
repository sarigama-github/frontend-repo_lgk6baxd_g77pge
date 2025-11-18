import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function HospitalConsole() {
  const [facilityId, setFacilityId] = useState('facility-001')
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [medicineId, setMedicineId] = useState('')
  const [quantity, setQuantity] = useState(0)

  const load = async () => {
    const res = await fetch(`${API_BASE}/api/stock?facility_id=${facilityId}`)
    const data = await res.json()
    setItems(data.items || [])
  }

  useEffect(() => { load() }, [facilityId])

  const addStock = async (e) => {
    e.preventDefault()
    const payload = { facility_id: facilityId, medicine_id: medicineId || name, quantity: Number(quantity), threshold: 5 }
    const res = await fetch(`${API_BASE}/api/stock`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    await res.json()
    setName(''); setMedicineId(''); setQuantity(0)
    load()
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow border space-y-3">
      <h3 className="text-lg font-bold">Hospital Inventory</h3>

      <form onSubmit={addStock} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <input placeholder="Medicine ID or Name" value={medicineId} onChange={e=>setMedicineId(e.target.value)} className="border rounded p-2" />
        <input placeholder="Alt name" value={name} onChange={e=>setName(e.target.value)} className="border rounded p-2" />
        <input type="number" placeholder="Qty" value={quantity} onChange={e=>setQuantity(e.target.value)} className="border rounded p-2" />
        <button className="bg-blue-600 text-white rounded px-4">Add/Update</button>
      </form>

      <ul className="divide-y">
        {items.map(it => (
          <li key={it._id} className="py-2 flex items-center justify-between">
            <div>
              <p className="font-medium">{it.medicine_id}</p>
              <p className="text-xs text-slate-500">Qty: {it.quantity}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
