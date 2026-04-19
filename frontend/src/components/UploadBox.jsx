import { useDropzone } from "react-dropzone";

export default function UploadBox({ setFiles }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [] },
    onDrop: (acceptedFiles) => {
      const withPreview = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        rotation: 0,
      }));
      setFiles((prev) => [...prev, ...withPreview]);
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed p-10 rounded-xl text-center cursor-pointer hover:border-blue-500"
    >
      <input {...getInputProps()} />
      <p>Drag & drop PDFs here</p>
    </div>
  );
}