import { useRef, useState } from 'react'

export default function VoiceAssistantButton({ onTranscript }) {
  const recRef = useRef(null)
  const [listening, setListening] = useState(false)

  const start = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition not supported on this device')
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = (localStorage.getItem('lang') || 'en') === 'en' ? 'en-US' : 'en-IN'
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript
      onTranscript?.(text)
    }
    rec.onend = () => setListening(false)
    rec.start()
    recRef.current = rec
    setListening(true)
  }

  const stop = () => {
    recRef.current?.stop()
    setListening(false)
  }

  return (
    <button
      onClick={listening ? stop : start}
      className={`fixed bottom-6 right-6 rounded-full px-5 py-4 shadow-lg text-white focus:outline-none focus:ring-4 transition ${listening ? 'bg-red-600' : 'bg-blue-600'}`}
      aria-label="Voice assistant"
    >
      {listening ? '● Listening' : '🎤 Speak'}
    </button>
  )
}
