"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  ChevronDown,
  Volume2
} from "lucide-react";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Which social media platforms does QueueBot support?",
      a: "We support Instagram, YouTube, TikTok, Facebook, LinkedIn, Pinterest, Discord, Twitter/X, and Slack. All platforms support scheduling and cross-posting, and most support automated AI replies."
    },
    {
      q: "How does the AI Caption writer work?",
      a: "QueueBot leverages Google's Gemini AI. You simply enter a topic or prompt, select your target platform, and the AI analyzes optimal post structures to generate 3 high-engaging copy options and trending hashtags in seconds."
    },
    {
      q: "Is there a setup process for Clerk billing?",
      a: "No! All subscription flows are fully handled by Clerk's secure billing widget. Upgrade or downgrade instantly with absolute safety."
    },
    {
      q: "Can I manage multiple accounts for the same platform?",
      a: "Yes! Depending on your plan (Pro allows up to 20, Agency allows unlimited), you can connect multiple profiles per platform (e.g. multiple Instagram handles) and coordinate them on the same calendar."
    }
  ];

  return (
    <div className="min-h-screen bg-[#090D1A] text-slate-100 overflow-x-hidden selection:bg-violet-600/40">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#090D1A]/80 border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-1.5">
              ⚡ QueueBot
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
            <a href="#features" className="hover:text-violet-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-violet-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-violet-400 transition-colors">FAQ</a>
            <a href="https://nextjs.org" target="_blank" className="hover:text-violet-400 transition-colors">Docs</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 transition-all duration-200"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/20 text-xs font-semibold text-violet-300 mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" /> AI-Powered Social Media Management
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
          Schedule. Automate.<br />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Grow Everywhere.
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect all your brand accounts and publish to Instagram, YouTube, TikTok, LinkedIn & more — all from one beautiful, centralized copilot dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto px-8 py-3.5 font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-500 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 flex items-center justify-center gap-2 transition-all duration-200"
          >
            Start for Free <ArrowRight className="w-4 h-4" />
          </Link>
          <a 
            href="#features" 
            className="w-full sm:w-auto px-8 py-3.5 font-semibold text-slate-300 border border-slate-800 rounded-xl hover:bg-slate-900/60 hover:text-white transition-all duration-200"
          >
            Watch Demo
          </a>
        </div>
      </section>

      {/* Social Platform strip */}
      <div className="py-6 border-y border-slate-800/80 bg-slate-950/20 relative overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-medium text-slate-400">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0F172A] border border-slate-800 rounded-full hover:border-slate-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#E1306C]" /> Instagram
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0F172A] border border-slate-800 rounded-full hover:border-slate-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#FF0000]" /> YouTube
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0F172A] border border-slate-800 rounded-full hover:border-slate-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#00F2FE]" /> TikTok
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0F172A] border border-slate-800 rounded-full hover:border-slate-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#1877F2]" /> Facebook
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0F172A] border border-slate-800 rounded-full hover:border-slate-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#0A66C2]" /> LinkedIn
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0F172A] border border-slate-800 rounded-full hover:border-slate-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#E60023]" /> Pinterest
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0F172A] border border-slate-800 rounded-full hover:border-slate-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#5865F2]" /> Discord
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0F172A] border border-slate-800 rounded-full hover:border-slate-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#1DA1F2]" /> Twitter/X
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0F172A] border border-slate-800 rounded-full hover:border-slate-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#4A154B]" /> Slack
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-16">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-3">EVERYTHING YOU NEED</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">One Platform, All Channels</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Stop switching tabs and copying captions. Coordinate your whole social presence from a single dashboard.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-[#0E1528] border border-slate-800/80 rounded-2xl hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-10 h-10 bg-violet-600/10 rounded-xl flex items-center justify-center text-violet-400 mb-5 border border-violet-500/20 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Scheduling</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Schedule content at optimal moments across all channels with integrated date, time, and timezone selectors.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-[#0E1528] border border-slate-800/80 rounded-2xl hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-10 h-10 bg-violet-600/10 rounded-xl flex items-center justify-center text-violet-400 mb-5 border border-violet-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Caption Assistant</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate platform-optimized captions, tags, and formatting hooks in seconds powered by Google Gemini AI.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-[#0E1528] border border-slate-800/80 rounded-2xl hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-10 h-10 bg-violet-600/10 rounded-xl flex items-center justify-center text-violet-400 mb-5 border border-violet-500/20 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Auto-Replies</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automatically respond to post comments with instant template answers or Gemini context replies based on keywords.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-[#0E1528] border border-slate-800/80 rounded-2xl hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-10 h-10 bg-violet-600/10 rounded-xl flex items-center justify-center text-violet-400 mb-5 border border-violet-500/20 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Content Calendar</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Visualize your pipeline with a color-coded daily, weekly, or monthly calendar, supporting click-to-preview details.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 bg-[#0E1528] border border-slate-800/80 rounded-2xl hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-10 h-10 bg-violet-600/10 rounded-xl flex items-center justify-center text-violet-400 mb-5 border border-violet-500/20 group-hover:scale-110 transition-transform">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Media Upload & Filters</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Optimize post aesthetics with our drag & drop uploader utilizing ImageKit's dynamic image filters and crop metrics.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 bg-[#0E1528] border border-slate-800/80 rounded-2xl hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-10 h-10 bg-violet-600/10 rounded-xl flex items-center justify-center text-violet-400 mb-5 border border-violet-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Performance Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Monitor impressions, audience reach ratios, engagement spikes, and top performing posts through detailed charts.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-slate-950/40 py-24 scroll-mt-16 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-3">SIMPLE PLANS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Pricing that Fits Your Scale</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Start with the Free plan and upgrade seamlessly as your community footprint grows.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 bg-[#0E1528]/80 border border-slate-850 rounded-2xl relative flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wide">FREE</span>
                <div className="text-4xl font-extrabold text-white mb-2">$0</div>
                <p className="text-slate-400 text-xs mb-6">Perfect for getting started</p>
                
                <hr className="border-slate-850 mb-6" />

                <ul className="space-y-4 mb-8 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>2 connected social accounts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>10 scheduled posts / month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>2 auto-reply triggers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>5 AI assists / month</span>
                  </li>
                </ul>
              </div>

              <Link 
                href="/dashboard"
                className="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 text-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-800 text-center transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-8 bg-[#111A36] border-2 border-violet-500 rounded-2xl relative flex flex-col justify-between shadow-2xl shadow-violet-500/5">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full border border-violet-400/30">
                RECOMMENDED
              </div>
              
              <div>
                <span className="text-xs font-bold text-violet-400 block mb-2 uppercase tracking-wide">PRO</span>
                <div className="text-4xl font-extrabold text-white mb-2">$19<span className="text-sm font-normal text-slate-400">/mo</span></div>
                <p className="text-slate-300 text-xs mb-6">For content creators & scaling marketers</p>
                
                <hr className="border-slate-800 mb-6" />

                <ul className="space-y-4 mb-8 text-sm text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span className="font-semibold text-white">All 9 social platforms</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>Unlimited scheduled posts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>20 auto-reply rules</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>Unlimited AI Assists</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>Advanced recharts analytics</span>
                  </li>
                </ul>
              </div>

              <Link 
                href="/dashboard"
                className="w-full py-2.5 px-4 bg-violet-600 text-white text-sm font-bold rounded-lg hover:bg-violet-500 text-center shadow-lg shadow-violet-500/20 transition-all"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Agency Tier */}
            <div className="p-8 bg-[#0E1528]/80 border border-slate-850 rounded-2xl relative flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wide">AGENCY</span>
                <div className="text-4xl font-extrabold text-white mb-2">$49<span className="text-sm font-normal text-slate-400">/mo</span></div>
                <p className="text-slate-400 text-xs mb-6">For brands, managers & teams</p>
                
                <hr className="border-slate-850 mb-6" />

                <ul className="space-y-4 mb-8 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>Everything in Pro tier</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>Unlimited auto-reply rules</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>Team workspace collaboration</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>White-label metrics reports</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>Priority dedicated support</span>
                  </li>
                </ul>
              </div>

              <Link 
                href="/dashboard"
                className="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 text-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-800 text-center transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-3">COMMUNITY LOVE</span>
        <h2 className="text-3xl font-extrabold text-white mb-12">Loved by Digital Strategists</h2>
        
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div className="p-6 bg-[#0E1528] border border-slate-800 rounded-xl relative">
            <p className="text-slate-300 text-sm italic mb-6">
              \"QueueBot is an absolute game-changer. Scheduling threads across LinkedIn and Twitter has never been cleaner, and the Gemini AI captions are surprisingly context-aware compared to typical generators!\"
            </p>
            <div>
              <h4 className="font-bold text-white text-sm">Sarah Jenkins</h4>
              <span className="text-slate-500 text-xs">SaaS Growth lead at AppFlow</span>
            </div>
          </div>
          
          <div className="p-6 bg-[#0E1528] border border-slate-800 rounded-xl relative">
            <p className="text-slate-300 text-sm italic mb-6">
              \"The automated AI comment responder saves me hours of manual community monitoring. It recognizes customer questions and immediately provides standard answers using rules we set up.\"
            </p>
            <div>
              <h4 className="font-bold text-white text-sm">Marcus Vance</h4>
              <span className="text-slate-500 text-xs">Head of Social Media at WebFlow Agency</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="max-w-3xl mx-auto px-6 pb-24 scroll-mt-16">
        <h2 className="text-3xl font-extrabold text-white text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-slate-800/80 bg-[#0E1528] rounded-xl overflow-hidden cursor-pointer transition-colors hover:border-slate-700"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="p-5 flex items-center justify-between font-semibold text-white">
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${activeFaq === idx ? "rotate-180" : ""}`} />
              </div>
              
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-900 pt-3 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-1.5 font-bold text-slate-400">
            ⚡ QueueBot
          </div>
          <div className="flex gap-8">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Support</span>
          </div>
          <div>© 2025 QueueBot Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
