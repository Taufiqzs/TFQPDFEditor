import { useState } from 'react'
import axios from 'axios'

export function usePdfTool(endpoint: string) {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [resultSize, setResultSize] = useState<number | null>(null)

  async function process(extraData?: Record<string, string>) {
    if (!files.length) return
    setLoading(true)
    setError(null)
    setDownloadUrl(null)
    setResultSize(null)
    try {
      const form = new FormData()
      files.forEach((f) => form.append('files', f))
      if (extraData) Object.entries(extraData).forEach(([k, v]) => form.append(k, v))
      const res = await axios.post(`/api/${endpoint}`, form, { responseType: 'blob' })
      const blob = new Blob([res.data])
      setResultSize(blob.size)
      setDownloadUrl(URL.createObjectURL(blob))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setFiles([])
    setDownloadUrl(null)
    setError(null)
    setResultSize(null)
  }

  return { files, setFiles, loading, error, downloadUrl, resultSize, process, reset }
}
