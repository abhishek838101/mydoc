import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import App from "./App";
import PdfMerger from "./components/merger.jsx";
import SplitPDF from "./components/SplitPDF";
import TermsAndConditions from "./components/footer/TermsAndConditions.jsx";
import PrivacyPolicy from "./components/footer/PrivacyPolicy.jsx";
import CookiesPolicy from "./components/footer/CookiesPolicy.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<App />} />

        <Route
          path="/terms"
          element={<TermsAndConditions />}
        />

        <Route
          path="/privacy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/cookies"
          element={<CookiesPolicy />}
        />

        <Route
          path="/merge"
          element={<PdfMerger />}
        />

        <Route path="/split" element={<SplitPDF />} />
      </Routes>

    </BrowserRouter>
  </StrictMode>
);