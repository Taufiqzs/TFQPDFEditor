import { FileStack, X, Download } from 'lucide-react'
import DropZone from '../components/DropZone'
import { usePdfTool } from '../hooks/usePdfTool'

export default function MergePDF() {
  const { files, setFiles, loading, error, downloadUrl, process, reset } = usePdfTool('merge')

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <FileStack size={26} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Merge PDF</h1>
        <p className="text-gray-500 mt-1">Combine multiple PDF files into one document.</p>
      </div>

      {!downloadUrl ? (
        <>
          <DropZone
            onDrop={(f) => setFiles((prev) => [...prev, ...f])}
            accept={{ 'application/pdf': ['.pdf'] }}
            multiple
          />
          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between bg-white border rounded-lg px-4 py-2 text-sm">
                  <span className="truncate text-gray-700">{f.name}</span>
                  <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500 ml-2">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          <button
            onClick={() => process()}
            disabled={files.length < 2 || loading}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Merging…' : `Merge ${files.length} PDFs`}
          </button>
        </>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-green-600 font-medium">Merge complete!</p>
          <a href={downloadUrl} download="merged.pdf" className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <Download size={18} /> Download Merged PDF
          </a>
          <button onClick={reset} className="block mx-auto text-sm text-gray-500 hover:text-gray-700 mt-2">
            Start over
          </button>
        </div>
      )}
    </div>
  )
}
