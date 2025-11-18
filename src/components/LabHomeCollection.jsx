import { useState } from 'react'
import { useAppointmentSync } from '../hooks/useOfflineSync'

export default function LabHomeCollection() {
  const { online, queueAppointment } = useAppointmentSync()
  const [address, setAddress] = useState('')
  const [testName, setTestName] = useState('Blood Test')
  const [status, setStatus] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const payload = {
      patient_id: 'demo-patient',
      doctor_id: 'lab-tech',
      type: 'physical',
      scheduled_time: new Date().toISOString(),
      symptoms: `Home collection: ${testName} @ ${address}`,
      status: 'requested'
    }
    const tempId = await queueAppointment(payload)
    setStatus(online ? 'Submitted and syncing…' : `Saved offline (${tempId}). Will sync automatically when online.`)
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow border space-y-3">
      <h3 className="text-lg font-bold">Book Blood Test at Home</h3>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Test</label>
          <select className="mt-1 w-full border rounded-md p-2" value={testName} onChange={e=>setTestName(e.target.value)}>
            <option>Blood Test</option>
            <option>CBC</option>
            <option>Fasting Glucose</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input className="mt-1 w-full border rounded-md p-2" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Village, Landmark" />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Book Home Collection</button>
      </form>
      {status && <p className="text-sm text-slate-700">{status}</p>}
    </div>
  )
}
