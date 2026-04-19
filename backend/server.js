const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { PDFDocument, degrees } = require("pdf-lib");

const app = express();

app.use(cors());

app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    abortOnLimit: true,
  })
);

app.post("/merge", async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).send("No files uploaded");
    }

    let files = req.files.files;

    // Ensure array
    if (!Array.isArray(files)) {
      files = [files];
    }

    // ✅ Get rotations from frontend
    let rotations = [];
    if (req.body.rotations) {
      try {
        rotations = JSON.parse(req.body.rotations);
      } catch {
        return res.status(400).send("Invalid rotation data");
      }
    }

    const mergedPdf = await PDFDocument.create();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // ✅ Validate file type
      if (file.mimetype !== "application/pdf") {
        return res.status(400).send("Only PDF files allowed");
      }

      const rotation = rotations[i] || 0;

      const pdf = await PDFDocument.load(file.data);

      const pages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );

      pages.forEach((page) => {
        // 🔄 Apply rotation
        page.setRotation(degrees(rotation));
        mergedPdf.addPage(page);
      });
    }

    const bytes = await mergedPdf.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=merged.pdf"
    );

    res.send(Buffer.from(bytes));

  } catch (err) {
    console.error("Merge error:", err);
    res.status(500).send("Server error while merging PDFs");
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});