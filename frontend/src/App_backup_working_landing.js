import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from '@supabase/supabase-js';
import axios from "axios";
import "./App.css";

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FileInASnapLanding = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    fullName: '',
    organization: ''
  });
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState({});

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        setShowAuthModal(false);
      }
    });

    // Fetch plans
    fetchPlans();

    return () => subscription.unsubscribe();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API}/plans`);
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'signup') {
        const response = await axios.post(`${API}/auth/register`, {
          email: authForm.email,
          password: authForm.password,
          full_name: authForm.fullName,
          organization: authForm.organization || null
        });
        
        alert('Registration successful! Please check your email for verification.');
        setAuthMode('signin');
      } else {
        const response = await axios.post(`${API}/auth/login`, {
          email: authForm.email,
          password: authForm.password
        });
        
        // Store token if needed
        localStorage.setItem('access_token', response.data.access_token);
        
        // The auth state change will be handled by the listener
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Authentication failed');
    }
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('access_token');
  };

  const AuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-8 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
          </h2>
          <button 
            onClick={() => setShowAuthModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              required
              value={authForm.email}
              onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              required
              value={authForm.password}
              onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {authMode === 'signup' && (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={authForm.fullName}
                  onChange={(e) => setAuthForm({...authForm, fullName: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="Organization (optional)"
                  value={authForm.organization}
                  onChange={(e) => setAuthForm({...authForm, organization: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : (authMode === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
            className="text-blue-600 hover:underline"
          >
            {authMode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </motion.div>
    </div>
  );

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
          {/* Logo area - clickable */}
          <div className="absolute left-6 lg:left-12 top-6 flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 opacity-0"></div> {/* Transparent overlay for logo */}
            <span className="text-2xl opacity-0">FileInASnap</span> {/* Transparent text for spacing */}
          </div>
          
          {/* Navigation links */}
          <nav className="absolute top-6 left-1/2 transform -translate-x-1/2 hidden lg:flex items-center space-x-8">
            <a href="#features" className="text-transparent hover:text-gray-700 font-medium px-4 py-2 transition-colors">Features</a>
            <a href="#pricing" className="text-transparent hover:text-gray-700 font-medium px-4 py-2 transition-colors">Pricing</a>
            <a href="#about" className="text-transparent hover:text-gray-700 font-medium px-4 py-2 transition-colors">About</a>
          </nav>
          
          {/* Sign Up button area */}
          <div className="absolute right-6 lg:right-12 top-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-800 bg-white bg-opacity-80 px-3 py-1 rounded">Welcome, {user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-gray-800 bg-white bg-opacity-80 rounded hover:bg-opacity-100 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="bg-transparent border-2 border-transparent hover:bg-yellow-400 hover:bg-opacity-20 text-transparent px-6 py-3 rounded-lg font-semibold transition-all"
                style={{ width: '100px', height: '48px' }} // Match the button size in image
              >
                &nbsp;
              </button>
            )}
          </div>
        </div>

        {/* CTA Buttons Interactive Areas - Positioned over the image buttons */}
        <div className="absolute bottom-1/3 left-12 z-10">
          <div className="flex space-x-4">
            {/* Start Free button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (user) {
                  alert('Welcome to your dashboard!');
                } else {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }
              }}
              className="bg-transparent border-2 border-transparent hover:bg-blue-600 hover:bg-opacity-20 text-transparent px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              style={{ width: '160px', height: '60px' }} // Match button size in image
            >
              &nbsp;
            </motion.button>
            
            {/* Watch Demo button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert('Watch Demo functionality coming soon!')}
              className="bg-transparent border-2 border-transparent hover:bg-white hover:bg-opacity-20 text-transparent px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              style={{ width: '160px', height: '60px' }} // Match button size in image
            >
              &nbsp;
            </motion.button>
          </div>
        </div>

        {/* Mobile responsive overlay for small screens */}
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (user) {
                    alert('Welcome to your dashboard!');
                  } else {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
              >
                Start Free
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert('Watch Demo functionality coming soon!')}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
              >
                Watch Demo
              </motion.button>
              
              {!user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
                >
                  Sign Up
                </motion.button>
              )}
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
                
                <button
                  onClick={() => {
                    if (user) {
                      alert(`Upgrading to ${plan.name} plan...`);
                    } else {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }
                  }}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    key === 'pro'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {user ? 'Upgrade' : 'Get Started'}
                </button>
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
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (user) {
                alert('Welcome to your dashboard!');
              } else {
                setAuthMode('signup');
                setShowAuthModal(true);
              }
            }}
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
          >
            Get Started Free
          </motion.button>
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

      {/* Auth Modal */}
      {showAuthModal && <AuthModal />}
    </div>
  );
};

export default FileInASnapLanding;
