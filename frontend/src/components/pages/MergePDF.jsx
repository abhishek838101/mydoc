import toast, { Toaster } from "react-hot-toast";
import bgPattern from "../../assets/bg3.jpg";
import FilePreview from "../FilePreview.jsx";
import Footer from "../footer/footer.jsx";
import Navbar from "../navbar/navbar.jsx";
import { useState } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  // 🔥 PASSWORD MODAL
  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [passwordInput, setPasswordInput] =
    useState("");

  const [currentProtectedFile, setCurrentProtectedFile] =
    useState(null);

  // 🔥 SUBMIT PASSWORD
  const submitPassword = async () => {

    if (!passwordInput) return;

    try {

      // 🔥 VERIFY PASSWORD FIRST
      await axios.post(
        "http://localhost:5000/merge",
        (() => {

          const testForm = new FormData();

          testForm.append(
            "files",
            files[currentProtectedFile.index].file
          );

          testForm.append(
            "rotations",
            JSON.stringify([0])
          );

          testForm.append(
            "passwords",
            JSON.stringify([passwordInput])
          );

          return testForm;

        })(),
        {
          responseType: "blob",
        }
      );

      // ✅ PASSWORD CORRECT
      const updatedFiles = [...files];

      updatedFiles[currentProtectedFile.index].password =
        passwordInput;

      setFiles(updatedFiles);

      setShowPasswordModal(false);

      setPasswordInput("");

      // 🔥 RETRY MERGE
      setTimeout(() => {
        mergePDFs(updatedFiles);
      }, 100);

    } catch (err) {

      toast.error("Wrong password");

    }
  };

  // 🔥 MERGE PDFs
  const mergePDFs = async (customFiles = files) => {

    if (customFiles.length < 2) {

      toast.error("Upload at least 2 PDFs");

      return;
    }

    const formData = new FormData();

    customFiles.forEach((f) => {
      formData.append("files", f.file);
    });

    // 🔥 ROTATIONS
    formData.append(
      "rotations",
      JSON.stringify(
        customFiles.map((f) => f.rotation || 0)
      )
    );

    // 🔥 PASSWORDS
    formData.append(
      "passwords",
      JSON.stringify(
        customFiles.map((f) => f.password || "")
      )
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

      setProgress(0);

    } catch (err) {

      try {

        if (err.response && err.response.data) {

          const text =
            await err.response.data.text();

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

      } catch (e) {

        console.log(e);

      }

      toast.error("Error merging PDFs");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      className="min-h-screen text-black flex flex-col overflow-x-hidden bg-[#f5f5f7] bg-repeat"
      style={{
        backgroundImage: `url(${bgPattern})`,
        backgroundSize: "155px 92px",
      }}
    >

      <Navbar active="Merge" />

      {/* BODY */}
      <div className="flex-1 mt-16">

        <div className="min-h-[calc(100vh-64px)] flex flex-col">

          <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6">

            <Toaster />

            {/* 🔥 TWO COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* 🔥 LEFT PANEL */}
              <div className="lg:col-span-2 relative lg:sticky lg:top-24 z-30">

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8">

                  {/* HEADING */}
                  <h1 className="text-3xl md:text-4xl text-center font-bold mb-4">
                    PDF Merger
                  </h1>

                  <p className="text-gray-600 text-center leading-7 mb-8">
                    Merge multiple PDF files into a single document
                    securely and instantly.
                  </p>

                  {/* LINE */}
                  <div className="w-full h-px bg-gray-200 mb-8" />

                  {/* MERGE BUTTON */}
                  <button
                    onClick={() => mergePDFs()}
                    disabled={files.length < 2 || loading}
                    className="relative overflow-hidden w-full px-8 py-4 rounded-2xl text-white bg-blue-600 disabled:opacity-40 shadow-xl hover:scale-[1.02] transition-all duration-300"
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

              </div>

              {/* 🔥 RIGHT PANEL */}
              <div className="lg:col-span-10 relative z-0 min-w-0">

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4 md:p-6 min-h-[600px] overflow-hidden">

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
                    mergePDFs={mergePDFs}
                  />

                </div>

              </div>

            </div>

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