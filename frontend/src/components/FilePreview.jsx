import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import UploadBox from "./UploadBox";

import * as pdfjsLib from "pdfjs-dist";

import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

import toast from "react-hot-toast";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function SortableItem({
  file,
  index,
  remove,
  rotate,
  setPreview,
  openUnlockModal,
}) {

  const [thumb, setThumb] = useState(null);

  const [locked, setLocked] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: file.id || index,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // 🔥 GENERATE PDF PREVIEW
  useEffect(() => {

    if (file.isBlank) return;

    let isMounted = true;

    const renderPreview = async () => {

      try {

        const loadingTask =
          pdfjsLib.getDocument({
            url: file.preview,
            password: file.password || "",
          });

        const pdf = await loadingTask.promise;

        const page = await pdf.getPage(1);

        const viewport = page.getViewport({
          scale: 0.8,
        });

        const canvas =
          document.createElement("canvas");

        const ctx =
          canvas.getContext("2d");

        canvas.width = viewport.width;

        canvas.height = viewport.height;

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;

        if (isMounted) {

          setThumb(canvas.toDataURL());

          setLocked(false);

        }

      } catch (err) {

        if (
          err?.name === "PasswordException"
        ) {

          setLocked(true);

        } else {

          setThumb(null);

        }
      }
    };

    renderPreview();

    return () => {
      isMounted = false;
    };

  }, [file.preview, file.password, file.isBlank]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white border rounded-2xl p-3 shadow-sm hover:shadow-lg transition w-full max-w-[180px]"
    >

      {/* DRAG */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-xs text-gray-400 mb-2 text-center"
      >
        ⠿ Drag
      </div>

      {/* PREVIEW */}
      <div className="relative h-52 w-full bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">

        {/* 🔐 LOCKED */}
        {locked ? (

          <div className="flex flex-col items-center justify-center text-center px-4">

            <div className="text-4xl mb-2">
              🔒
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Password Protected
            </p>

            <button
              onClick={() => openUnlockModal(index)}
              className="px-3 py-2 rounded-xl bg-black text-white text-xs hover:bg-gray-800 transition-all"
            >
              Unlock PDF
            </button>

          </div>

        ) : file.isBlank ? (

          <span className="text-sm text-gray-400">
            Blank Page
          </span>

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

          <span className="text-xs text-gray-400">
            Loading...
          </span>

        )}

        {/* ACTIONS */}
        {!locked && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">

            {!file.isBlank && (
              <button
                onClick={() =>
                  setPreview(file.preview)
                }
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
        )}

      </div>

      {/* FILE NAME */}
      <p className="text-xs mt-2 truncate text-center text-gray-600">

        {file.isBlank
          ? "Blank Page"
          : file.file.name}

      </p>

    </div>
  );
}

export default function FilePreview({
  files,
  setFiles,
}) {

  const [preview, setPreview] =
    useState(null);

  // 🔥 PASSWORD MODAL
  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [passwordInput, setPasswordInput] =
    useState("");

  const [currentFileIndex, setCurrentFileIndex] =
    useState(null);

  // 🔥 OPEN MODAL
  const openUnlockModal = (index) => {

    setCurrentFileIndex(index);

    setShowPasswordModal(true);
  };

  // 🔥 SUBMIT PASSWORD
  const submitPassword = async () => {

    if (!passwordInput) return;

    try {

      const file = files[currentFileIndex];

      // 🔥 VERIFY PASSWORD FIRST
      const loadingTask = pdfjsLib.getDocument({
        url: file.preview,
        password: passwordInput,
      });

      await loadingTask.promise;

      // ✅ PASSWORD CORRECT
      const updated = [...files];

      updated[currentFileIndex].password =
        passwordInput;

      updated[currentFileIndex].locked = false;

      setFiles(updated);

      toast.success("PDF Unlocked");

      setShowPasswordModal(false);

      setPasswordInput("");

    } catch (err) {

      console.log(err);

      toast.error("Wrong password");

    }
  };

  // 🔥 DRAG END
  const handleDragEnd = (event) => {

    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {

      const oldIndex =
        files.findIndex(
          (f) => f.id === active.id
        );

      const newIndex =
        files.findIndex(
          (f) => f.id === over.id
        );

      setFiles(
        arrayMove(
          files,
          oldIndex,
          newIndex
        )
      );
    }
  };

  // 🔥 REMOVE
  const remove = (i) => {

    setFiles(
      files.filter((_, idx) => idx !== i)
    );
  };

  // 🔥 ROTATE
  const rotate = (index) => {

    const updated = [...files];

    updated[index].rotation =
      (
        (updated[index].rotation || 0) + 90
      ) % 360;

    setFiles(updated);
  };

  // 🔥 ADD BLANK PAGE
  const addBlankPage = () => {

    setFiles((prev) => [
      ...prev,
      {
        id:
          Date.now() + Math.random(),

        file: new File(
          [""],
          "Blank.pdf",
          {
            type: "application/pdf",
          }
        ),

        preview: "",

        rotation: 0,

        password: "",

        locked: false,

        isBlank: true,
      },
    ]);
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >

        <SortableContext
          items={files.map((f, i) => f.id || i)}
          strategy={rectSortingStrategy}
        >

          <div className="flex flex-wrap gap-6 mt-6 justify-center">

            {files.map((file, index) => (

              <SortableItem
                key={file.id || index}
                file={file}
                index={index}
                remove={remove}
                rotate={rotate}
                setPreview={setPreview}
                openUnlockModal={openUnlockModal}
              />

            ))}

            {/* UPLOAD */}
            <UploadBox
              setFiles={setFiles}
            />

            {/* BLANK PAGE */}
            <div
              onClick={addBlankPage}
              className="border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer hover:border-green-500 transition h-72 w-full max-w-[180px]"
            >

              <p className="text-xs text-gray-500 text-center">
                + Blank Page
              </p>

            </div>

          </div>

        </SortableContext>

      </DndContext>

      {/* PDF PREVIEW */}
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

      {/* 🔐 PASSWORD MODAL */}
      {showPasswordModal && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] px-6">

          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-in fade-in zoom-in duration-200">

            <h2 className="text-2xl font-bold mb-3">
              Password Required
            </h2>

            <p className="text-gray-600 mb-6 text-sm leading-6">

              Enter password for:

              <span className="font-semibold text-black">
                {" "}
                {files[currentFileIndex]?.file?.name}
              </span>

            </p>

            {/* INPUT */}
            <input
              type="password"
              value={passwordInput}
              onChange={(e) =>
                setPasswordInput(e.target.value)
              }
              placeholder="Enter PDF password"
              className="w-full px-5 py-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 focus:ring-black mb-5"
            />

            {/* ACTIONS */}
            <div className="flex gap-3">

              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordInput("");
                }}
                className="flex-1 px-5 py-3 rounded-2xl border hover:bg-gray-100 transition-all duration-300"
              >
                Cancel
              </button>

              <button
                onClick={submitPassword}
                className="flex-1 px-5 py-3 rounded-2xl bg-black text-white hover:bg-gray-800 transition-all duration-300"
              >
                Unlock PDF
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}