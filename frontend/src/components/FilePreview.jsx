import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function SortableItem({ file, index, remove, rotate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: file.preview });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition"
    >
      {/* 🔹 Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-xs text-gray-400 mb-1"
      >
        ⠿ Drag
      </div>

      {/* File name */}
      <p className="text-sm truncate">{file.file.name}</p>

      {/* Preview */}
      <div className="mt-2 h-28 overflow-hidden rounded flex items-center justify-center bg-gray-100">
        <iframe
          src={file.preview}
          className="w-full h-full"
          style={{
            transform: `rotate(${file.rotation || 0}deg)`
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-2 text-xs">
        <button
          onClick={() => rotate(index)}
          className="text-blue-500 hover:underline"
        >
          🔄
        </button>

        <button
          onClick={() => remove(index)}
          className="text-red-500 hover:underline"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

export default function FilePreview({ files, setFiles }) {

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = files.findIndex(f => f.preview === active.id);
      const newIndex = files.findIndex(f => f.preview === over.id);

      setFiles(arrayMove(files, oldIndex, newIndex));
    }
  };

  // 🗑 Remove file
  const remove = (i) => {
    setFiles(files.filter((_, idx) => idx !== i));
  };

  // 🔄 Rotate file
  const rotate = (index) => {
    const updated = [...files];
    updated[index].rotation = ((updated[index].rotation || 0) + 90) % 360;
    setFiles(updated);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={files.map(f => f.preview)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {files.map((file, index) => (
            <SortableItem
              key={file.preview}
              file={file}
              index={index}
              remove={remove}
              rotate={rotate}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}