import { Link } from "react-router-dom";

export default function TermsAndConditions() {
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
              Terms & Conditions
            </h1>

            <p className="text-gray-600 leading-7 text-sm">
              These Terms & Conditions govern your access to and use of
              the Dr.Docs platform. By accessing or using our services,
              you agree to comply with the policies and legal obligations
              outlined below.
            </p>

          </div>

          {/* CONTENT */}
          <div className="space-y-12">

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                1. Acceptance of Terms
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                By accessing and using Dr.Docs, you confirm that you have
                read, understood, and agreed to these Terms &
                Conditions. Continued use of the platform indicates
                acceptance of any future updates or modifications.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                2. Use of Services
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Users are responsible for ensuring that uploaded content
                complies with applicable laws. Uploading harmful,
                illegal, or malicious content is strictly prohibited.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                3. Privacy & Security
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Dr.Docs applies reasonable measures to protect uploaded
                documents and user information. However, users should
                maintain backup copies of important files.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                4. Limitation of Liability
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Dr.Docs shall not be held liable for damages, data loss,
                or service interruptions resulting from use of the
                platform.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                5. Modifications to Terms
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                We reserve the right to modify these terms at any time.
                Continued use of Dr.Docs following updates constitutes
                acceptance of the revised terms.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                6. File Retention
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Uploaded files may be temporarily stored for processing and
                performance optimization purposes. Users are responsible for
                maintaining personal backups of important documents before
                using the platform.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                7. Prohibited Activities
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Users must not attempt to misuse the platform, bypass security
                mechanisms, upload malicious software, or interfere with normal
                system operations. Violations may result in restricted access
                or permanent suspension.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                8. Third-Party Services
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Dr.Docs may rely on third-party libraries, APIs, or hosting
                providers for certain functionality. We are not responsible
                for interruptions or issues caused by external services.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                9. Service Availability
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                While we strive to provide uninterrupted service, Dr.Docs does
                not guarantee continuous availability. Maintenance, updates,
                or technical issues may temporarily affect platform access.
              </p>
            </section>

            <section className="pb-10">
              <h2 className="text-lg font-semibold mb-3">
                10. Contact & Support
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                For questions regarding these Terms & Conditions or support
                related inquiries, users may contact the Dr.Docs support team
                through official communication channels provided on the platform.
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