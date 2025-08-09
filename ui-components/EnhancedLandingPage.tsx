import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SmartUploadZone } from '../ui-components/SmartUploadZone';
import { MemoryTimeline } from '../ui-components/MemoryTimeline';
import { AdminDashboard } from '../ui-components/AdminDashboard';
import { PlanName, getPricingTier, getActivePricing } from '../pricingConfig';

// Helper Icons (keeping original designs)
const ModernLogo = (props) => (
    <svg {...props} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="url(#paint0_linear_101_2)"/>
        <path d="M9 10C9 9.44772 9.44772 9 10 9H15C15.5523 9 16 9.44772 16 10V15C16 15.5523 15.5523 16 15 16H10C9.44772 16 9 15.5523 9 15V10Z" fill="white" fillOpacity="0.8"/>
        <path d="M17 17C17 16.4477 17.4477 16 18 16H23C23.5523 16 24 16.4477 24 17V22C24 22.5523 23.5523 23 23 23H18C17.4477 23 17 22.5523 17 22V17Z" fill="white"/>
        <defs>
            <linearGradient id="paint0_linear_101_2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6"/>
                <stop offset="1" stopColor="#6366F1"/>
            </linearGradient>
        </defs>
    </svg>
);

const SparklesIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9zM22 12l-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9zM10 22l-1.9-5.8-5.8-1.9 5.8-1.9L10 3l1.9 5.8 5.8 1.9-5.8 1.9z"/>
    </svg>
);

const ShieldCheckIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const BrainIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
        <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
        <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
        <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
        <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
        <path d="M6 18a4 4 0 0 1-1.967-.516"/>
        <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
    </svg>
);

const ClockIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const UploadCloudIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m16 16-4-4-4 4" />
    </svg>
);

// Animated Section Component
const AnimatedSection = ({ children, delay = 0 }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
                hidden: { opacity: 0, y: 50 },
            }}
        >
            {children}
        </motion.div>
    );
};

