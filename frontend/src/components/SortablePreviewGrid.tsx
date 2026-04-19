import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X } from 'lucide-react'
import PDFPreviewCard from './PDFPreviewCard'

interface SortableItemProps {
  id: string
  file: File
  onRemove: () => void
}

function SortableItem({ id, file, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 scale-105 z-10' : ''}`}
      {...attributes}
      {...listeners}
    >
      <PDFPreviewCard file={file} />
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onRemove}
        className="absolute top-1 right-1 bg-white rounded-full shadow p-0.5 text-gray-400 hover:text-red-500 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}

interface Props {
  files: File[]
  setFiles: (files: File[]) => void
}

export default function SortablePreviewGrid({ files, setFiles }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const ids = files.map((_, i) => String(i))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = ids.indexOf(String(active.id))
      const newIndex = ids.indexOf(String(over.id))
      setFiles(arrayMove(files, oldIndex, newIndex))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
        <div className="flex flex-wrap gap-3 mt-4">
          {files.map((file, i) => (
            <SortableItem
              key={`${file.name}-${i}`}
              id={String(i)}
              file={file}
              onRemove={() => setFiles(files.filter((_, j) => j !== i))}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
