import { FileImage, Download } from 'lucide-react'
import DropZone from '../components/DropZone'
import SortablePreviewGrid from '../components/SortablePreviewGrid'
import { usePdfTool } from '../hooks/usePdfTool'

export default function JPGToPDF() {
  const { files, setFiles, loading, error, downloadUrl, process, reset } = usePdfTool('jpg-to-pdf')

  return (
    <div className="max-w-5xl mx-auto px-4 py-14">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-purple-100 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <FileImage size={26} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">JPG to PDF</h1>
        <p className="text-gray-500 mt-1">Turn one or more images into a PDF document. Drag to reorder.</p>
      </div>

      {!downloadUrl ? (
        <>
          <DropZone
            onDrop={(f) => setFiles((prev) => [...prev, ...f])}
            accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
            multiple
            label="image"
          />

          {files.length > 0 && (
            <SortablePreviewGrid files={files} setFiles={setFiles} />
          )}

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <button
            onClick={() => process()}
            disabled={!files.length || loading}
            className="mt-6 w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Converting…' : `Convert ${files.length || ''} image${files.length !== 1 ? 's' : ''} to PDF`}
          </button>
        </>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-green-600 font-medium">Conversion complete!</p>
          <a href={downloadUrl} download="images.pdf" className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <Download size={18} /> Download PDF
          </a>
          <button onClick={reset} className="block mx-auto text-sm text-gray-500 hover:text-gray-700 mt-2">Start over</button>
        </div>
      )}
    </div>
  )
}
