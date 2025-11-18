// Minimal IndexedDB helper without external dependencies
// DB: ruralHealth, Stores: outbox_appointments

const DB_NAME = 'ruralHealth'
const DB_VERSION = 1
const OUTBOX = 'outbox_appointments'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(OUTBOX)) {
        db.createObjectStore(OUTBOX, { keyPath: 'tempId' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function addAppointmentToOutbox(record) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OUTBOX, 'readwrite')
    const store = tx.objectStore(OUTBOX)
    store.put(record)
    tx.oncomplete = () => resolve(true)
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAllOutboxAppointments() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OUTBOX, 'readonly')
    const store = tx.objectStore(OUTBOX)
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function clearOutboxAppointments(tempIds) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OUTBOX, 'readwrite')
    const store = tx.objectStore(OUTBOX)
    Promise.all(tempIds.map(id => new Promise((res, rej) => {
      const delReq = store.delete(id)
      delReq.onsuccess = () => res(true)
      delReq.onerror = () => rej(delReq.error)
    })) ).then(() => resolve(true)).catch(reject)
  })
}
