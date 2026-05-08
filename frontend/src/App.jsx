import { useState } from "react";
import FilePreview from "./components/FilePreview";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

function App() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState([]);

  const mergePDFs = async () => {
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

    formData.append("passwords", JSON.stringify(passwords));

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/merge",
        formData,
        {
          responseType: "blob",
          onUploadProgress: (e) => {
            if (e.total) {
              setProgress(Math.round((e.loaded * 100) / e.total));
            }
          },
        }
      );

      // DOWNLOAD PDF
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();

      toast.success("Merged!");
      setFiles([]);
      setPasswords([]);
      setProgress(0);

    } catch (err) {
      try {
        if (err.response && err.response.data) {
          const text = await err.response.data.text();
          const data = JSON.parse(text);

          if (data.type === "PASSWORD_REQUIRED") {
            const pass = prompt(`Enter password for ${data.fileName}`);

            if (!pass) {
              setLoading(false);
              return;
            }

            const updated = [...passwords];
            updated[data.fileIndex] = pass;
            setPasswords(updated);

            setLoading(false);

            return mergePDFs();
          }
        }
      } catch (e) {}

      toast.error("Error merging");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full h-16 bg-white border-b shadow-sm z-50">
        <div className="w-full flex items-center justify-between px-4 py-3">

          {/* LEFT */}
          <h1 className="text-lg font-semibold">
            📋 Dr. Docs
          </h1>

          {/* CENTER */}
          <div className="flex gap-6 ml-10 text-sm text-gray-600">
            <button className="hover:text-black font-medium">
              Merge
            </button>

            <button className="hover:text-black font-medium">
              Split
            </button>

            <button className="hover:text-black font-medium">
              Compress
            </button>

            <button className="hover:text-black font-medium">
              Reorder
            </button>
          </div>

          {/* RIGHT */}
          <button
            onClick={mergePDFs}
            disabled={files.length < 2 || loading}
            className="relative overflow-hidden px-4 py-2 rounded text-white bg-blue-600 disabled:opacity-40"
          >

            {/* PROGRESS */}
            {loading && (
              <span
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 opacity-80 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            )}

            <span className="relative z-10">
              {loading ? "Merging PDFs..." : "Merge PDFs"}
            </span>

          </button>

        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 mt-16 overflow-y-auto">

        <div className="min-h-[calc(100vh-64px)] flex flex-col">

          {/* CONTENT */}
          <div className="p-6">

            <Toaster />

            <h1 className="text-3xl font-bold mb-6 text-center">
              PDF Merger 🚀
            </h1>

            {/* EMPTY */}
            {files.length === 0 && (
              <p className="text-center text-gray-500 mt-6">
                No files uploaded yet
              </p>
            )}

            {/* FILE GRID */}
            <FilePreview files={files} setFiles={setFiles} />

          </div>

          {/* FOOTER */}
          <footer className="mt-auto w-full border-t bg-white px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-5 text-gray-500 text-xs">

            {/* LEFT */}
            <p>© 2026 Dr. Docs. All rights reserved.</p>

            {/* CENTER */}
            <div className="flex items-center gap-4 flex-wrap justify-center">

              <a
                href="https://github.com/abhishek838101"
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-black transition flex items-center gap-1"
              >
                Made with
                <span className="text-red-500 text-sm">❤️</span>
                by
                <span className="font-semibold text-gray-700">
                  Abhishek Varshney
                </span>
              </a>

              <span className="hidden md:block text-gray-300">|</span>

              <a
                href="https://buymeacoffee.com/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-medium transition-all duration-300 shadow-sm hover:scale-105"
              >
                ☕ Buy Me a Coffee
              </a>

            </div>

            {/* RIGHT */}
            <div className="flex flex-wrap justify-center gap-4">

              <Link
                to="/terms"
                className="hover:text-black transition"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/privacy"
                className="hover:text-black transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/cookies"
                className="hover:text-black transition"
              >
                Cookies
              </Link>

            </div>

          </footer>

        </div>

      </div>

    </div>
  );
}

export default App;