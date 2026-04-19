import { useState } from 'react'
import { Scissors, Download } from 'lucide-react'
import DropZone from '../components/DropZone'
import PDFPageSelector from '../components/PDFPageSelector'
import { usePdfTool } from '../hooks/usePdfTool'

export default function SplitPDF() {
  const { files, setFiles, loading, error, downloadUrl, process, reset } = usePdfTool('split')
  const [deletedPages, setDeletedPages] = useState<Set<number>>(new Set())
  const [totalPages, setTotalPages] = useState(0)

  function togglePage(i: number) {
    setDeletedPages(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  function handleProcess() {
    const kept = Array.from({ length: totalPages }, (_, i) => i)
      .filter(i => !deletedPages.has(i))
      .map(i => i + 1)
    process({ pages: kept.join(',') })
  }

  function handleReset() {
    reset()
    setDeletedPages(new Set())
    setTotalPages(0)
  }

  function handleChangeFile() {
    setFiles([])
    setDeletedPages(new Set())
    setTotalPages(0)
  }

  const deletedCount = deletedPages.size
  const keptCount = totalPages - deletedCount

  return (
    <div className="max-w-5xl mx-auto px-4 py-14">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Scissors size={26} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Split PDF</h1>
        <p className="text-gray-500 mt-1">Click pages to mark them for deletion, then download the rest.</p>
      </div>

      {!downloadUrl ? (
        <>
          {files.length === 0 && (
            <DropZone onDrop={(f) => setFiles([f[0]])} accept={{ 'application/pdf': ['.pdf'] }} />
          )}

          {files.length > 0 && (
            <>
              <div className="bg-white border rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-gray-800 truncate max-w-[60%]">{files[0].name}</p>
                  <div className="flex items-center gap-3 text-sm">
                    {totalPages > 0 && (
                      <span className="text-gray-400">{totalPages} pages total</span>
                    )}
                    {deletedCount > 0 && (
                      <span className="text-red-500 font-medium">
                        {deletedCount} deleted · {keptCount} kept
                      </span>
                    )}
                  </div>
                </div>
                <PDFPageSelector
                  file={files[0]}
                  deletedPages={deletedPages}
                  onToggle={togglePage}
                  onTotalPages={setTotalPages}
                />
                {totalPages > 0 && (
                  <p className="text-xs text-gray-400 mt-3">Click a page to mark it for deletion. Click again to unmark.</p>
                )}
              </div>
              <button onClick={handleChangeFile} className="mt-2 text-sm text-gray-400 hover:text-gray-600">
                ← Change file
              </button>
            </>
          )}

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <button
            onClick={handleProcess}
            disabled={!files.length || loading || keptCount === 0}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading
              ? 'Processing…'
              : deletedCount > 0
                ? `Delete ${deletedCount} page${deletedCount > 1 ? 's' : ''} & Download`
                : 'Download All Pages'}
          </button>
        </>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-green-600 font-medium">Done!</p>
          <a
            href={downloadUrl}
            download="split.zip"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Download size={18} /> Download ZIP
          </a>
          <button onClick={handleReset} className="block mx-auto text-sm text-gray-500 hover:text-gray-700 mt-2">
            Start over
          </button>
        </div>
      )}
    </div>
  )
}
