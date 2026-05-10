import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Navbar from "../navbar/navbar.jsx";
import Footer from "../footer/footer.jsx";
import axios from "axios";

export default function UnlockPdf() {
  const [files, setFiles] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [showPass, setShowPass] = useState({});
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);

  const inputRef = useRef();

  /* ---------------- ADD FILES ---------------- */
  const loadFiles = (fileList) => {
    const arr = Array.from(fileList);
    setFiles((prev) => [...prev, ...arr]);
  };

  /* ---------------- DRAG DROP ---------------- */
  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    loadFiles(e.dataTransfer.files);
  };

  /* ---------------- PASSWORD CHANGE ---------------- */
  const setPassword = (index, value) => {
    setPasswords((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  /* ---------------- TOGGLE PASSWORD VIEW ---------------- */
  const togglePassword = (index) => {
    setShowPass((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  /* ---------------- SINGLE UNLOCK ---------------- */
  const unlockSingle = async (file, index) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", passwords[index] || "");

      const res = await axios.post(
        "http://localhost:5000/unlock",
        formData,
        {
          responseType: "blob",
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );

            setProgress((prev) => ({
              ...prev,
              [index]: percent,
            }));
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = `unlocked-${file.name}`;
      link.click();

      toast.success(`${file.name} unlocked`);
    } catch {
      toast.error(`Failed: ${file.name}`);
    }
  };

  /* ---------------- BATCH UNLOCK ---------------- */
  const unlockBatch = async () => {
    if (!files.length) return toast.error("No files");

    setLoading(true);

    for (let i = 0; i < files.length; i++) {
      await unlockSingle(files[i], i);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <Navbar active="Unlock" />

      <div className="flex-1 flex flex-col items-center justify-center p-6">

        {/* UPLOAD BOX */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current.click()}
          className={`w-full max-w-xl border-2 border-dashed p-6 rounded-2xl text-center cursor-pointer ${
            drag ? "border-black bg-gray-200" : "border-gray-300"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="application/pdf"
            hidden
            onChange={(e) => loadFiles(e.target.files)}
          />

          Drag & drop multiple PDFs or click
        </div>

        {/* FILE LIST */}
        <div className="w-full max-w-xl mt-6 space-y-4">

          {files.map((file, index) => (
            <motion.div
              key={index}
              className="bg-white p-4 rounded-xl shadow"
            >

              <div className="flex justify-between items-center">

                <p className="text-sm font-medium truncate">
                  {file.name}
                </p>

                <button
                  onClick={() => togglePassword(index)}
                  className="text-xs text-blue-600"
                >
                  {showPass[index] ? "Hide" : "Show"}
                </button>

              </div>

              {/* PASSWORD INPUT */}
              <input
                type={showPass[index] ? "text" : "password"}
                placeholder="Enter password"
                value={passwords[index] || ""}
                onChange={(e) =>
                  setPassword(index, e.target.value)
                }
                className="mt-2 w-full px-3 py-2 border rounded-lg"
              />

              {/* PROGRESS BAR */}
              {progress[index] && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: `${progress[index]}%` }}
                  />
                </div>
              )}

              {/* UNLOCK BUTTON */}
              <button
                onClick={() => unlockSingle(file, index)}
                className="mt-3 w-full bg-black text-white py-2 rounded-lg"
              >
                Unlock
              </button>

            </motion.div>
          ))}

        </div>

        {/* BATCH BUTTON */}
        {files.length > 0 && (
          <button
            onClick={unlockBatch}
            disabled={loading}
            className="mt-6 w-full max-w-xl bg-green-600 text-white py-3 rounded-xl"
          >
            {loading ? "Processing..." : "Unlock All (Batch)"}
          </button>
        )}

      </div>

      <Footer />

    </div>
  );
}