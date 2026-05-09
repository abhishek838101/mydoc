import { useState } from "react";
import { Link } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Footer from "../footer/footer.jsx";
import Navbar from "../navbar/navbar.jsx";

export default function SplitPDF() {

  const [file, setFile] = useState(null);

  const [pageInput, setPageInput] = useState("");

  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // PARSE PAGE INPUT
  const parsePages = (input) => {

    const pages = [];

    const parts = input.split(",");

    parts.forEach((part) => {

      if (part.includes("-")) {

        const [start, end] = part.split("-").map(Number);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

      } else {

        pages.push(Number(part));

      }

    });

    return [...new Set(pages)];
  };

  // SPLIT PDF
  const splitPDF = async () => {

    if (!file || !pageInput) return;

    try {

      setLoading(true);

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await PDFDocument.load(arrayBuffer);

      const totalPages = pdf.getPageCount();

      const selectedPages = parsePages(pageInput);

      const zip = new JSZip();

      for (const pageNum of selectedPages) {

        if (pageNum < 1 || pageNum > totalPages) continue;

        const newPdf = await PDFDocument.create();

        const [copiedPage] = await newPdf.copyPages(pdf, [pageNum - 1]);

        newPdf.addPage(copiedPage);

        const pdfBytes = await newPdf.save();

        zip.file(`page-${pageNum}.pdf`, pdfBytes);
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

      saveAs(zipBlob, "split-pages.zip");

      alert("PDF Split Successfully!");

    } catch (err) {

      console.error(err);

      alert("Error splitting PDF");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">

      <Navbar active="Split" />

      {/* BODY */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-28">

        <h1 className="text-5xl font-bold mb-4">
          Split PDF Files
        </h1>

        <p className="text-gray-600 text-lg mb-4 text-center max-w-2xl">
          Split selected PDF pages and download them as a ZIP file.
        </p>

        <button
          onClick={splitPDF}
          disabled={!file || !pageInput || loading}
          className="px-8 py-3 rounded-2xl mb-4 bg-black text-white font-medium shadow-lg disabled:opacity-40 hover:scale-105 transition-all duration-300"
        >
          {loading ? "Splitting PDF..." : "Split & Download"}
        </button>

        {/* UPLOAD */}
        <label className="w-full max-w-2xl border-2 border-dashed border-gray-300 rounded-3xl bg-white p-12 text-center cursor-pointer hover:border-black transition-all duration-300 shadow-sm">

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="space-y-3">

            <div className="text-5xl">
              📄
            </div>

            <h2 className="text-xl font-semibold">
              Upload PDF File
            </h2>

            <p className="text-gray-500 text-sm">
              Click here to browse your PDF
            </p>

          </div>

        </label>

        {/* FILE */}
        {file && (
          <div className="mt-6 bg-white px-6 py-4 rounded-2xl shadow-sm border text-sm">
            Selected File: <span className="font-medium">{file.name}</span>
          </div>
        )}

        {/* PAGE INPUT */}
        <div className="mt-6 w-full max-w-md">

          <input
            type="text"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            placeholder="Example: 1-5, 8, 10"
            className="w-full px-5 py-4 rounded-2xl border bg-white outline-none focus:ring-2 focus:ring-black shadow-sm"
          />

          <p className="text-xs text-center text-gray-500 mt-2">
            Enter pages or ranges separated by commas.
          </p>

        </div>

      </div>

      <Footer />

    </div>
  );
}