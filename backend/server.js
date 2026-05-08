const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { PDFDocument } = require("pdf-lib");

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());

// 🔥 Upload config
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

// 🔥 Handle size errors
app.use((err, req, res, next) => {
  if (err) {
    return res.status(413).send("File too large (max 50MB)");
  }
  next();
});

// 🔥 Temp folder
const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// 🔥 QPDF PATH
const QPDF_PATH = `"C:\\Program Files\\qpdf 12.3.2\\bin\\qpdf.exe"`;

// 🔥 Unlock PDF
const unlockPDF = (inputPath, outputPath, password = "") => {
  return new Promise((resolve, reject) => {
    const cmd = password
      ? `${QPDF_PATH} --password=${password} --decrypt "${inputPath}" "${outputPath}"`
      : `${QPDF_PATH} --decrypt "${inputPath}" "${outputPath}"`;

    exec(cmd, (err, stdout, stderr) => {
      const output = (stdout + stderr).toLowerCase();

      if (err) {
        console.log("❌ qpdf error:", output);

        if (
          output.includes("password") ||
          output.includes("invalid") ||
          output.includes("incorrect")
        ) {
          return reject({ type: "PASSWORD_REQUIRED" });
        }

        return reject({ type: "CORRUPT", error: output });
      }

      resolve();
    });
  });
};

// 🔥 Merge API
app.post("/merge", async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).send("No files uploaded");
    }

    let files = req.files.files;
    if (!Array.isArray(files)) files = [files];

    let passwords = [];
    if (req.body.passwords) {
      try {
        passwords = JSON.parse(req.body.passwords);
      } catch {
        return res.status(400).send("Invalid passwords format");
      }
    }

    const mergedPdf = await PDFDocument.create();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const inputPath = path.join(tempDir, `input_${i}.pdf`);
      const unlockedPath = path.join(tempDir, `unlocked_${i}.pdf`);

      // ✅ HANDLE EMPTY / INVALID FILE
      if (!file.data || file.data.length < 100) {
        console.log("⚠️ Creating blank page for:", file.name);
        mergedPdf.addPage([595, 842]); // A4
        continue;
      }

      // Save file
      fs.writeFileSync(inputPath, file.data);

      let finalPath = inputPath;

      // 🔐 Try unlock
      try {
        await unlockPDF(
          inputPath,
          unlockedPath,
          passwords[i] || ""
        );
        finalPath = unlockedPath;
      } catch (err) {
        if (err.type === "PASSWORD_REQUIRED") {
          return res.status(401).json({
            type: "PASSWORD_REQUIRED",
            fileIndex: i,
            fileName: file.name,
          });
        }

        // ⚠️ Corrupt → try loading original directly
        console.log("⚠️ Using original file:", file.name);
        finalPath = inputPath;
      }

      // 🔥 Load PDF safely
      try {
        const pdfBytes = fs.readFileSync(finalPath);

        const pdf = await PDFDocument.load(pdfBytes, {
          ignoreEncryption: true,
          throwOnInvalidObject: false,
        });

        const pages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        pages.forEach((p) => mergedPdf.addPage(p));

      } catch (err) {
        console.log("❌ Completely failed:", file.name);

        // 👉 LAST FALLBACK: insert blank page instead of skipping
        mergedPdf.addPage([595, 842]);
      }

      // 🧹 Cleanup
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(unlockedPath)) fs.unlinkSync(unlockedPath);
    }

    if (mergedPdf.getPageCount() === 0) {
      return res.status(400).send("No valid PDFs to merge");
    }

    const bytes = await mergedPdf.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=merged.pdf"
    );

    res.send(Buffer.from(bytes));

  } catch (err) {
    console.error("🔥 Merge error:", err);
    res.status(500).send("Merge failed");
  }
});

// 🚀 Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});