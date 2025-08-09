import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import Auth0ProviderWithHistory from "./auth/Auth0ProviderWithHistory";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CallbackPage from "./components/auth/CallbackPage";
import DashboardPage from "./pages/DashboardPage";
import JournalPage from "./pages/JournalPage";
import MemoryTimelinePage from "./pages/MemoryTimelinePage";
import NotFound from "./pages/NotFound";
import "./App.css";

// Enhanced Landing Page Component
const LandingPage = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const faq = [
    {
      q: "How does AI tagging work, and is it private?",
      a: "Our private AI auto-tags people, places, events, and objects. Face/object detection can run on-device; cloud processing is encrypted in transit and at rest."
    },
    {
      q: "Can I import from Google Photos or iCloud?",
      a: "Yes. Use 1-click import to bring libraries from Google Photos, iCloud, and local drives without changing originals."
    },
    {
      q: "Do you compress my photos?",
      a: "No. Originals are preserved. You can export everything anytime with full metadata."
    },
    {
      q: "What platforms are supported?",
      a: "Web, iOS, Android, macOS, and Windows. Sync keeps libraries consistent across devices."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "FileInASnap",
        "url": "https://fileinasnap.com",
        "logo": "https://fileinasnap.com/logo.svg",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": "support@fileinasnap.com"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "FileInASnap",
        "applicationCategory": "PhotoOrganizerApplication",
        "operatingSystem": "Web, iOS, Android, macOS, Windows",
        "description": "AI photo organizer with automatic tagging, memory timeline, and secure cloud sync.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      },
      {
        "@type": "Product",
        "name": "FileInASnap Pro",
        "description": "AI photo organizer with auto-tagging, memory timeline, deduplication, and private cloud storage.",
        "brand": { "@type": "Brand", "name": "FileInASnap" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faq.map(({ q, a }) => ({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": { "@type": "Answer", "text": a }
        }))
      }
    ]
  };

  return (
    <div>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main">
        {/* HERO WITH OVERLAY NAVIGATION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-neutral-50 min-h-screen">
          {/* Navigation Overlay */}
          <nav
            className="absolute top-0 left-0 right-0 z-50 mx-auto flex max-w-6xl items-center justify-between px-4 py-6"
            aria-label="Primary"
          >
            <a href="/" aria-label="FileInASnap home" className="font-bold text-lg text-white drop-shadow-lg">
              FileInASnap
            </a>
            <ul className="hidden md:flex gap-6 text-sm">
              <li><a href="#features" className="text-white/90 hover:text-white drop-shadow-sm">Features</a></li>
              <li><a href="#pricing" className="text-white/90 hover:text-white drop-shadow-sm">Pricing</a></li>
              <li><a href="#security" className="text-white/90 hover:text-white drop-shadow-sm">Security</a></li>
              <li><a href="#faq" className="text-white/90 hover:text-white drop-shadow-sm">FAQ</a></li>
            </ul>
            <div className="flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => loginWithRedirect()}
                    className="px-3 py-2 text-sm text-white/90 hover:text-white drop-shadow-sm"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => loginWithRedirect()}
                    className="rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-white text-sm font-medium hover:bg-white/30 transition-all"
                  >
                    Get Started Free
                  </button>
                </>
              ) : (
                <>
                  <span className="px-3 py-2 text-sm text-white/90 drop-shadow-sm">Hello, {user?.name}</span>
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-white text-sm font-medium hover:bg-white/30 transition-all"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    className="px-3 py-2 text-sm text-white/90 hover:text-white drop-shadow-sm"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Hero Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/hero-clean.jpg')",
            }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Hero Content - Left side text overlay */}
          <div className="relative z-10 mx-auto flex max-w-6xl items-center min-h-screen px-4 py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-xl">
                Organize your photos automatically with private AI
              </h1>
              <p className="mt-5 text-lg text-white/90 drop-shadow-lg">
                FileInASnap auto-tags, builds a memory timeline, and secures every
                photo, video, and document—so your memories are always easy to find.
              </p>
              <div className="mt-8 flex gap-3">
                {!isAuthenticated ? (
                  <>
                    <button
                      onClick={() => loginWithRedirect()}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-medium shadow-xl transition-all"
                    >
                      Get Started Free
                    </button>
                    <a
                      href="#demo"
                      className="rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 text-white font-medium hover:bg-white/30 transition-all"
                    >
                      Watch Demo
                    </a>
                  </>
                ) : (
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-medium shadow-xl transition-all"
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
              <ul className="mt-6 flex flex-wrap gap-3 text-sm">
                <li className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-white/90">Private by design</li>
                <li className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-white/90">Cross-device sync</li>
                <li className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-white/90">1-click import</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold">
            Find any memory in seconds
          </h2>
          <p className="mt-2 max-w-2xl text-neutral-700">
            The AI photo organizer that auto-tags images, builds a{" "}
            <strong>memory timeline</strong>, and keeps everything in{" "}
            <strong>secure photo storage</strong>.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border p-6">
              <h3 className="font-semibold">AI Review</h3>
              <p className="mt-2 text-neutral-700">
                Smart analysis with automatic tags for people, places, events, and
                objects. Create albums instantly and <em>auto-tag photos</em>.
              </p>
            </article>
            <article className="rounded-2xl border p-6">
              <h3 className="font-semibold">Memory Timeline</h3>
              <p className="mt-2 text-neutral-700">
                A beautiful, scrollable timeline that highlights moments, trips, and
                milestones—no manual sorting. The perfect{" "}
                <em>memory timeline app</em>.
              </p>
            </article>
            <article className="rounded-2xl border p-6">
              <h3 className="font-semibold">Secure Cloud Storage</h3>
              <p className="mt-2 text-neutral-700">
                Encrypted sync and granular sharing. Your data stays yours in our{" "}
                <em>private cloud photo storage</em>.
              </p>
            </article>
          </div>
        </section>

        {/* DIFFERENTIATOR */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Built for <span className="whitespace-nowrap">organizing—</span>not just storing
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2 text-neutral-700">
            <li>✓ Automatic tagging tuned for personal libraries</li>
            <li>✓ Local/on-device processing options for face & object detection</li>
            <li>✓ Lightning search by tag, date, location, camera model</li>
            <li>✓ Smart deduplication and burst grouping</li>
            <li>✓ Import from iCloud, Google Photos, and drives</li>
            <li>✓ Export originals anytime with full metadata</li>
          </ul>
        </section>

        {/* PRIVACY / TRUST */}
        <section id="security" className="mx-auto max-w-6xl px-4 py-16 bg-neutral-50 rounded-[2rem]">
          <h2 className="text-3xl md:text-4xl font-bold">
            Private by default, secure by design
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3 text-neutral-700">
            <div>
              <h3 className="font-semibold">End-to-end encryption</h3>
              <p className="mt-2">Cloud sync protected in transit and at rest.</p>
            </div>
            <div>
              <h3 className="font-semibold">Data ownership</h3>
              <p className="mt-2">Export originals anytime with full metadata.</p>
            </div>
            <div>
              <h3 className="font-semibold">No ads. No data sale.</h3>
              <p className="mt-2">We make money from subscriptions—not your data.</p>
            </div>
          </div>
          <div className="mt-6 flex gap-3 text-sm">
            <span className="rounded-full border px-3 py-1">GDPR-ready</span>
            <span className="rounded-full border px-3 py-1">Auth0 secure sign-in</span>
            <span className="rounded-full border px-3 py-1">Supabase storage</span>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Loved by people who love their photos
          </h2>
          <p className="mt-2 text-neutral-700">
            Join thousands of families and creators organizing memories with AI.
          </p>
        </section>

        {/* DEMO */}
        <section id="demo" className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold">See how it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <figure className="rounded-2xl border p-2">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl aspect-video flex items-center justify-center">
                <p className="text-neutral-600">AI Review Demo</p>
              </div>
              <figcaption className="p-3 text-sm text-neutral-600">
                AI Review groups by subject and event for instant albums.
              </figcaption>
            </figure>
            <figure className="rounded-2xl border p-2">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl aspect-video flex items-center justify-center">
                <p className="text-neutral-600">Timeline Demo</p>
              </div>
              <figcaption className="p-3 text-sm text-neutral-600">
                Memory Timeline surfaces milestones without manual sorting.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* PRICING TEASER */}
        <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-2 text-neutral-700">
            Start free. Upgrade for family sharing, priority sync, and Pro AI limits.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border p-6">
              <h3 className="font-semibold">Free</h3>
              <p className="mt-2 text-2xl font-bold">$0<span className="text-base font-normal">/month</span></p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                <li>✓ 1,000 photos</li>
                <li>✓ Basic AI tagging</li>
                <li>✓ Web access</li>
                <li>✓ 1GB storage</li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-blue-500 p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">Popular</span>
              </div>
              <h3 className="font-semibold">Pro</h3>
              <p className="mt-2 text-2xl font-bold">$9<span className="text-base font-normal">/month</span></p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                <li>✓ Unlimited photos</li>
                <li>✓ Advanced AI features</li>
                <li>✓ All device apps</li>
                <li>✓ 100GB storage</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
            <div className="rounded-2xl border p-6">
              <h3 className="font-semibold">Family</h3>
              <p className="mt-2 text-2xl font-bold">$19<span className="text-base font-normal">month</span></p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                <li>✓ Everything in Pro</li>
                <li>✓ Up to 6 members</li>
                <li>✓ Shared albums</li>
                <li>✓ 1TB storage</li>
                <li>✓ Family timeline</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold">Frequently asked questions</h2>
          <dl className="mt-6 divide-y">
            {faq.map(({ q, a }) => (
              <div key={q} className="py-4">
                <dt className="font-semibold">{q}</dt>
                <dd className="mt-2 text-neutral-700">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* FINAL CTA */}
        <section className="mx-auto max-w-6xl px-4 py-20 text-center bg-gradient-to-b from-neutral-50 to-white rounded-[2rem]">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to love your photo library again?
          </h2>
          <div className="mt-6 flex justify-center gap-3">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => loginWithRedirect()}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-white font-medium"
                >
                  Get Started Free
                </button>
                <a href="#demo" className="rounded-xl border px-5 py-3 font-medium">
                  Watch Demo
                </a>
              </>
            ) : (
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="rounded-xl bg-blue-600 px-5 py-3 text-white font-medium"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600 grid gap-4 md:grid-cols-3">
          <div>© {new Date().getFullYear()} FileInASnap</div>
          <nav className="flex gap-4 justify-center">
            <a href="#security">Security & Privacy</a>
            <a href="#faq">FAQ</a>
            <a href="mailto:support@fileinasnap.com">Support</a>
          </nav>
          <div className="md:text-right">Made with Make.com orchestration & Supabase backend</div>
        </div>
      </footer>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Auth0ProviderWithHistory>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/journal" 
          element={
            <ProtectedRoute>
              <JournalPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/timeline" 
          element={
            <ProtectedRoute>
              <MemoryTimelinePage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Auth0ProviderWithHistory>
  </BrowserRouter>
);

export default App;
