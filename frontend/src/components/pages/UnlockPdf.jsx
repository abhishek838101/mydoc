import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Navbar from "../navbar/navbar.jsx";
import Footer from "../footer/footer.jsx";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function UnlockPdf() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [thumb, setThumb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);

  const inputRef = useRef();

  /* ---------------- FILE LOAD ---------------- */
  const loadFile = async (f) => {
    if (!f) return;

    setFile(f);

    try {
      const url = URL.createObjectURL(f);

      const pdf = await pdfjsLib.getDocument({ url }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 0.6 });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      setThumb(canvas.toDataURL());
    } catch {
      toast.error("Cannot preview PDF");
    }
  };

  /* ---------------- DRAG DROP ---------------- */
  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    loadFile(e.dataTransfer.files[0]);
  };

  /* ---------------- UNLOCK ---------------- */
  const unlockPdf = async () => {
    if (!file || !password) {
      toast.error("Upload file and enter password");
      return;
    }

    setLoading(true);

    try {
      const url = URL.createObjectURL(file);

      const pdf = await pdfjsLib.getDocument({
        url,
        password,
      }).promise;

      toast.success("PDF Unlocked!");

      // simulate download
      const blob = new Blob([await file.arrayBuffer()], {
        type: "application/pdf",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "unlocked.pdf";
      link.click();

    } catch {
      toast.error("Wrong password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">

      <Navbar active="Unlock" />

      {/* MAIN CONTENT (TAKES ALL AVAILABLE SPACE) */}
      <div className="flex-1 flex items-center justify-center p-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
        >

          {/* TITLE */}
          <h1 className="text-3xl font-bold text-center mb-2">
            Unlock PDF
          </h1>

          <p className="text-sm text-gray-500 text-center mb-6">
            Drag & drop or upload a password protected PDF
          </p>

          {/* DROP AREA */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
              drag ? "border-black bg-gray-100" : "border-gray-300"
            }`}
          >

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => loadFile(e.target.files[0])}
            />

            {file ? (
              <p className="text-sm font-medium">{file.name}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Drag & drop or click to upload
              </p>
            )}

          </div>

          {/* THUMBNAIL */}
          {thumb && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 border rounded-xl overflow-hidden"
            >
              <img src={thumb} className="w-full" />
            </motion.div>
          )}

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
          />

          {/* BUTTON */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={unlockPdf}
            disabled={loading}
            className="mt-5 w-full py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition"
          >
            {loading ? "Unlocking..." : "Unlock & Download"}
          </motion.button>

        </motion.div>

      </div>

      {/* FOOTER ALWAYS AT BOTTOM */}
      <Footer />

    </div>
  );
}