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

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [currentProtectedFile, setCurrentProtectedFile] = useState(null);

  // 🔐 SUBMIT PASSWORD
  const submitPassword = async () => {
    if (!passwordInput || currentProtectedFile === null) return;

    try {
      const formData = new FormData();
      formData.append("files", files[currentProtectedFile.index].file);
      formData.append("rotations", JSON.stringify([0]));
      formData.append("passwords", JSON.stringify([passwordInput]));

      await axios.post("http://localhost:5000/merge", formData, {
        responseType: "blob",
      });

      const updated = [...files];
      updated[currentProtectedFile.index].password = passwordInput;

      setFiles(updated);
      setShowPasswordModal(false);
      setPasswordInput("");

      setTimeout(() => mergePDFs(updated), 100);
    } catch {
      toast.error("Wrong password");
    }
  };

  // 📄 MERGE PDFs
  const mergePDFs = async (customFiles = files) => {
    if (customFiles.length < 2) {
      toast.error("Upload at least 2 PDFs");
      return;
    }

    const formData = new FormData();

    customFiles.forEach((f) => formData.append("files", f.file));

    formData.append(
      "rotations",
      JSON.stringify(customFiles.map((f) => f.rotation || 0))
    );

    formData.append(
      "passwords",
      JSON.stringify(customFiles.map((f) => f.password || ""))
    );

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/merge", formData, {
        responseType: "blob",
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();

      toast.success("PDFs merged successfully!");
      setFiles([]);
      setProgress(0);
    } catch (err) {
      try {
        const data = JSON.parse(await err.response.data.text());

        if (data.type === "PASSWORD_REQUIRED") {
          setCurrentProtectedFile({
            index: data.fileIndex,
            name: data.fileName,
          });
          setShowPasswordModal(true);
          return;
        }
      } catch {}

      toast.error("Error merging PDFs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f5f5f7]"
      style={{
        backgroundImage: `url(${bgPattern})`,
        backgroundSize: "155px 92px",
      }}
    >
      <Navbar active="Merge" />
      <Toaster />

      <div className="flex-1 mt-16">
        <div className="max-w-[1600px] mx-auto p-4 md:p-6 grid lg:grid-cols-12 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <h1 className="text-3xl font-bold text-center mb-3">
                PDF Merger
              </h1>
              <p className="text-gray-600 text-center mb-6">
                Merge multiple PDFs instantly
              </p>

              <button
                onClick={() => mergePDFs()}
                disabled={files.length < 2 || loading}
                className="w-full py-4 rounded-2xl text-white bg-blue-600 disabled:opacity-40 relative overflow-hidden"
              >
                {loading && (
                  <span
                    className="absolute left-0 top-0 h-full bg-blue-700/60"
                    style={{ width: `${progress}%` }}
                  />
                )}
                <span className="relative z-10">
                  {loading ? "Merging..." : "Merge PDFs"}
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-10 bg-white rounded-3xl border p-6 min-h-[600px]">
            {files.length === 0 && (
              <p className="text-center text-gray-500">
                No files uploaded yet
              </p>
            )}

            <FilePreview
              files={files}
              setFiles={setFiles}
              mergePDFs={mergePDFs}
            />
          </div>
        </div>
      </div>

      <Footer />

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">
              Password Required
            </h2>

            <p className="text-gray-600 mb-4">
              {currentProtectedFile?.name}
            </p>

            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-4 border rounded-2xl mb-4"
              placeholder="Enter password"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordInput("");
                }}
                className="flex-1 py-3 border rounded-2xl"
              >
                Cancel
              </button>

              <button
                onClick={submitPassword}
                className="flex-1 py-3 bg-black text-white rounded-2xl"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;