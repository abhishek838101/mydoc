import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home.jsx";
import MergePDF from "./components/pages/MergePDF.jsx";
import SplitPDF from "./components/pages/SplitPDF.jsx";
import UnlockPdf from "./components/pages/UnlockPdf.jsx";

export default function App() {

  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/merge" element={<MergePDF />} />

      <Route path="/split" element={<SplitPDF />} />

      <Route path="/unlock" element={<UnlockPdf />} />
    </Routes>
  );
}