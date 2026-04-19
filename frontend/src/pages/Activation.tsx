import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import axios from 'axios'

export default function Activation() {
  const [key, setKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleActivate() {
    if (!key.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post('/api/activate', { key: key.trim() })
      if (res.data.ok) {
        navigate('/', { replace: true })
        window.location.reload()
      } else {
        setError(res.data.message || 'Activation failed.')
      }
    } catch {
      setError('Could not connect to activation server.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleActivate()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md text-center">
        <div className="w-14 h-14 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <KeyRound size={26} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Activate TFQPDFEditor</h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter the license key you received after purchase.
        </p>
        <input
          type="text"
          value={key}
          onChange={e => setKey(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          className="w-full border rounded-xl px-4 py-3 text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          maxLength={19}
          spellCheck={false}
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          onClick={handleActivate}
          disabled={!key.trim() || loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? 'Activating…' : 'Activate'}
        </button>
        <p className="text-xs text-gray-400 mt-4">
          Purchased on itch.io? Check your email for the license key.
        </p>
      </div>
    </div>
  )
}
