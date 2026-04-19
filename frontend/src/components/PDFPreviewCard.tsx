import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { FileText } from 'lucide-react'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href

interface Props {
  file: File
}

export default function PDFPreviewCard({ file }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function render() {
      try {
        const buf = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise
        const page = await pdf.getPage(1)
        if (cancelled) return
        const viewport = page.getViewport({ scale: 0.4 })
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: canvas.getContext('2d')!, canvas, viewport }).promise
      } catch {
        setFailed(true)
      }
    }
    render()
    return () => { cancelled = true }
  }, [file])

  const name = file.name.length > 18 ? file.name.slice(0, 16) + '…' : file.name

  return (
    <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-[150px] shrink-0">
      <div className="w-full h-[190px] bg-gray-50 flex items-center justify-center overflow-hidden">
        {failed ? (
          <FileText size={40} className="text-gray-300" />
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>
      <div className="w-full px-2 py-1.5 border-t border-gray-100">
        <p className="text-xs text-gray-600 text-center truncate" title={file.name}>{name}</p>
      </div>
    </div>
  )
}
