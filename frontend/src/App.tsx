import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useAppLifecycle } from './hooks/useAppLifecycle'
import Home from './pages/Home'
import MergePDF from './pages/MergePDF'
import SplitPDF from './pages/SplitPDF'
import CompressPDF from './pages/CompressPDF'
import PDFToJPG from './pages/PDFToJPG'
import JPGToPDF from './pages/JPGToPDF'

export default function App() {
  useAppLifecycle()
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
          </Routes>
        </main>
        <footer className="text-center text-sm text-gray-400 py-6 border-t">
          © 2026 TFQPDFEditor — All tools are free
        </footer>
      </div>
    </BrowserRouter>
  )
}
