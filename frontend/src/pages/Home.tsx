import { Link } from 'react-router-dom'
import { FileStack, Scissors, Minimize2, Image, FileImage } from 'lucide-react'

const tools = [
  { label: 'Merge PDF', desc: 'Combine multiple PDFs into one.', icon: FileStack, path: '/merge', color: 'bg-red-100 text-red-500' },
  { label: 'Split PDF', desc: 'Separate pages into individual files.', icon: Scissors, path: '/split', color: 'bg-orange-100 text-orange-500' },
  { label: 'Compress PDF', desc: 'Reduce file size without losing quality.', icon: Minimize2, path: '/compress', color: 'bg-green-100 text-green-500' },
  { label: 'PDF to JPG', desc: 'Convert each PDF page to an image.', icon: Image, path: '/pdf-to-jpg', color: 'bg-blue-100 text-blue-500' },
  { label: 'JPG to PDF', desc: 'Turn images into a PDF document.', icon: FileImage, path: '/jpg-to-pdf', color: 'bg-purple-100 text-purple-500' },
]

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Every PDF tool you need</h1>
        <p className="text-gray-500 text-lg">Fast and easy to use. No sign-up required.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((t) => (
          <Link
            key={t.path}
            to={t.path}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-3"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.color}`}>
              <t.icon size={22} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{t.label}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{t.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
