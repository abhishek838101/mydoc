import { useState } from "react";
import FilePreview from "../FilePreview.jsx";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import Footer from "../footer/footer.jsx";
import Navbar from "../navbar/navbar.jsx";

function App() {

  const [files, setFiles] = useState([]);

  const [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(false);

  const [passwords, setPasswords] = useState([]);

  // 🔥 PASSWORD MODAL STATES
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordInput, setPasswordInput] = useState("");

  const [currentProtectedFile, setCurrentProtectedFile] = useState(null);

  // 🔥 SUBMIT PASSWORD
  const submitPassword = async () => {

    if (!passwordInput) return;

    const updated = [...passwords];

    updated[currentProtectedFile.index] = passwordInput;

    setPasswords(updated);

    setShowPasswordModal(false);

    setPasswordInput("");

    await mergePDFs(updated);
  };

  // 🔥 MERGE PDFs
  const mergePDFs = async (customPasswords = passwords) => {

    if (files.length < 2) {
      toast.error("Upload at least 2 PDFs");
      return;
    }

    const formData = new FormData();

    files.forEach((f) => {
      formData.append("files", f.file);
    });

    formData.append(
      "rotations",
      JSON.stringify(files.map((f) => f.rotation || 0))
    );

    formData.append(
      "passwords",
      JSON.stringify(customPasswords)
    );

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/merge",
        formData,
        {
          responseType: "blob",

          onUploadProgress: (e) => {

            if (e.total) {

              setProgress(
                Math.round((e.loaded * 100) / e.total)
              );

            }

          },
        }
      );

      // 🔥 DOWNLOAD PDF
      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const a = document.createElement("a");

      a.href = url;

      a.download = "merged.pdf";

      a.click();

      toast.success("PDFs merged successfully!");

      setFiles([]);

      setPasswords([]);

      setProgress(0);

    } catch (err) {

      try {

        if (err.response && err.response.data) {

          const text = await err.response.data.text();

          const data = JSON.parse(text);

          // 🔐 PASSWORD REQUIRED
          if (data.type === "PASSWORD_REQUIRED") {

            setCurrentProtectedFile({
              index: data.fileIndex,
              name: data.fileName,
            });

            setShowPasswordModal(true);

            setLoading(false);

            return;
          }
        }

      } catch (e) {}

      toast.error("Error merging PDFs");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">

      <Navbar active="Merge" />

      {/* BODY */}
      <div className="flex-1 mt-16">

        <div className="flex flex-col min-h-[calc(100vh-64px)]">

          {/* CONTENT */}
          <div className="w-full max-w-7xl mx-auto p-6">

            <Toaster />

            {/* HEADING */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              PDF Merger
            </h1>

            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Merge multiple PDF files into a single document
              securely and instantly.
            </p>

            {/* MERGE BUTTON */}
            <div className="flex justify-center mb-10">

              <button
                onClick={() => mergePDFs()}
                disabled={files.length < 2 || loading}
                className="relative overflow-hidden px-8 py-4 rounded-2xl text-white bg-blue-600 disabled:opacity-40 shadow-xl hover:scale-105 transition-all duration-300"
              >

                {/* PROGRESS */}
                {loading && (
                  <span
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 opacity-80 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                )}

                <span className="relative z-10 font-medium text-lg">

                  {loading
                    ? "Merging PDFs..."
                    : "Merge PDFs"}

                </span>

              </button>

            </div>

            {/* EMPTY */}
            {files.length === 0 && (
              <p className="text-center text-gray-500 mb-10">
                No files uploaded yet
              </p>
            )}

            {/* FILE PREVIEW */}
            <FilePreview
              files={files}
              setFiles={setFiles}
            />

          </div>

          {/* FOOTER */}
          <Footer />

        </div>

      </div>

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
                {currentProtectedFile?.name}
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

    </div>
  );
}

export default App;