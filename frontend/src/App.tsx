import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './components/Navbar'
import { useAppLifecycle } from './hooks/useAppLifecycle'
import Home from './pages/Home'
import MergePDF from './pages/MergePDF'
import SplitPDF from './pages/SplitPDF'
import CompressPDF from './pages/CompressPDF'
import PDFToJPG from './pages/PDFToJPG'
import JPGToPDF from './pages/JPGToPDF'
import Activation from './pages/Activation'
import Settings from './pages/Settings'

export default function App() {
  useAppLifecycle()
  const [activated, setActivated] = useState<boolean | null>(null)

  useEffect(() => {
    axios.get('/api/license-status')
      .then(res => setActivated(res.data.activated))
      .catch(() => setActivated(false))
  }, [])

  if (activated === null) return null // brief loading before license check resolves

  if (!activated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/activate" element={<Activation />} />
          <Route path="*" element={<Navigate to="/activate" replace />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/merge" element={<MergePDF />} />
            <Route path="/split" element={<SplitPDF />} />
            <Route path="/compress" element={<CompressPDF />} />
            <Route path="/pdf-to-jpg" element={<PDFToJPG />} />
            <Route path="/jpg-to-pdf" element={<JPGToPDF />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <footer className="text-center text-sm text-gray-400 py-6 border-t">
          © 2026 TFQPDFEditor
        </footer>
      </div>
    </BrowserRouter>
  )
}
