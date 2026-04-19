import { useState } from 'react'
import { Minimize2, Download, Zap, CheckCircle, Feather } from 'lucide-react'
import DropZone from '../components/DropZone'
import PDFPreviewCard from '../components/PDFPreviewCard'
import { usePdfTool } from '../hooks/usePdfTool'

type Level = 'extreme' | 'recommended' | 'low'

const levels: { id: Level; label: string; desc: string; Icon: typeof Zap; ring: string; bg: string; iconColor: string }[] = [
  {
    id: 'extreme',
    label: 'Extreme Compression',
    desc: 'Maximum size reduction.',
    Icon: Zap,
    ring: 'border-red-500 bg-red-50',
    bg: 'border-gray-200 hover:border-red-300',
    iconColor: 'text-red-500',
  },
  {
    id: 'recommended',
    label: 'Recommended',
    desc: 'Best balance of size and quality.',
    Icon: CheckCircle,
    ring: 'border-green-500 bg-green-50',
    bg: 'border-gray-200 hover:border-green-300',
    iconColor: 'text-green-500',
  },
  {
    id: 'low',
    label: 'Low Compression',
    desc: 'Minor reduction, full quality.',
    Icon: Feather,
    ring: 'border-blue-500 bg-blue-50',
    bg: 'border-gray-200 hover:border-blue-300',
    iconColor: 'text-blue-500',
  },
]

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  return (bytes / 1024).toFixed(1) + ' KB'
}

export default function CompressPDF() {
  const { files, setFiles, loading, error, downloadUrl, resultSize, process, reset } = usePdfTool('compress')
  const [level, setLevel] = useState<Level>('recommended')
  const [originalSize, setOriginalSize] = useState<number | null>(null)

  const saving = originalSize && resultSize ? Math.round((1 - resultSize / originalSize) * 100) : null

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
          <DropZone
            onDrop={(f) => { setFiles([f[0]]); setOriginalSize(f[0].size) }}
            accept={{ 'application/pdf': ['.pdf'] }}
          />

          <div className="mt-6 grid grid-cols-3 gap-3">
            {levels.map(({ id, label, desc, Icon, ring, bg, iconColor }) => {
              const selected = level === id
              return (
                <button
                  key={id}
                  onClick={() => setLevel(id)}
                  className={`border-2 rounded-xl p-3 text-left transition-all ${selected ? ring : bg}`}
                >
                  <Icon size={20} className={`mb-1.5 ${iconColor}`} />
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </button>
              )
            })}
          </div>

          {files.length > 0 && (
            <div className="mt-5 flex gap-4 items-start bg-white border rounded-xl p-4">
              <PDFPreviewCard file={files[0]} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{files[0].name}</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Current size</span>
                    <span className="font-semibold text-gray-800">{formatSize(files[0].size)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">After compression</span>
                    <span className="text-gray-400 italic">calculated on download</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full w-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          <button
            onClick={() => process({ level })}
            disabled={!files.length || loading}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Compressing…' : 'Compress PDF'}
          </button>
        </>
      ) : (
        <div className="text-center space-y-5">
          {saving !== null && saving <= 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-left space-y-3">
              <p className="font-semibold text-amber-700">This PDF is already fully optimized.</p>
              <p className="text-amber-600 text-xs leading-relaxed">
                This file was compressed at creation time (e.g. exported from a browser or certificate platform).
                There is no redundant data to remove, so no size reduction is possible without lossy re-encoding.
              </p>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">File size</span>
                <span className="font-medium text-gray-700">{originalSize ? formatSize(originalSize) : '—'}</span>
              </div>
            </div>
          ) : (
            <>
              <p className="text-green-600 font-semibold text-lg">Compression complete!</p>
              {originalSize && resultSize && (
                <div className="bg-white border rounded-xl p-5 text-sm text-left space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Original size</span>
                    <span className="font-medium text-gray-700">{formatSize(originalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Compressed size</span>
                    <span className="font-semibold text-green-600">{formatSize(resultSize)}</span>
                  </div>
                  {saving !== null && saving > 0 && (
                    <>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${100 - saving}%` }}
                        />
                      </div>
                      <p className="text-center text-green-600 font-semibold">{saving}% smaller</p>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          <a
            href={downloadUrl}
            download="compressed.pdf"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Download size={18} /> Download Compressed PDF
          </a>
          <button
            onClick={() => { reset(); setOriginalSize(null) }}
            className="block mx-auto text-sm text-gray-500 hover:text-gray-700"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  )
}
