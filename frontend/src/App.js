import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth0 } from '@auth0/auth0-react';
import Auth0ProviderWithHistory from "./auth/Auth0ProviderWithHistory";
import LoginButton from "./components/auth/LoginButton";
import LogoutButton from "./components/auth/LogoutButton";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import axios from "axios";
import "./App.css";

// Import new components
import DashboardPage from "./pages/DashboardPage";
import JournalPage from "./pages/JournalPage";
import MemoryTimelinePage from "./pages/MemoryTimelinePage";
import NotFound from "./pages/NotFound";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Our enhanced landing page component with Auth0 integration
const FileInASnapLanding = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth0();
  const [plans, setPlans] = useState({});
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API}/plans`);
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  // Handle Auth0 errors gracefully without showing modal overlays
  if (error) {
    console.error('Auth0 error:', error);
    // Don't show error overlays, just log and continue with non-authenticated experience
  }

  const VideoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-8 w-full max-w-4xl relative"
      >
        <button 
          onClick={() => setShowVideoModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">FileInASnap Demo</h2>
          <div className="bg-gray-100 rounded-lg p-8 mb-6">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-lg text-gray-600">Demo video coming soon!</p>
            <p className="text-sm text-gray-500 mt-2">
              See how FileInASnap automatically organizes your files with AI-powered intelligence.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <LoginButton className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
              Start Free Trial
            </LoginButton>
            <button
              onClick={() => setShowVideoModal(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Full Background Image */}
      <section 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url('https://customer-assets.emergentagent.com/job_fileinsnap/artifacts/5ebv4t83_ChatGPT%20Image%20Jul%2016%2C%202025%2C%2003_47_10%20PM.png')`
        }}
      >
        {/* Invisible interactive areas positioned over the image elements */}
        
        {/* Header Navigation Interactive Areas */}
        <div className="absolute top-0 left-0 right-0 z-10 p-6 lg:px-12">
          {/* Logo area */}
          <div className="absolute left-6 lg:left-12 top-6 flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 opacity-0"></div>
            <span className="text-2xl opacity-0">FileInASnap</span>
          </div>
          
          {/* Navigation links - FIXED */}
          <nav className="absolute top-6 left-1/2 transform -translate-x-1/2 hidden lg:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-gray-800 hover:text-blue-600 font-medium px-4 py-2 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-gray-800 hover:text-blue-600 font-medium px-4 py-2 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Pricing
            </a>
            <a 
              href="#about" 
              className="text-gray-800 hover:text-blue-600 font-medium px-4 py-2 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              About
            </a>
          </nav>
          
          {/* Sign Up button area - FIXED */}
          <div className="absolute right-6 lg:right-12 top-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-800 bg-white bg-opacity-80 px-3 py-1 rounded">
                  Welcome, {user?.name || user?.email}
                </span>
                <LogoutButton className="px-4 py-2 text-gray-800 bg-white bg-opacity-80 rounded hover:bg-opacity-100 transition-all" />
              </div>
            ) : (
              <LoginButton 
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
                style={{ width: '100px', height: '48px' }}
              >
                Sign Up
              </LoginButton>
            )}
          </div>
        </div>

        {/* CTA Buttons Interactive Areas - FIXED */}
        <div className="absolute bottom-1/3 left-12 z-10">
          <div className="flex space-x-4">
            {/* Start Free button - FIXED to use proper LoginButton */}
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/dashboard'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
                style={{ width: '160px', height: '60px' }}
              >
                Go to Dashboard
              </motion.button>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ width: '160px', height: '60px' }}
              >
                <LoginButton className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg w-full h-full">
                  Start Free
                </LoginButton>
              </motion.div>
            )}
            
            {/* Watch Demo button - FUNCTIONAL */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVideoModal(true)}
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-200 transition-all shadow-lg"
              style={{ width: '160px', height: '60px' }}
            >
              Watch Demo
            </motion.button>
          </div>
          
          {/* Hidden login trigger for Start Free button */}
          <div style={{ display: 'none' }}>
            <LoginButton data-auth="login">Hidden Login</LoginButton>
          </div>
        </div>

        {/* Mobile responsive overlay */}
        <div className="lg:hidden absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-6 z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-md"
          >
            <h1 className="text-3xl font-bold mb-4 leading-tight">
              Organize your life's memories effortlessly
            </h1>
            
            <p className="text-lg mb-6 leading-relaxed opacity-90">
              FileInASnap is designed to automatically organize, securely store, and easily share
              all your photos, videos, and documents.
            </p>
            
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
                >
                  Go to Dashboard
                </motion.button>
              ) : (
                <LoginButton className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg">
                  Start Free
                </LoginButton>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVideoModal(true)}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 lg:px-12 py-20 bg-gray-50">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Smart Organization
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform automatically categorizes and organizes your files,
            making it easy to find what you need when you need it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "🤖",
              title: "AI Review",
              description: "Intelligent analysis and automatic tagging of your files for easy organization."
            },
            {
              icon: "📸",
              title: "Memory Timeline",
              description: "Visual timeline of your memories with smart grouping by dates and events."
            },
            {
              icon: "☁️",
              title: "Cloud Storage",
              description: "Secure cloud storage with automatic backup and synchronization across devices."
            },
            {
              icon: "🔒",
              title: "Privacy First",
              description: "End-to-end encryption ensures your memories stay private and secure."
            },
            {
              icon: "🔍",
              title: "Smart Search",
              description: "Find any file instantly with AI-powered search across text, faces, and objects."
            },
            {
              icon: "📱",
              title: "Mobile Access",
              description: "Access your organized files anywhere with our responsive web and mobile apps."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 lg:px-12 py-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade as your needs grow. All plans include our core organizing features.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {Object.entries(plans).map(([key, plan], index) => (
            <motion.div
              key={key}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-xl border-2 transition-all hover:scale-105 ${
                key === 'pro' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              {key === 'pro' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  {plan.price > 0 && <span className="text-gray-500">/month</span>}
                </div>
                
                <ul className="space-y-2 mb-8 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* FUNCTIONAL GET STARTED BUTTON */}
                {isAuthenticated ? (
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      key === 'pro'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Access Dashboard
                  </button>
                ) : (
                  <LoginButton
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      key === 'pro'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Get Started
                  </LoginButton>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 lg:px-12 py-20 bg-gray-50">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            About FileInASnap
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            FileInASnap was born from the frustration of lost photos, scattered documents, and the endless search for that one important file. 
            We believe your memories and documents should be organized automatically, securely stored, and easily accessible whenever you need them.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Using cutting-edge AI technology, we've created a platform that doesn't just store your files – it understands them, 
            organizes them intelligently, and makes them discoverable in ways you never thought possible.
          </p>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-20 bg-blue-600">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Start organizing your memories today
          </h2>
          <p className="text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who have already transformed how they manage their files.
          </p>
          
          {/* FUNCTIONAL CTA BUTTON */}
          {isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/dashboard'}
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
            >
              Go to Dashboard
            </motion.button>
          ) : (
            <LoginButton className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg">
              Get Started Free
            </LoginButton>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 bg-gray-900 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 lg:mb-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">📁</span>
            </div>
            <span className="text-xl font-bold">FileInASnap</span>
          </div>
          
          <div className="flex space-x-8 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; 2025 FileInASnap. All rights reserved.</p>
        </div>
      </footer>

      {/* Video Demo Modal */}
      {showVideoModal && <VideoModal />}
    </div>
  );
};

// Main App with Auth0 integration and routing
const App = () => (
  <BrowserRouter>
    <Auth0ProviderWithHistory>
      <Routes>
        <Route path="/" element={<FileInASnapLanding />} />
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
