import { useDropzone } from 'react-dropzone'
import type { Accept } from 'react-dropzone'
import { UploadCloud } from 'lucide-react'

interface Props {
  onDrop: (files: File[]) => void
  accept: Accept
  multiple?: boolean
  label?: string
}

export default function DropZone({ onDrop, accept, multiple = false, label = 'PDF' }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, multiple })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50'}`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto mb-3 text-gray-400" size={40} />
      <p className="text-gray-600 font-medium">
        {isDragActive ? 'Drop files here…' : `Click or drag & drop your ${label} file${multiple ? 's' : ''}`}
      </p>
      <p className="text-sm text-gray-400 mt-1">Files stay on your machine — processed locally</p>
    </div>
  )
}
