import { Link } from "react-router-dom";

export default function Footer() {
  return (

    <footer className="mt-auto w-full border-t bg-white px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-5 text-gray-500 text-xs">

      {/* LEFT */}
      <p>© 2026 Dr. Docs. All rights reserved.</p>

      {/* CENTER */}
      <div className="flex items-center gap-4 flex-wrap justify-center">

        <a
          href="https://github.com/abhishek838101"
          target="_blank"
          rel="noreferrer"
          className="text-gray-500 hover:text-black transition flex items-center gap-1"
        >
          Made with
          <span className="text-red-500 text-sm">❤️</span>
          by
          <span className="font-semibold text-gray-700">
            Abhishek Varshney
          </span>
        </a>

        <span className="hidden md:block text-gray-300">|</span>

        <a
          href="https://buymeacoffee.com/"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-medium transition-all duration-300 shadow-sm hover:scale-105"
        >
          ☕ Buy Me a Coffee
        </a>

      </div>

      {/* RIGHT */}
      <div className="flex flex-wrap justify-center gap-4">

        <Link
          to="/terms"
          className="hover:text-black transition"
        >
          Terms & Conditions
        </Link>

        <Link
          to="/privacy"
          className="hover:text-black transition"
        >
          Privacy Policy
        </Link>

        <Link
          to="/cookies"
          className="hover:text-black transition"
        >
          Cookies
        </Link>

      </div>

    </footer>

  );
}