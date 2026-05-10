import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

export default function UploadBox({ setFiles }) {
  const MAX_SIZE = 50 * 1024 * 1024; 

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [] },

    onDrop: (acceptedFiles) => {
      const validFiles = [];

      acceptedFiles.forEach((file) => {
        if (file.size > MAX_SIZE) {
          toast.error(`${file.name} is too large (max 50MB)`);
          return;
        }
        if (file.type !== "application/pdf") {
          toast.error(`${file.name} is not a PDF`);
          return;
        }
        validFiles.push({
          file,
          preview: URL.createObjectURL(file),
          rotation: 0,
        });
      });

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);
      }
    },

    onDrop: (acceptedFiles) => {
      const mapped = acceptedFiles.map((file) => ({
        id: Date.now() + Math.random(),
        file,
        preview: URL.createObjectURL(file),
        rotation: 0,
      }));

      setFiles((prev) => [...prev, ...mapped]);
    }
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer hover:border-blue-500 transition h-60 w-full max-w-[180px]"
    >
      <input {...getInputProps()} />
      <p className="text-xs text-gray-500 text-center px-2">
        + Upload
      </p>
    </div>
  );
}