import { Link } from "react-router-dom";
export default function CookiesPolicy() {
  return (
    <div className="h-screen bg-white text-gray-900 overflow-hidden relative">

      {/* FIXED BACK BUTTON */}
      <Link
        to="/"
        className="fixed top-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300"
      >
        <span className="hidden sm:inline">← Back to Home</span>
        <span className="sm:hidden">←</span>
      </Link>

      {/* SCROLLABLE CONTENT */}
      <div className="h-screen overflow-y-scroll px-6 py-0 md:px-20">

        <div className="max-w-4xl mx-auto pb-20">

          {/* HEADER */}
          <div className="sticky top-0 bg-white z-40 mb-16 border-b border-gray-200 pb-10 pt-6">

            <h1 className="text-3xl font-bold mb-4 tracking-tight leading-tight">
              Cookies Policy
            </h1>

          </div>

          {/* CONTENT */}
          <div className="space-y-12">

            <p className="text-gray-600 leading-7 max-w-3xl text-sm">
              This Cookies Policy explains how Dr.Docs uses cookies,
              tracking technologies, and related tools to improve
              website functionality and user experience.
            </p>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                1. What Are Cookies
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Cookies are small text files stored on your device
                when visiting websites. They help improve site
                performance, remember preferences, and enhance
                overall browsing experience.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                2. How Dr.Docs Uses Cookies
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Dr.Docs may use cookies to maintain platform security,
                analyze traffic, improve performance, remember user
                preferences, and optimize functionality.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                3. Analytics & Performance
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Cookies may be used to collect anonymous analytics
                data regarding user interaction, feature usage,
                device information, and website performance metrics.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                4. Third-Party Cookies
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Certain features or integrations may rely on
                third-party services that use cookies independently.
                Dr.Docs is not responsible for third-party cookie
                practices or policies.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                5. Managing Cookies
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Users may disable or manage cookies through browser
                settings. However, disabling cookies may affect
                certain website features or functionality.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                6. Data Protection
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                Dr.Docs takes reasonable measures to ensure collected
                cookie data is handled securely and responsibly in
                accordance with applicable privacy practices.
              </p>
            </section>

            <section className="pb-10 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">
                7. Updates to This Policy
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                This Cookies Policy may be updated periodically to
                reflect service improvements, technical changes,
                legal requirements, or operational updates.
              </p>
            </section>

            <section className="pb-10">
              <h2 className="text-lg font-semibold mb-3">
                8. Contact Information
              </h2>

              <p className="text-gray-600 leading-7 text-sm">
                For questions related to cookies or tracking
                technologies used by Dr.Docs, users may contact the
                support team through official channels.
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