import { Image, Download } from 'lucide-react'
import DropZone from '../components/DropZone'
import { usePdfTool } from '../hooks/usePdfTool'

export default function PDFToJPG() {
  const { files, setFiles, loading, error, downloadUrl, process, reset } = usePdfTool('pdf-to-jpg')

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Image size={26} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">PDF to JPG</h1>
        <p className="text-gray-500 mt-1">Convert each PDF page to a JPG image.</p>
      </div>

      {!downloadUrl ? (
        <>
          <DropZone onDrop={(f) => setFiles([f[0]])} accept={{ 'application/pdf': ['.pdf'] }} />
          {files.length > 0 && (
            <p className="mt-3 text-sm text-gray-600 text-center">Selected: <strong>{files[0].name}</strong></p>
          )}
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          <button
            onClick={() => process()}
            disabled={!files.length || loading}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Converting…' : 'Convert to JPG'}
          </button>
        </>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-green-600 font-medium">Conversion complete!</p>
          <a href={downloadUrl} download="pages.zip" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <Download size={18} /> Download ZIP of JPGs
          </a>
          <button onClick={reset} className="block mx-auto text-sm text-gray-500 hover:text-gray-700 mt-2">Start over</button>
        </div>
      )}
    </div>
  )
}
