import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <section className="max-w-7xl mx-auto px-4 py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Enterprise Marketplace SaaS</p>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Build the next premium multi-tenant commerce platform for customers, vendors, and admins.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Launch a modern e-commerce ecosystem with real-time dashboards, live sales alerts, vendor theme builder, AI support workflows, and PWA-ready storefronts.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Explore Marketplace
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-500 bg-slate-900/80 px-8 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-300"
              >
                Vendor / Admin Login
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Premium experience</p>
              <h2 className="mt-4 text-3xl font-semibold">Future-ready storefronts</h2>
              <p className="mt-3 text-slate-400">
                Deliver lightning-fast shopping, personalized recommendations, voice-ready search, and staged AR-ready product previews.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-400">Real-time insights</p>
                  <p className="mt-2 text-lg font-semibold">Live sales alerts</p>
                </div>
                <div className="rounded-3xl bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-400">Vendor control</p>
                  <p className="mt-2 text-lg font-semibold">Theme & page builder</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-6 shadow-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Analytics</p>
                <h3 className="mt-3 text-2xl font-semibold">Intelligent dashboards</h3>
              </div>
              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-6 shadow-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Support</p>
                <h3 className="mt-3 text-2xl font-semibold">AI chatbot workflows</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
