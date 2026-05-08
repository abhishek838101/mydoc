import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import UploadBox from "./UploadBox";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function SortableItem({ file, index, remove, rotate, setPreview }) {
  const [thumb, setThumb] = useState(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (file.isBlank) return;

    let isMounted = true;

    const renderPreview = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(file.preview).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 0.8 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;

        if (isMounted) {
          setThumb(canvas.toDataURL());
        }
      } catch {
        setThumb(null);
      }
    };

    renderPreview();

    return () => {
      isMounted = false;
    };
  }, [file.preview, file.isBlank]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white border rounded-2xl p-3 shadow-sm hover:shadow-lg transition w-full max-w-[180px]"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-xs text-gray-400 mb-2 text-center"
      >
        ⠿ Drag
      </div>

      <div className="relative h-52 w-full bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">

        {file.isBlank ? (
          <span className="text-sm text-gray-400">Blank Page</span>
        ) : thumb ? (
          <img
            src={thumb}
            alt="preview"
            className="w-full h-full object-cover"
            style={{
              transform: `rotate(${file.rotation || 0}deg)`
            }}
          />
        ) : (
          <span className="text-xs text-gray-400">Loading...</span>
        )}

        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          {!file.isBlank && (
            <button
              onClick={() => setPreview(file.preview)}
              className="p-2 bg-white border rounded-full shadow hover:bg-black hover:text-white"
            >
              👁
            </button>
          )}

          <button
            onClick={() => rotate(index)}
            className="p-2 bg-white border rounded-full shadow hover:bg-black hover:text-white"
          >
            🔄
          </button>

          <button
            onClick={() => remove(index)}
            className="p-2 bg-white border rounded-full shadow hover:bg-black hover:text-white"
          >
            🗑
          </button>
        </div>
      </div>

      <p className="text-xs mt-2 truncate text-center text-gray-600">
        {file.isBlank ? "Blank Page" : file.file.name}
      </p>
    </div>
  );
}

export default function FilePreview({ files, setFiles }) {
  const [preview, setPreview] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = files.findIndex(f => f.id === active.id);
      const newIndex = files.findIndex(f => f.id === over.id);

      setFiles(arrayMove(files, oldIndex, newIndex));
    }
  };

  const remove = (i) => {
    setFiles(files.filter((_, idx) => idx !== i));
  };

  const rotate = (index) => {
    const updated = [...files];
    updated[index].rotation =
      ((updated[index].rotation || 0) + 90) % 360;
    setFiles(updated);
  };

  const addBlankPage = () => {
    setFiles((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        file: new File([""], "Blank.pdf", { type: "application/pdf" }),
        preview: "",
        rotation: 0,
        isBlank: true,
      },
    ]);
  };

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={files.map(f => f.id)}
          strategy={rectSortingStrategy}
        >
          <div className="flex flex-wrap gap-6 mt-6 justify-center">

            {files.map((file, index) => (
              <SortableItem
                key={file.id}
                file={file}
                index={index}
                remove={remove}
                rotate={rotate}
                setPreview={setPreview}
              />
            ))}

            <UploadBox setFiles={setFiles} />

            <div
              onClick={addBlankPage}
              className="border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer hover:border-green-500 transition
                h-72 w-full max-w-[180px]"
            >
              <p className="text-xs text-gray-500 text-center">
                + Blank Page
              </p>
            </div>

          </div>
        </SortableContext>
      </DndContext>

      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <iframe
            src={preview}
            className="w-[85%] h-[90%] bg-white rounded-xl"
          />
        </div>
      )}
    </>
  );
}