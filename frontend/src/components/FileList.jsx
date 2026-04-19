export default function FileList({ files, setFiles }) {
  const remove = (i) => setFiles(files.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3 mt-6">
      {files.map((file, i) => (
        <div key={i} className="flex justify-between bg-gray-800 p-3 rounded">
          <span>{file.name}</span>
          <button onClick={() => remove(i)} className="text-red-400">Delete</button>
        </div>
      ))}
    </div>
  );
}