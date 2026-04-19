import { useState } from "react";
import UploadBox from "./components/UploadBox";
import FilePreview from "./components/FilePreview";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/merge",
        formData,
        {
          responseType: "blob",
          onUploadProgress: (e) => {
            setProgress(Math.round((e.loaded * 100) / e.total));
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();

      toast.success("Merged!");
      setFiles([]);
      setProgress(0);
    } catch {
      toast.error("Error merging");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6">

      <Toaster />

      <h1 className="text-3xl font-bold mb-6 text-center">
        PDF Merger 🚀
      </h1>

      <UploadBox setFiles={setFiles} />
      <FilePreview files={files} setFiles={setFiles} />

      {/* Progress */}
      {progress > 0 && (
        <p className="text-sm mt-2 text-center text-gray-600">
          Uploading: {progress}%
        </p>
      )}

      {/* Empty state */}
      {files.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No files uploaded yet
        </p>
      )}

      {/* Merge button */}
      <div className="flex justify-center">
        <button
          onClick={mergePDFs}
          disabled={files.length < 2 || loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white disabled:opacity-40 transition"
        >
          {loading ? "Merging..." : "Merge PDFs"}
        </button>
      </div>

    </div>
  );
}

export default App;