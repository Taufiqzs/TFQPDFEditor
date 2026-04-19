import { useEffect, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href

interface Props {
  file: File
  deletedPages: Set<number>
  onToggle: (pageIndex: number) => void
  onTotalPages: (n: number) => void
}

export default function PDFPageSelector({ file, deletedPages, onToggle, onTotalPages }: Props) {
  const [pageImages, setPageImages] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    setPageImages([])
    async function render() {
      const buf = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise
      if (cancelled) return
      onTotalPages(pdf.numPages)
      const images: string[] = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: canvas.getContext('2d')!, canvas, viewport }).promise
        if (cancelled) return
        images.push(canvas.toDataURL())
        setPageImages([...images])
      }
    }
    render().catch(() => {})
    return () => { cancelled = true }
  }, [file])

  if (pageImages.length === 0) {
    return <p className="text-sm text-gray-400 animate-pulse py-4">Loading pages…</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {pageImages.map((src, i) => {
        const marked = deletedPages.has(i)
        return (
          <div
            key={i}
            onClick={() => onToggle(i)}
            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all select-none ${
              marked ? 'border-red-500' : 'border-gray-200 hover:border-orange-400'
            }`}
          >
            <img src={src} className="w-full h-auto block" alt={`Page ${i + 1}`} />
            {marked && (
              <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                <span className="text-white text-xs font-bold bg-red-500 rounded px-2 py-1">DELETE</span>
              </div>
            )}
            <div className={`text-center text-xs py-1.5 font-medium ${marked ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-white'}`}>
              Page {i + 1}
            </div>
          </div>
        )
      })}
    </div>
  )
}
