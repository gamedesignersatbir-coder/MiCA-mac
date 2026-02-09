import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Rocket, Mail, MessageCircle, Instagram, Phone, Video, BarChart2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
import { LANDING_VIDEOS } from '../config/landingVideos';

export const LandingPage: React.FC = () => {
    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {LANDING_VIDEOS.HERO_BACKGROUND && !LANDING_VIDEOS.HERO_BACKGROUND.includes('YOUR_') ? (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster={LANDING_VIDEOS.HERO_POSTER}
                            className="w-full h-full object-cover"
                        >
                            <source src={LANDING_VIDEOS.HERO_BACKGROUND} type="video/mp4" />
                        </video>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-[#1E3A5F] to-[#0F172A]"></div>
                    )}
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
                        AI-Powered Marketing Campaigns <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">in Minutes</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Give us your product details. Get a complete 4-week marketing campaign — emails, WhatsApp, social media, voice agents, and video ads — generated and executed automatically.
                    </p>
                    <div className="flex flex-col items-center gap-12">
                        <Link to="/create-campaign">
                            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-lg rounded-full shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105">
                                Create Your Campaign →
                            </Button>
                        </Link>

                        {/* Demo Video - Moved to Hero */}
                        <div className="mx-auto max-w-[280px] aspect-[9/16] bg-gray-800 rounded-2xl overflow-hidden border-4 border-gray-700/50 shadow-2xl relative group animate-in slide-in-from-bottom-5 duration-1000">
                            {LANDING_VIDEOS.DEMO_PORTRAIT && !LANDING_VIDEOS.DEMO_PORTRAIT.includes('YOUR_') ? (
                                <video
                                    controls
                                    playsInline
                                    poster={LANDING_VIDEOS.DEMO_POSTER}
                                    className="w-full h-full object-cover"
                                >
                                    <source src={LANDING_VIDEOS.DEMO_PORTRAIT} type="video/mp4" />
                                </video>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                    <div className="text-center p-6">
                                        <Video size={36} className="mx-auto text-gray-600 mb-4" />
                                        <p className="text-gray-500 text-xs">Demo Video</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How MiCA Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-indigo-500 transition-colors">
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-400">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">1. Tell Us About Your Product</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Fill a simple form with your product details, upload documents, and set your launch date. Takes 2 minutes.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition-colors overflow-hidden group">
                            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                {LANDING_VIDEOS.CARD_BACKGROUND && !LANDING_VIDEOS.CARD_BACKGROUND.includes('YOUR_') ? (
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    >
                                        <source src={LANDING_VIDEOS.CARD_BACKGROUND} type="video/mp4" />
                                    </video>
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-transparent"></div>
                                )}
                                <div className="absolute inset-0 bg-black/70"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-4">2. AI Creates Your Campaign</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Our AI builds a complete 4-week marketing strategy with emails, messages, social posts, branded images, and video ads.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-emerald-500 transition-colors">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 text-emerald-400">
                                <Rocket size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">3. Execute & Track Results</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Launch your campaign across email, WhatsApp, Instagram, and phone — all automated. Track everything in your live dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Everything You Need</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <FeatureCard icon={<Mail />} title="Email Campaigns" />
                        <FeatureCard icon={<MessageCircle />} title="WhatsApp Messages" />
                        <FeatureCard icon={<Instagram />} title="Social Media Posts" />
                        <FeatureCard icon={<Phone />} title="Voice Agents" />
                        <FeatureCard icon={<Video />} title="HeyGen Video Ads" />
                        <FeatureCard icon={<BarChart2 />} title="Live Dashboard" />
                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-gray-400 text-sm">Watch MiCA create a campaign in real-time</p>
                    </div>
                </div>
            </section>

            {/* Pricing Teaser */}
            <section className="py-24 bg-[#0F172A] text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Growth Journey</h2>
                    <p className="text-xl text-gray-300 mb-8">Plans starting at <span className="font-semibold text-white">₹999/month</span></p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/create-campaign">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-full w-full sm:w-auto">
                                Get Started Free
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="px-8 rounded-full w-full sm:w-auto">
                            View Pricing
                        </Button>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

const FeatureCard = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-800 flex flex-col items-center text-center hover:bg-gray-800 transition-colors">
        <div className="text-indigo-400 mb-3">{icon}</div>
        <h4 className="font-semibold text-gray-200">{title}</h4>
    </div>
);
