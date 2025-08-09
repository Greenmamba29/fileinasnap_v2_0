import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroTextCarousel from './HeroTextCarousel';
const LandingPage = () => {
  return <div className="min-h-screen">
      {/* Hero Section with Rotating Text Carousel */}
      <HeroTextCarousel />
      
      {/* Fixed Header positioned above the hero */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 md:px-12 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-space font-bold text-gray-900">FileInASnap</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm">Features</a>
          <a href="#pricing" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm">Pricing</a>
          <a href="#blog" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm">Blog</a>
          <Link to="/dashboard">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-4 py-2 rounded-full text-sm">
              Sign Up
            </Button>
          </Link>
        </nav>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-space font-bold mb-6 text-gray-900">
            AI-First File Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Modular agent containers powered by advanced LLMs automatically organize, tag, and help you rediscover your content.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-space font-bold mb-4 text-gray-900">Smart Upload & Organization</h3>
            <p className="text-gray-600 leading-relaxed">
              Drag, drop, and watch AI agents automatically rename, tag, and organize your files with intelligent folder suggestions.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <h3 className="text-2xl font-space font-bold mb-4 text-gray-900">Memory Timeline & Journaling</h3>
            <p className="text-gray-600 leading-relaxed">
              Transform your files into rich memory timelines with AI-generated insights, emotional tagging, and voice entries.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <h3 className="text-2xl font-space font-bold mb-4 text-gray-900">SnapBot AI Assistant</h3>
            <p className="text-gray-600 leading-relaxed">
              Ask "What are you trying to remember?" and let SnapBot search through your files and journals with natural language.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-space font-bold mb-6 text-gray-900">
              Choose Your Intelligence Level
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic organization to advanced AI storytelling - find the perfect plan for your memory management needs.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-space font-bold mb-2">Standard</h3>
              <p className="text-gray-600 mb-4">Groq LLM</p>
              <div className="text-3xl font-bold mb-6">$9<span className="text-lg text-gray-600">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> FileOrganizer Agent</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Basic File Tagging</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 10GB Storage</li>
              </ul>
              <Button className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300">Get Started</Button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-yellow-400">
              <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">Most Popular</div>
              <h3 className="text-2xl font-space font-bold mb-2">Pro</h3>
              <p className="text-gray-600 mb-4">Gemini LLM</p>
              <div className="text-3xl font-bold mb-6">$29<span className="text-lg text-gray-600">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> JournalAgent + FileOrganizer</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> SnapBot AI Assistant</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 100GB Storage</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Memory Timeline</li>
              </ul>
              <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">Start Free Trial</Button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-space font-bold mb-2">Veteran</h3>
              <p className="text-gray-600 mb-4">Claude 3 Opus</p>
              <div className="text-3xl font-bold mb-6">$99<span className="text-lg text-gray-600">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> All Pro Features</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> StoryAgent + RelationshipAgent</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 1TB Storage</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Voice Search</li>
              </ul>
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Upgrade Now</Button>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-space font-bold mb-2">Creator</h3>
              <p className="text-purple-200 mb-4">Pro/Veteran + Creator Tools</p>
              <div className="text-3xl font-bold mb-6">+$20<span className="text-lg text-purple-200">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-yellow-400 mr-2">✓</span> Auto-Storybuilder</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">✓</span> Visual Batch Tagger</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">✓</span> Clip Finder</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">✓</span> Content Vault</li>
              </ul>
              <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">Join Creators</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-space font-bold mb-6">
            Ready to Transform Your Digital Life?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who've already organized their memories with AI. Start your free trial today.
          </p>
          <Link to="/dashboard">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-8 py-4 text-lg rounded-full transition-all hover:scale-105">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-sm"></div>
                </div>
                <span className="text-xl font-space font-bold">FileInASnap</span>
              </div>
              <p className="text-gray-400">AI-powered file orchestration platform for organizing life's memories.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 GrahmOS Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default LandingPage;