// Enhanced UI Mockup Card with Plan Integration
const UIMockupCard = ({ selectedPlan = 'pro' }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [processingStage, setProcessingStage] = useState('');
    const planInfo = getPricingTier(selectedPlan);

    const simulateUpload = () => {
        setIsUploading(true);
        const stages = [
            'Uploading to cloud...',
            `Analyzing with ${planInfo.aiConfig.primaryModel}...`,
            'Extracting metadata...',
            'Generating smart tags...',
            'Creating memory timeline...',
            'Complete!'
        ];
        
        stages.forEach((stage, index) => {
            setTimeout(() => {
                setProcessingStage(stage);
                if (index === stages.length - 1) {
                    setTimeout(() => {
                        setIsUploading(false);
                        setProcessingStage('');
                    }, 1000);
                }
            }, index * 800);
        });
    };

    return (
        <motion.div 
            className="w-full max-w-sm rounded-2xl bg-white/80 backdrop-blur-md p-4 shadow-2xl border border-gray-200/50"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white"
                        onClick={simulateUpload}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2" />
                        ) : (
                            <UploadCloudIcon className="w-4 h-4 mr-2" />
                        )}
                        Upload
                    </Button>
                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                        {planInfo.name}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <BrainIcon className="w-5 h-5 text-blue-500" />
                    <Avatar className="w-7 h-7">
                        <AvatarImage src="https://i.pravatar.cc/32" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            {isUploading && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                        <span className="text-sm text-blue-700">{processingStage}</span>
                    </div>
                    <div className="mt-2 text-xs text-blue-600">
                        AI Model: {planInfo.aiConfig.primaryModel}
                    </div>
                </div>
            )}
            
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">AI Analysis Results</h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="relative rounded-lg overflow-hidden aspect-video">
                        <img src="https://placehold.co/300x200/f87171/ffffff?text=SUNSET" alt="Sunset collection" className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">28</div>
                        <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                            AI Tagged
                        </div>
                    </div>
                    <div className="relative rounded-lg overflow-hidden aspect-video">
                        <img src="https://placehold.co/300x200/60a5fa/ffffff?text=FAMILY" alt="Family photos" className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">18</div>
                        <div className="absolute top-1 left-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded">
                            Faces
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Smart Organization</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg overflow-hidden aspect-video">
                        <img src="https://placehold.co/300x200/34d399/ffffff?text=Travel" alt="Travel memories" className="w-full h-full object-cover" />
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {planInfo.aiConfig.primaryModel}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Plan Selector Component
const PlanSelector = ({ selectedPlan, onPlanChange }) => {
    const plans = getActivePricing();
    
    return (
        <div className="flex flex-wrap gap-2 justify-center mb-6">
            {plans.map(plan => (
                <button
                    key={plan.id}
                    onClick={() => onPlanChange(plan.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedPlan === plan.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                    {plan.name} - ${plan.pricePerMonth}/mo
                </button>
            ))}
        </div>
    );
};

// Enhanced Pricing Section
const PricingSection = () => {
    const plans = getActivePricing();
    
    return (
        <section className="w-full py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
            <div className="container px-4 md:px-6">
                <AnimatedSection>
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                        <div className="inline-block rounded-lg bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium">
                            AI-Powered Intelligence for Every Need
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your AI Model</h2>
                        <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                            From GROQ's lightning-fast processing to Claude's advanced reasoning, each plan includes cutting-edge AI models tailored to your needs.
                        </p>
                    </div>
                </AnimatedSection>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {plans.slice(0, 4).map((plan, index) => (
                        <AnimatedSection key={plan.id} delay={index * 0.1}>
                            <Card className={`h-full ${plan.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                                        {plan.popular && (
                                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-3xl font-bold text-blue-600">
                                        ${plan.pricePerMonth}
                                        <span className="text-lg text-gray-500 font-normal">/month</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{plan.tagline}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="text-sm font-medium text-gray-700 mb-1">AI Model</div>
                                        <div className="text-blue-600 font-semibold">
                                            {plan.aiConfig.primaryModel.replace('-', ' ').toUpperCase()}
                                        </div>
                                    </div>
                                    <ul className="space-y-2 mb-6">
                                        {plan.highlights.map((feature, i) => (
                                            <li key={i} className="flex items-center text-sm">
                                                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button className="w-full">
                                        {plan.ctaText}
                                    </Button>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Main Enhanced Landing Page Component
const EnhancedLandingPage = () => {
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [showDemo, setShowDemo] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
            {/* Header */}
            <header className="px-4 lg:px-6 h-16 flex items-center bg-white/80 backdrop-blur-sm fixed top-0 w-full z-50 border-b border-gray-200/80">
                <a href="#" className="flex items-center justify-center gap-2">
                    <ModernLogo />
                    <span className="font-bold text-xl text-gray-900">FileInASnap</span>
                </a>
                <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                    <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        AI Features
                    </a>
                    <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Plans & AI Models
                    </a>
                    <a href="#demo" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Live Demo
                    </a>
                    <Button variant="ghost">
                        Log In
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                        Start Free Trial
                    </Button>
                </nav>
            </header>

            <main className="flex-1">
                {/* Enhanced Hero Section */}
                <section className="relative w-full pt-32 pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
                     <div 
                        className="absolute inset-0 bg-cover bg-center opacity-20"
                        style={{backgroundImage: "url('/ChatGPT Image Jul 16, 2025, 03_47_10 PM.png')"}}
                     ></div>
                     <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/90 to-transparent"></div>

                    <div className="container px-4 md:px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div 
                                className="flex flex-col items-start text-left space-y-6"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <div className="inline-block rounded-lg bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium mb-4">
                                    AI-Powered • BMAD Architecture • 5 Specialized Agents
                                </div>
                                <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl text-gray-900">
                                    Organize your life's memories with <span className="text-blue-600">AI agents</span>
                                </h1>
                                <p className="max-w-xl text-lg text-gray-700">
                                    FileInASnap uses <strong className="text-gray-800">modular AI containers</strong> powered by GROQ, Gemini, GPT-4, and Claude to automatically organize, analyze, and create stories from your photos, videos, and documents.
                                </p>
                                
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
                                    <div className="text-sm font-medium text-gray-700 mb-2">AI Models by Plan:</div>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Standard:</span>
                                            <span className="font-medium text-blue-600">GROQ Llama3</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Pro:</span>
                                            <span className="font-medium text-purple-600">Gemini 1.5 Pro</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Veteran:</span>
                                            <span className="font-medium text-green-600">Claude 3 Sonnet</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Enterprise:</span>
                                            <span className="font-medium text-orange-600">Claude 3 Opus</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 shadow-lg">
                                        Try AI Demo
                                    </Button>
                                    <Button 
                                        size="lg" 
                                        variant="outline" 
                                        className="text-gray-800 border-gray-300 hover:bg-gray-100 text-lg px-8 py-6"
                                        onClick={() => setShowDemo(true)}
                                    >
                                        See Containers
                                    </Button>
                                </div>
                            </motion.div>
                            <div className="hidden lg:flex justify-center flex-col items-center">
                                <PlanSelector selectedPlan={selectedPlan} onPlanChange={setSelectedPlan} />
                                <UIMockupCard selectedPlan={selectedPlan} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Enhanced Features Section */}
                <section id="features" className="w-full py-20 md:py-32 bg-white">
                    <div className="container px-4 md:px-6">
                        <AnimatedSection>
                            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                                <div className="inline-block rounded-lg bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium">
                                    BMAD Container Architecture
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">5 Specialized AI Agent Containers</h2>
                                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                                   Each container is a specialized AI agent with distinct capabilities, plan-aware execution, and intelligent model selection based on your subscription tier.
                                </p>
                            </div>
                        </AnimatedSection>
                        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {/* File Intelligence Container */}
                            <AnimatedSection delay={0.1}>
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg h-full border border-blue-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-full bg-blue-500"><UploadCloudIcon className="h-6 w-6 text-white" /></div>
                                        <h3 className="text-xl font-bold">File Intelligence</h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">Smart file organization, renaming, and routing with plan-appropriate AI models from GROQ to Claude Opus.</p>
                                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded inline-block">
                                        Standard+ • All Plans
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Journaling Container */}
                            <AnimatedSection delay={0.2}>
                                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg h-full border border-purple-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-full bg-purple-500"><BrainIcon className="h-6 w-6 text-white" /></div>
                                        <h3 className="text-xl font-bold">Memory Journaling</h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">AI-powered journal analysis with emotion detection, todo extraction, and memory insights using Gemini and Claude.</p>
                                    <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded inline-block">
                                        Pro+ • Gemini Intelligence
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Relationship Container */}
                            <AnimatedSection delay={0.3}>
                                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg h-full border border-green-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-full bg-green-500"><svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg></div>
                                        <h3 className="text-xl font-bold">Relationship Mapping</h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">Advanced face recognition and social relationship analysis powered by Claude's sophisticated reasoning capabilities.</p>
                                    <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">
                                        Veteran+ • Claude Models
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Story Container */}
                            <AnimatedSection delay={0.4}>
                                <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg h-full border border-orange-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-full bg-orange-500"><svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>
                                        <h3 className="text-xl font-bold">AI Storytelling</h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">Generate compelling narratives from your memories using GPT-4 for content creators or Claude for advanced storytelling.</p>
                                    <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded inline-block">
                                        Creator/Veteran+ • Multi-Model
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Admin Supervisor */}
                            <AnimatedSection delay={0.5}>
                                <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg h-full border border-gray-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-full bg-gray-700"><ShieldCheckIcon className="h-6 w-6 text-white" /></div>
                                        <h3 className="text-xl font-bold">Admin Supervisor</h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">Enterprise-grade system monitoring, fallback handling, and audit controls powered by GPT-4o intelligence.</p>
                                    <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block">
                                        Enterprise • GPT-4o Admin
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* BMAD Architecture */}
                            <AnimatedSection delay={0.6}>
                                <div className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg h-full border border-yellow-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-full bg-yellow-500"><ClockIcon className="h-6 w-6 text-white" /></div>
                                        <h3 className="text-xl font-bold">BMAD Orchestration</h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">Build-Measure-Analyze-Deploy methodology coordinates all containers with intelligent routing and error recovery.</p>
                                    <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded inline-block">
                                        Core System • All Plans
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Live Demo Section */}
                {showDemo && (
                    <section id="demo" className="w-full py-20 md:py-32 bg-gray-50">
                        <div className="container px-4 md:px-6">
                            <AnimatedSection>
                                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Experience AI in Action</h2>
                                    <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                                        Try our AI-powered components with different subscription plans
                                    </p>
                                </div>
                            </AnimatedSection>
                            
                            <div className="space-y-16">
                                <SmartUploadZone 
                                    planName={selectedPlan}
                                    onUpload={async (file) => {
                                        console.log('Demo upload:', file.name);
                                    }}
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Pricing Section */}
                <div id="pricing">
                    <PricingSection />
                </div>

                {/* Testimonials Section */}
                <section className="w-full py-20 md:py-32 bg-gray-50 border-t border-gray-200">
                    <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                        <AnimatedSection>
                            <div className="space-y-3">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Loved by Developers & Families</h2>
                                <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl/relaxed">
                                    See why developers choose our BMAD architecture and families trust our AI agents.
                                </p>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection delay={0.2}>
                            <div className="mx-auto w-full max-w-2xl mt-8">
                                <Card className="bg-white p-8 rounded-xl shadow-lg">
                                    <CardContent className="flex flex-col items-center gap-4">
                                        <Avatar className="w-20 h-20 border-4 border-white -mt-16">
                                            <AvatarImage src="https://i.pravatar.cc/100?u=developer" alt="Alex Chen" />
                                            <AvatarFallback>AC</AvatarFallback>
                                        </Avatar>
                                        <blockquote className="text-xl text-gray-700">
                                            "The container architecture is brilliant. Each AI agent handles its specific task perfectly, and the plan-based model selection means I get exactly the intelligence level I pay for."
                                        </blockquote>
                                        <div className="font-semibold text-gray-900">Alex Chen</div>
                                        <div className="text-sm text-gray-500">Senior Developer & FileInASnap Veteran User</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200 bg-white">
                <p className="text-xs text-gray-500">&copy; 2025 FileInASnap Inc. All rights reserved. Powered by BMAD Architecture.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <a href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
                        API Documentation
                    </a>
                    <a href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
                        Container Guide
                    </a>
                    <a href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
                        Terms of Service
                    </a>
                    <a href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
                        Privacy
                    </a>
                </nav>
            </footer>
        </div>
    );
};

export default EnhancedLandingPage;