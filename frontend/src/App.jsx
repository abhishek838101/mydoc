import { Link } from "react-router-dom";
import { useState } from "react";
import Footer from "./components/footer/footer.jsx";

export default function App() {const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full h-16 bg-white border-b shadow-sm z-50">

        <div className="relative w-full h-full flex items-center px-6">

          {/* LEFT LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <img
              src="/logo.ico"
              alt="Dr. Docs"
              className="w-8 h-8 object-contain"
            />

            <span className="hover:opacity-80 transition">
              Dr. Docs
            </span>
          </Link>

          {/* CENTER NAV (DESKTOP ONLY) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-3 text-sm">

            {/* ACTIVE */}
            <Link
              to="/merge"
              className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black font-medium transition-all duration-300"
            >
              Merge
            </Link>

            {/* INACTIVE */}
            <Link to="/split" className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black font-medium transition-all duration-300">
              Split
            </Link>

            <button className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black font-medium transition-all duration-300">
              Compress
            </button>

            <button className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black font-medium transition-all duration-300">
              Reorder
            </button>

          </div>

          {/* MOBILE MENU */}
          <div className="ml-auto md:hidden relative">

            {/* MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              {menuOpen ? "✕" : "☰ Menu"}
            </button>

            {/* DROPDOWN */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg overflow-hidden">

                <Link to="/" className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-sm font-medium text-black">
                  Merge
                </Link>

                <button className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-100">
                  Split
                </button>

                <button className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-100">
                  Compress
                </button>

                <button className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-100">
                  Reorder
                </button>

              </div>
            )}

          </div>

        </div>

      </header>

      {/* HERO */}
      <section className="flex-1 flex items-center justify-center px-6 pt-24">

        <div className="max-w-6xl text-center">

          <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            Modern Document Management Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">

            Powerful Tools
            <br />

            For Every Document

          </h1>

          <p className="text-gray-600 text-lg leading-8 max-w-3xl mx-auto mb-12">

            Dr. Docs provides modern tools to merge, split, compress,
            convert, organize, and manage documents effortlessly.
            Built for PDFs, Word files, images, presentations,
            spreadsheets, and more — all in one clean platform.

          </p>

          {/* BUTTONS */}
          <div className="flex justify-center gap-4 flex-wrap mb-16">

            <button
              className="px-8 py-4 rounded-2xl bg-black text-white hover:bg-gray-800 transition-all duration-300 text-lg font-medium shadow-lg"
            >
              Open PDF Tools
            </button>

            <button
              className="px-8 py-4 rounded-2xl border border-gray-300 bg-white hover:bg-gray-100 transition-all duration-300 text-lg font-medium"
            >
              Explore Features
            </button>

          </div>

        </div>

      </section>

      <Footer />

    </div>
  );
}