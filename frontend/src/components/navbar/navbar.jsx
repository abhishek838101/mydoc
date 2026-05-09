import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ active }) {

  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Merge",
      path: "/merge",
    },
    {
      name: "Split",
      path: "/split",
    },
    // {
    //   name: "Compress",
    //   path: "/compress",
    // },
    // {
    //   name: "Reorder",
    //   path: "/reorder",
    // },
  ];

  return (
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

        {/* DESKTOP NAV */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-3 text-sm">

          {navItems.map((item) => (

            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300
              
              ${
                active === item.name
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              {item.name}
            </Link>

          ))}

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
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-2xl shadow-xl overflow-hidden">

              {navItems.map((item) => (

                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block w-full text-left px-4 py-3 text-sm transition
                  
                  ${
                    active === item.name
                      ? "bg-black text-white font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>

              ))}

            </div>
          )}

        </div>

      </div>

    </header>
  );
}