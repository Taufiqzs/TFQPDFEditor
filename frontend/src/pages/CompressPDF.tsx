import { Minimize2, Download } from 'lucide-react'
import DropZone from '../components/DropZone'
import PDFPreviewCard from '../components/PDFPreviewCard'
import { usePdfTool } from '../hooks/usePdfTool'

export default function CompressPDF() {
  const { files, setFiles, loading, error, downloadUrl, process, reset } = usePdfTool('compress')

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Minimize2 size={26} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Compress PDF</h1>
        <p className="text-gray-500 mt-1">Reduce PDF file size while preserving quality.</p>
      </div>

      {!downloadUrl ? (
        <>
          <DropZone onDrop={(f) => setFiles([f[0]])} accept={{ 'application/pdf': ['.pdf'] }} />

          {files.length > 0 && (
            <div className="mt-4 flex gap-4 items-center">
              <PDFPreviewCard file={files[0]} />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-800">{files[0].name}</p>
                <p className="text-gray-400 mt-1">{(files[0].size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          <button
            onClick={() => process()}
            disabled={!files.length || loading}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Compressing…' : 'Compress PDF'}
          </button>
        </>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-green-600 font-medium">Compression complete!</p>
          <a href={downloadUrl} download="compressed.pdf" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <Download size={18} /> Download Compressed PDF
          </a>
          <button onClick={reset} className="block mx-auto text-sm text-gray-500 hover:text-gray-700 mt-2">Start over</button>
        </div>
      )}
    </div>
  )
}
