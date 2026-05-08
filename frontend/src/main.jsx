import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import TermsAndConditions from "./components/TermsAndConditions.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy";
import CookiesPolicy from "./components/CookiesPolicy";

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
      </Routes>

    </BrowserRouter>
  </StrictMode>
);