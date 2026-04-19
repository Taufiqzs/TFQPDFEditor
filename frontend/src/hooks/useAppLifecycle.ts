import { useEffect } from 'react'

export function useAppLifecycle() {
  useEffect(() => {
    // Ping every 10s to keep the backend alive
    const interval = setInterval(() => {
      fetch('/api/heartbeat', { method: 'POST' }).catch(() => {})
    }, 10_000)

    // On tab close, send shutdown signal synchronously via sendBeacon
    const handleUnload = () => {
      navigator.sendBeacon('/api/shutdown')
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])
}
