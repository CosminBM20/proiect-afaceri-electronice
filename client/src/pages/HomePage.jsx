import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-[100vh] flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* HERO SECTION */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-6 lg:pt-16 lg:pb-8 flex-grow">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Text */}
          <div>
            <p className="text-sm font-semibold tracking-wide text-emerald-400 uppercase mb-3">
              SkyShop Aircraft Marketplace
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Manage and explore
              <span className="text-emerald-400"> premium aircraft</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl mb-8">
              From light trainers to long-range business jets and commercial airliners,
              browse, manage and order aircraft in a modern, secure dashboard.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/40 hover:bg-emerald-500 transition"
              >
                Explore aircraft catalog
              </Link>

              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-100 hover:border-emerald-500 hover:text-emerald-300 transition"
              >
                View cart & orders
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-400">
              <div>
                <p className="font-semibold text-slate-200">+20</p>
                <p>Aircraft types</p>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Realistic</p>
                <p>Prices & categories</p>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Secure</p>
                <p>JWT authentication</p>
              </div>
            </div>
          </div>

          {/* Image / mock card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />
            <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl overflow-hidden">
              <div className="h-48 sm:h-56 bg-[url('https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg')] bg-cover bg-center" />
              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-emerald-400">
                      Featured aircraft
                    </p>
                    <h2 className="text-lg font-semibold">Gulfstream G650</h2>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/40">
                    Business Jet
                  </span>
                </div>

                <p className="text-sm text-slate-300">
                  Ultra long-range business jet with luxurious cabin, advanced avionics
                  and intercontinental performance.
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <div>
                    <p className="text-xs text-slate-400">Estimated price</p>
                    <p className="text-base font-semibold text-emerald-400">
                      $65,000,000
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 underline underline-offset-4"
                  >
                    View all aircraft
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* FOOTER MINI */}
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500 mt-auto">
        SkyShop · Aircraft e-commerce · Built by Cosmin © 2025-2026
      </footer>
    </div>
  );
}
