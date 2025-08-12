import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { AuthModal } from './components/AuthModal';
import AuthTester from './components/auth/AuthTester';
import DashboardPage from './pages/DashboardPage';
import {
  Upload, 
  Sparkles, 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  Star,
  PlayCircle,
  Check,
  ArrowRight,
  FileText,
  Image,
  Video,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import UploadModal from './components/upload/UploadModal';
import { FadeIn, StaggerContainer, FloatingCard, PhotoGalleryDemo, TimelineDemo, SearchDemo } from './components/ui/AnimatedElements';
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  if (!user) {
    window.location.href = '/';
    return null;
  }
  
  return children;
};

// Enhanced Landing Page Component
const LandingPage = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [dbHealth, setDbHealth] = useState({ ok: true, bucket_ok: true, rpc_ok: true, loading: true });

  // Auto-redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    // Handle scroll effects
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Testimonial carousel
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    // DB health check (relative path so it works with current :3000 proxy/setup)
    fetch(`/db-health`)
      .then((r) => r.json())
      .then((data) => setDbHealth({ ...data, loading: false }))
      .catch(() => setDbHealth({ ok: false, bucket_ok: false, rpc_ok: false, loading: false }));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(testimonialInterval);
    };
  }, []);
  
  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };
  
  const handleSignOut = async () => {
    await signOut();
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Family Photographer",
      content: "FileInASnap transformed how I organize 10,000+ family photos. The AI tagging is incredibly accurate and the timeline feature helps me relive precious moments.",
      avatar: "👩‍💼",
      rating: 5
    },
    {
      name: "Marcus Thompson",
      role: "Travel Blogger",
      content: "Finally, a photo organizer that understands my workflow. The location-based grouping and instant search make finding the perfect shot effortless.",
      avatar: "🧳",
      rating: 5
    },
    {
      name: "Dr. Emma Rodriguez",
      role: "Memory Researcher",
      content: "The privacy-first approach gives me confidence storing sensitive research photos. On-device processing means my data never leaves my control.",
      avatar: "🔬",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Smart AI Recognition",
      description: "Advanced computer vision identifies faces, objects, scenes, and text with industry-leading accuracy.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Sparkles,
      title: "Auto-Tagging Magic",
      description: "Every photo gets tagged automatically. Search 'beach sunset' or 'birthday party' and find exactly what you're looking for.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Privacy by Design",
      description: "Your memories stay private. Choose on-device processing or encrypted cloud analysis - you're always in control.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast Search",
      description: "Find any photo in milliseconds. Search by people, places, dates, or even the objects in your photos.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Family Sharing",
      description: "Create shared albums with granular permissions. Everyone gets their memories while maintaining privacy.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Upload,
      title: "Universal Import",
      description: "Seamlessly import from Google Photos, iCloud, Dropbox, or local drives without losing any metadata.",
      color: "from-indigo-500 to-purple-500"
    }
  ];

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

  // Compute a compact health status for header pill
  const health = React.useMemo(() => {
    if (dbHealth.loading) return { label: 'Checking…', color: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-400', glow: 'shadow-none' };
    if (dbHealth.ok && dbHealth.bucket_ok) {
      return { label: 'All systems go', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', glow: 'shadow-[0_0_0_3px_rgba(16,185,129,0.15)] ring-1 ring-emerald-300/40' };
    }
    if (dbHealth.ok && !dbHealth.bucket_ok) {
      return { label: 'Storage issue', color: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500', glow: 'shadow-[0_0_0_3px_rgba(245,158,11,0.18)] ring-1 ring-amber-300/40' };
    }
    return { label: 'Offline', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500', glow: 'shadow-[0_0_0_3px_rgba(239,68,68,0.2)] ring-1 ring-red-300/40' };
  }, [dbHealth]);

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

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      )}
      
      {/* Upload Modal */}
      {uploadModalOpen && (
        <UploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
        />
      )}

      {/* Remove backend health warning banner */}
      <main id="main">
        {/* Hero Section - Clean Two-Column Layout */}
        <section className="relative min-h-screen bg-white overflow-hidden">
          {/* Simplified Navigation Bar */}
          <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              isScrolled 
                ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg' 
                : 'bg-white/90 backdrop-blur-sm border-b border-gray-100/50'
            }`}
            aria-label="Primary"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo - Smart Navigation */}
                <button 
                  onClick={() => {
                    if (isAuthenticated) {
                      window.location.href = '/dashboard';
                    } else {
                      window.location.href = '/';
                    }
                  }}
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-gray-900">FileInASnap</span>
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  {!isAuthenticated ? (
                    <>
                      <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</a>
                      <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Pricing</a>
                      <a href="#faq" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">FAQ</a>
                    </>
                  ) : (
                    <>
                      <button onClick={() => window.location.href = '/dashboard'} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Photos</button>
                      <button onClick={() => setUploadModalOpen(true)} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Upload</button>
                    </>
                  )}
                  <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Blog</a>
                </div>

                {/* Status & Auth */}
                <div className="hidden md:flex items-center gap-3">
                  <span
                    title={`ok=${String(dbHealth.ok)} | bucket_ok=${String(dbHealth.bucket_ok)}`}
                    className={`inline-flex items-center gap-2 border ${health.color} ${health.glow} rounded-full px-3 py-1 text-xs font-medium transition-shadow`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full ${health.dot}`}></span>
                    <span>{health.label}</span>
                  </span>
                  
                  {!isAuthenticated ? (
                    <button
                      onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                      className="rounded-lg bg-yellow-400 hover:bg-yellow-500 px-5 py-2 text-gray-900 text-sm font-semibold transition-all shadow-sm"
                    >
                      Sign Up
                    </button>
                  ) : (
                    <>
                      <span className="text-sm text-gray-700">Hello, {user?.email?.split('@')[0]}</span>
                      <button onClick={() => window.location.href = '/dashboard'} className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white text-sm font-medium transition-all">Dashboard</button>
                      <button onClick={handleSignOut} className="text-sm text-gray-700 hover:text-gray-900">Logout</button>
                    </>
                  )}
                </div>

                {/* Mobile menu button */}
                <button
                  className="md:hidden inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white/80 p-2 shadow-sm"
                  aria-label="Open menu"
                  onClick={() => setMobileMenuOpen(v => !v)}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                </button>
              </div>

              {/* Mobile dropdown */}
              {mobileMenuOpen && (
                <div className="md:hidden mt-3 rounded-lg border border-gray-100 bg-white/95 backdrop-blur-lg shadow-xl p-4 space-y-3">
                  {!isAuthenticated ? (
                    <>
                      <a href="#features" className="block text-gray-800 hover:text-blue-600 transition-colors">Features</a>
                      <a href="#pricing" className="block text-gray-800 hover:text-blue-600 transition-colors">Pricing</a>
                      <a href="#faq" className="block text-gray-800 hover:text-blue-600 transition-colors">FAQ</a>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { window.location.href = '/dashboard'; setMobileMenuOpen(false); }} className="block w-full text-left text-gray-800 hover:text-blue-600 transition-colors">Photos</button>
                      <button onClick={() => { setUploadModalOpen(true); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-800 hover:text-blue-600 transition-colors">Upload</button>
                    </>
                  )}
                  <a href="/blog" className="block text-gray-800 hover:text-blue-600 transition-colors">Blog</a>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <span
                      className={`inline-flex items-center gap-2 border ${health.color} ${health.glow} rounded-full px-3 py-1 text-xs font-medium transition-shadow`}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full ${health.dot}`}></span>
                      <span>{health.label}</span>
                    </span>
                  </div>
                  
                  {!isAuthenticated ? (
                    <button onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }} className="w-full rounded-lg bg-yellow-400 hover:bg-yellow-500 px-4 py-2 text-gray-900 font-semibold transition-all">Sign Up</button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => window.location.href = '/dashboard'} className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white font-medium">Dashboard</button>
                      <button onClick={handleSignOut} className="flex-1 rounded-lg border px-4 py-2">Logout</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Two-Column Hero Content */}
          <div className="pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
              <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center min-h-[720px] lg:min-h-[calc(100vh-4rem)]">
                {/* Left Column - Text Content (Max 560px width) */}
                <div className="lg:col-span-6 xl:col-span-5 max-w-[560px]">
                  {/* Badge */}
                  <div className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
                    <Sparkles className="w-4 h-4 mr-2" />
                    New: AI-powered memory timeline
                  </div>
                  
                  {/* Main Headline with Exact Line Breaks */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
                    <span className="block leading-tight">Organize your photos</span>
                    <span className="block leading-tight bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">automatically</span>
                    <span className="block leading-tight">with private AI</span>
                  </h1>
                  
                  <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                    FileInASnap auto-tags, builds a memory timeline, and secures every
                    photo, video, and document—so your memories are always easy to find.
                  </p>
                  
                  {/* Feature Badges - Clean Row */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                      <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                        <Shield className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Private by design</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                      <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                        <Zap className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Cross-device sync</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                      <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                        <Upload className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">1-click import</span>
                    </div>
                  </div>
                  
                  {/* CTA Buttons - Fixed Heights with 12px Gap */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {!isAuthenticated ? (
                      <>
                        <button
                          onClick={handleSignIn}
                          className="h-11 px-5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400/60 font-semibold transition-all shadow-lg hover:shadow-xl text-sm"
                        >
                          Get Started Free
                        </button>
                        <a
                          href="#demo"
                          className="h-11 px-5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-semibold transition-all shadow-sm flex items-center justify-center text-sm"
                        >
                          Watch Demo
                        </a>
                      </>
                    ) : (
                      <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="h-11 px-5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400/60 font-semibold transition-all shadow-lg hover:shadow-xl text-sm"
                      >
                        Go to Dashboard
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Right Column - Hero Image (Optimized Aspect Ratio) */}
                <div className="lg:col-span-6 xl:col-span-7 relative mt-12 lg:mt-0">
                  <div className="aspect-[3/2] lg:aspect-[16/9] xl:aspect-[3/2] overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100">
                    <img
                      src="https://res.cloudinary.com/emergent-app/image/upload/v1723412039/fileinsnap_v2_0_main_frontend_src_components_ui_Organize_your_photos_automatically_with_private_AI._so_your_memories_are_always_easy_to_find._s3n0rf.png"
                      alt="Woman smiling while using FileInASnap on her phone, with AI-powered photo organization interface showing memory timeline, sunset photos, and smart categorization features"
                      className="w-full h-full object-cover object-center"
                      loading="eager"
                      width="1200"
                      height="800"
                      onError={(e) => {
                        console.log('Hero image failed to load, showing fallback');
                        // Safe fallback handling
                        if (e.target && e.target.parentElement) {
                          e.target.style.display = 'none';
                          // Show fallback div
                          const fallbackDiv = e.target.nextElementSibling;
                          if (fallbackDiv) {
                            fallbackDiv.style.display = 'flex';
                          }
                        }
                      }}
                    />
                    {/* Fallback UI - initially hidden */}
                    <div className="hidden w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">AI Photo Organization</h3>
                        <p className="text-sm text-white/80">Smart tagging • Memory timeline • Private by design</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ENHANCED FEATURES SECTION */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Powerful features that work like magic
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-neutral-600 text-lg">
              Advanced AI meets intuitive design to transform how you organize, search, and enjoy your photo collection.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} mb-4 text-white shadow-lg`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                </Card>
              );
            })}
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
            <span className="rounded-full border px-3 py-1">Supabase secure auth</span>
            <span className="rounded-full border px-3 py-1">Supabase storage</span>
          </div>
        </section>

        {/* TESTIMONIALS CAROUSEL */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by people who love their photos
            </h2>
            <p className="text-neutral-600 text-lg">
              Join thousands of families and creators organizing memories with AI.
            </p>
          </div>
          
          <div className="relative">
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl">
              <div className="p-8 md:p-12 text-center">
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-4xl">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentTestimonial
                      ? 'bg-blue-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </section>

        {/* INTERACTIVE DEMO SECTION */}
        <section id="demo" className="mx-auto max-w-6xl px-4 py-20">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">See how it works</h2>
              <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
                Watch our AI in action as it organizes, tags, and creates timelines from your photos automatically.
              </p>
            </div>
          </FadeIn>
          
          <StaggerContainer className="space-y-12" staggerDelay={300}>
            {/* AI Smart Search Demo */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Lightning-Fast AI Search</h3>
              <SearchDemo />
            </div>
            
            {/* Photo Gallery Organization Demo */}
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Smart Photo Organization</h3>
                <p className="text-gray-600 mb-4">
                  Our AI automatically recognizes faces, objects, locations, and events in your photos. 
                  Hover over photos to see the magic in action.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Auto-detects people, places, and objects
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Creates smart tags for instant searching
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Groups similar photos automatically
                  </li>
                </ul>
              </div>
              <PhotoGalleryDemo />
            </div>
            
            {/* Timeline Demo */}
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="order-2 lg:order-1">
                <TimelineDemo />
              </div>
              <div className="order-1 lg:order-2">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Memory Timeline</h3>
                <p className="text-gray-600 mb-4">
                  FileInASnap automatically creates beautiful timelines of your memories, 
                  organizing photos by date, location, and events.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Chronological organization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    Event-based grouping
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    Milestone detection
                  </li>
                </ul>
              </div>
            </div>
          </StaggerContainer>
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
                  onClick={handleSignIn}
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
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth-test" element={<AuthTester />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
