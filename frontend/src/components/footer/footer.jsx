import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {

  const [openSupport, setOpenSupport] =
    useState(false);

  const upiId = "7409012617@ptsbi";

  return (

    <>
      <footer className="mt-auto w-full border-t bg-white px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-5 text-gray-500 text-xs">

        {/* LEFT */}
        <p>
          © 2026 Dr. Docs. All rights reserved.
        </p>

        {/* CENTER */}
        <div className="flex items-center gap-4 flex-wrap justify-center">

          <a
            href="https://github.com/abhishek838101"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 hover:text-black transition flex items-center gap-1"
          >
            Made with
            <span className="text-red-500 text-sm">
              ❤️
            </span>
            by
            <span className="font-semibold text-gray-700">
              Abhishek Varshney
            </span>
          </a>

          <span className="hidden md:block text-gray-300">
            |
          </span>

          {/* 🔥 SUPPORT BUTTON */}
          <button
            onClick={() =>
              setOpenSupport(true)
            }
            className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-medium transition-all duration-300 shadow-sm hover:scale-105"
          >
            🖤 Show Some Love
          </button>

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

      {/* 🔥 SUPPORT MODAL */}
      {openSupport && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] px-6">

          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative animate-in fade-in zoom-in duration-200">

            {/* CLOSE */}
            <button
              onClick={() =>
                setOpenSupport(false)
              }
              className="absolute top-4 right-4 text-xl hover:scale-110 transition-all"
            >
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-3xl font-bold text-center mb-2">

              Support Dr.Docs

            </h2>

            <p className="text-gray-500 text-center mb-6 leading-6">

              Help us keep these tools free and improving ❤️

            </p>

            {/* QR IMAGE */}
            <div className="flex justify-center mb-6">

              <img
                src="/qr.jpeg"
                alt="UPI QR"
                className="w-56 h-56 object-contain rounded-2xl border p-2"
              />

            </div>

            {/* UPI */}
            <div className="bg-gray-100 rounded-2xl px-4 py-4 text-center mb-5">

              <p className="text-sm text-gray-500 mb-1">
                UPI ID
              </p>

              <p className="font-semibold text-lg break-all">

                {upiId}

              </p>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">

              {/* COPY UPI */}
              <button
                onClick={() => {

                  navigator.clipboard.writeText(
                    upiId
                  );

                  const btn =
                    document.getElementById("copy-upi-btn");

                  if (btn) {

                    btn.innerText = "UPI ID Copied ✓";

                    setTimeout(() => {
                      btn.innerText = "Copy UPI";
                    }, 2000);
                  }
                }}
                id="copy-upi-btn"
                className="flex-1 py-3 rounded-2xl border hover:bg-gray-100 transition-all duration-300"
              >
                Copy UPI
              </button>

              {/* MOBILE ONLY PAY BUTTON */}
              {/Android|iPhone|iPad|iPod/i.test(
                navigator.userAgent
              ) && (

                <a
                  href={`upi://pay?pa=${upiId}&pn=DrDocs&cu=INR`}
                  className="flex-1 py-3 rounded-2xl bg-black text-white text-center hover:bg-gray-800 transition-all duration-300"
                >
                  Pay Now
                </a>

              )}

            </div>
          </div>

        </div>

      )}

    </>
  );
}