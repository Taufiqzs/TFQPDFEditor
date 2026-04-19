import { useState } from 'react'
import { Scissors, Download } from 'lucide-react'
import DropZone from '../components/DropZone'
import { usePdfTool } from '../hooks/usePdfTool'

export default function SplitPDF() {
  const { files, setFiles, loading, error, downloadUrl, process, reset } = usePdfTool('split')
  const [pages, setPages] = useState('')

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Scissors size={26} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Split PDF</h1>
        <p className="text-gray-500 mt-1">Extract specific pages or split into individual pages.</p>
      </div>

      {!downloadUrl ? (
        <>
          <DropZone onDrop={(f) => setFiles([f[0]])} accept={{ 'application/pdf': ['.pdf'] }} />
          {files.length > 0 && (
            <div className="mt-4 bg-white border rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-gray-700">Selected: {files[0].name}</p>
              <label className="block text-sm text-gray-600">
                Pages to extract <span className="text-gray-400">(e.g. 1,3,5-8 — leave blank for all)</span>
              </label>
              <input
                type="text"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="1,3,5-8"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          <button
            onClick={() => process({ pages })}
            disabled={!files.length || loading}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Splitting…' : 'Split PDF'}
          </button>
        </>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-green-600 font-medium">Split complete!</p>
          <a href={downloadUrl} download="split.zip" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <Download size={18} /> Download ZIP
          </a>
          <button onClick={reset} className="block mx-auto text-sm text-gray-500 hover:text-gray-700 mt-2">Start over</button>
        </div>
      )}
    </div>
  )
}
