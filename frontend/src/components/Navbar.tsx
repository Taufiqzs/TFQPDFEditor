import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'

const tools = [
  { label: 'Merge PDF', path: '/merge' },
  { label: 'Split PDF', path: '/split' },
  { label: 'Compress PDF', path: '/compress' },
  { label: 'PDF to JPG', path: '/pdf-to-jpg' },
  { label: 'JPG to PDF', path: '/jpg-to-pdf' },
]

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-14">
        <Link to="/" className="font-bold text-red-500 text-xl tracking-tight shrink-0">
          TFQ<span className="text-gray-800">PDF</span>
        </Link>
        <div className="flex gap-1 overflow-x-auto flex-1">
          {tools.map((t) => (
            <Link
              key={t.path}
              to={t.path}
              className="text-sm text-gray-600 hover:text-red-500 px-3 py-1.5 rounded hover:bg-red-50 whitespace-nowrap transition-colors"
            >
              {t.label}
            </Link>
          ))}
        </div>
        <Link to="/settings" className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
          <Settings size={18} />
        </Link>
      </div>
    </nav>
  )
}
