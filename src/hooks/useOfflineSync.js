import { useEffect, useState, useCallback } from 'react'
import { addAppointmentToOutbox, getAllOutboxAppointments, clearOutboxAppointments } from '../lib/indexedDB'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export function useNetworkStatus() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])
  return online
}

export function useAppointmentSync() {
  const online = useNetworkStatus()
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)

  const queueAppointment = useCallback(async (payload) => {
    const tempId = `appt_${Date.now()}_${Math.random().toString(36).slice(2,8)}`
    await addAppointmentToOutbox({ tempId, payload, createdAt: Date.now() })
    return tempId
  }, [])

  const pushOutbox = useCallback(async () => {
    if (!online || syncing) return
    setSyncing(true)
    try {
      const items = await getAllOutboxAppointments()
      if (items.length === 0) { setSyncing(false); return }
      const appointments = items.map(x => ({ ...x.payload, offline_temp_id: x.tempId }))
      const res = await fetch(`${API_BASE}/api/appointments/bulk_sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointments }),
      })
      if (!res.ok) throw new Error('Sync failed')
      const data = await res.json()
      const successIds = (data.inserted || []).map(r => r.offline_temp_id)
      if (successIds.length) await clearOutboxAppointments(successIds)
      setLastSync(new Date())
    } catch (e) {
      // keep items for next attempt
      console.error('Sync error', e)
    } finally {
      setSyncing(false)
    }
  }, [online, syncing])

  useEffect(() => {
    if (online) {
      pushOutbox()
    }
  }, [online, pushOutbox])

  return { online, syncing, lastSync, queueAppointment, pushOutbox }
}
