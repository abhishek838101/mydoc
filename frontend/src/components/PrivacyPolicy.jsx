import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="h-screen bg-white text-gray-900 overflow-hidden relative">

      {/* FIXED BACK BUTTON */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300"
      >
        ← Back to Home
      </Link>

      {/* SCROLLABLE CONTENT */}
      <div className="h-screen overflow-y-scroll px-6 py-0 md:px-20">

        <div className="max-w-4xl mx-auto pb-20">

          {/* HEADER */}
          <div className="sticky top-0 bg-white z-40 mb-16 border-b border-gray-200 pb-10 pt-6">

            <h1 className="text-3xl font-bold mb-4 tracking-tight leading-tight">
              Privacy Policy
            </h1>

            <p className="text-gray-600 leading-7 max-w-3xl text-sm">
              This Privacy Policy explains how Dr.Docs collects, uses,
              stores, and protects user information while using the platform.
            </p>

          </div>

          {/* CONTENT */}
          <div className="space-y-12">

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                1. Information Collection
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Dr.Docs may collect limited technical and usage data
                necessary for improving platform performance,
                maintaining security, and enhancing user experience.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                2. Uploaded Files
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Files uploaded to Dr.Docs are processed securely for
                document management functionality. Users are advised
                not to upload highly sensitive or confidential files.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                3. Data Protection
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                We implement reasonable security measures to protect
                user information and uploaded documents against
                unauthorized access or misuse.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                4. Cookies & Analytics
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Dr.Docs may use cookies or analytics tools to improve
                website functionality, monitor performance, and
                enhance overall user experience.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                5. Third-Party Services
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Some platform features may rely on third-party
                services or libraries. Dr.Docs is not responsible for
                the privacy practices of external providers.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                6. Data Retention
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Uploaded files and related technical data may be
                temporarily retained for processing, debugging,
                security, or service optimization purposes.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                7. User Responsibility
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Users are responsible for maintaining copies of
                important files and ensuring uploaded content
                complies with applicable laws and regulations.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                8. Policy Updates
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                This Privacy Policy may be updated periodically to
                reflect platform improvements, legal requirements,
                or operational changes.
              </p>
            </section>

            <section className="pb-10">
              <h2 className="text-lg font-semibold mb-3">
                9. Contact Information
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                For privacy-related questions or support inquiries,
                users may contact the Dr.Docs support team through
                official communication channels.
              </p>
            </section>

          </div>

          {/* FOOTER */}
          <div className="text-center mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © 2026 Dr.Docs. All rights reserved.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}