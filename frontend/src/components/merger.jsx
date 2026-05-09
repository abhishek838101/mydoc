import { useState } from "react";
import FilePreview from "./FilePreview.jsx";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer";

function App() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

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

        <div className="relative w-full h-full flex items-center px-6">

          {/* LEFT LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <img
              src="/logo.ico"
              alt="Dr. Docs"
              className="w-8 h-8 object-contain"
            />

            <span className="hover:opacity-80 transition">
              Dr. Docs
            </span>
          </Link>

          {/* CENTER NAV (DESKTOP ONLY) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-3 text-sm">

            {/* ACTIVE */}
            <Link
              to="/merge"
              className="px-4 py-2 rounded-xl bg-black text-white font-medium shadow-sm"
            >
              Merge
            </Link>

            {/* INACTIVE */}
            <Link
              to="/split"
              className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black font-medium transition-all duration-300"
            >
              Split
            </Link>

            <button className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black font-medium transition-all duration-300">
              Compress
            </button>

            <button className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black font-medium transition-all duration-300">
              Reorder
            </button>

          </div>        

          {/* MOBILE MENU */}
          <div className="ml-auto md:hidden relative">

            {/* MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              {menuOpen ? "✕" : "☰ Menu"}
            </button>

            {/* DROPDOWN */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg overflow-hidden">

                {/* <button className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-sm font-medium text-black">
                  Merge
                </button> */}

                <button className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-100">
                  Split
                </button>

                <button className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-100">
                  Compress
                </button>

                <button className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-100">
                  Reorder
                </button>

              </div>
            )}

          </div>

        </div>

      </header>

      {/* BODY */}
      <div className="flex-1 mt-16 overflow-y-auto">

        <div className="min-h-[calc(100vh-64px)] flex flex-col">

          {/* CONTENT */}
          <div className="p-6">

            <Toaster />

            <h1 className="text-3xl font-bold mb-6 text-center">
              PDF Merger 
            </h1>

            <div className="flex justify-center mb-8">

              <button
                onClick={mergePDFs}
                disabled={files.length < 2 || loading}
                className="relative overflow-hidden px-6 py-3 rounded-2xl text-white bg-blue-600 disabled:opacity-40 shadow-lg"
              >

                {/* PROGRESS */}
                {loading && (
                  <span
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 opacity-80 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                )}

                <span className="relative z-10 font-medium">
                  {loading ? "Merging PDFs..." : "Merge PDFs"}
                </span>

              </button>

            </div>

            {/* EMPTY */}
            {files.length === 0 && (
              <p className="text-center text-gray-500 mt-6">
                No files uploaded yet
              </p>
            )}

            {/* FILE GRID */}
            <FilePreview files={files} setFiles={setFiles} />

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
}

export default App;