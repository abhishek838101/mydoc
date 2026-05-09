import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">

      <Navbar />

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