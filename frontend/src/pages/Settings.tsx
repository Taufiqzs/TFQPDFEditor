import { useState } from 'react'
import { ShieldOff } from 'lucide-react'
import axios from 'axios'

export default function Settings() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirm, setConfirm] = useState(false)

  async function handleDeactivate() {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post('/api/deactivate')
      if (res.data.ok) {
        window.location.reload()
      } else {
        setError(res.data.message || 'Deactivation failed.')
      }
    } catch {
      setError('Could not connect to license server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-14">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <ShieldOff size={20} className="text-red-500" />
          <h2 className="font-semibold text-gray-800">Deactivate License</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Deactivating releases your license from this machine so you can activate it on another PC.
          You will need to re-enter your key to use the app again on this machine.
        </p>
        {!confirm ? (
          <button
            onClick={() => setConfirm(true)}
            className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Deactivate this machine
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium text-red-600">Are you sure? You will be logged out.</p>
            <div className="flex gap-2">
              <button
                onClick={handleDeactivate}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Deactivating…' : 'Yes, deactivate'}
              </button>
              <button
                onClick={() => setConfirm(false)}
                className="flex-1 border text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    </div>
  )
}
