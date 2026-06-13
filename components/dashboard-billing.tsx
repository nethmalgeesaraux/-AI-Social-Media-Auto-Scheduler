"use client";

import { useMockData } from "@/hooks/use-mock-data";
import { 
  Check, 
  CreditCard, 
  Sparkles, 
  AlertTriangle,
  Zap
} from "lucide-react";

export default function DashboardBilling() {
  const { currentPlan, usageLimits, upgradePlan } = useMockData();

  // Limit Percentage Helper
  const getPercent = (used: number, max: number) => {
    if (max === 99999) return 5; // unlimited show low percent
    return Math.min(100, Math.round((used / max) * 100));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Billing & Subscriptions</h2>
        <p className="text-sm text-slate-400">Upgrade your plan to unlock unlimited platforms, additional rules, and unlimited AI assists.</p>
      </div>

      {/* Usage Progress Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Posts limit */}
        <div className="p-5 bg-[#0E1424] border border-slate-800 rounded-2xl space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider">Posts Limit</span>
            <span className="font-mono text-white">
              {usageLimits.postsUsed} / {usageLimits.postsMax === 99999 ? "Unlimited" : usageLimits.postsMax}
            </span>
          </div>
          
          <div className="w-full bg-slate-950 rounded-full h-2">
            <div 
              className="bg-violet-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${getPercent(usageLimits.postsUsed, usageLimits.postsMax)}%` }}
            />
          </div>
          
          <p className="text-[10px] text-slate-450 leading-tight">
            Includes both published and scheduled posts for the current monthly cycle.
          </p>
        </div>

        {/* Auto-Replies limit */}
        <div className="p-5 bg-[#0E1424] border border-slate-800 rounded-2xl space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider">Auto-Reply Rules</span>
            <span className="font-mono text-white">
              {usageLimits.rulesUsed} / {usageLimits.rulesMax === 99999 ? "Unlimited" : usageLimits.rulesMax}
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2">
            <div 
              className="bg-cyan-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${getPercent(usageLimits.rulesUsed, usageLimits.rulesMax)}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-450 leading-tight">
            Defines the maximum rules active in your comment listeners globally.
          </p>
        </div>

        {/* AI Assist limit */}
        <div className="p-5 bg-[#0E1424] border border-slate-800 rounded-2xl space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider">Gemini AI Assists</span>
            <span className="font-mono text-white">
              {usageLimits.aiAssistsUsed} / {usageLimits.aiAssistsMax === 99999 ? "Unlimited" : usageLimits.aiAssistsMax}
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${getPercent(usageLimits.aiAssistsUsed, usageLimits.aiAssistsMax)}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-450 leading-tight">
            Applies to AI caption suggestions and simulator test events.
          </p>
        </div>
      </div>

      {currentPlan === "free" && (
        <div className="p-4 bg-violet-600/10 border border-violet-500/20 text-violet-300 rounded-xl text-xs flex items-center gap-3">
          <Zap className="w-4 h-4 text-violet-400 flex-shrink-0 animate-bounce" />
          <div>
            <span className="font-bold text-white">Free account status:</span> You are currently running on the restricted Free tier. Upgrade to <span className="font-bold text-violet-400">Pro</span> to link all 9 social channels and enjoy unlimited post capabilities!
          </div>
        </div>
      )}

      {/* Pricing Tables inside Dashboard */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
        
        {/* Free Plan */}
        <div className={`p-6 bg-[#0E1424] border rounded-2xl flex flex-col justify-between h-[380px] ${
          currentPlan === "free" ? "border-violet-500 ring-1 ring-violet-500" : "border-slate-850"
        }`}>
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">FREE</span>
              {currentPlan === "free" && <span className="text-[10px] font-bold text-violet-400 bg-violet-950/40 border border-violet-500/20 px-2 py-0.5 rounded-full">Active</span>}
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">$0</div>
            
            <ul className="space-y-3.5 mt-6 text-[11px] text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> 2 connected accounts</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> 10 posts / month</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> 2 auto-reply rules</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> 5 AI assists</li>
            </ul>
          </div>

          <button
            onClick={() => upgradePlan("free")}
            disabled={currentPlan === "free"}
            className="w-full py-2 bg-slate-900 border border-slate-800 disabled:border-transparent text-slate-350 disabled:text-slate-500 text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            {currentPlan === "free" ? "Current Tier" : "Downgrade"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className={`p-6 bg-[#111A36] border rounded-2xl flex flex-col justify-between h-[380px] relative shadow-xl shadow-violet-500/5 ${
          currentPlan === "pro" ? "border-violet-500 ring-2 ring-violet-500/80" : "border-slate-800/80"
        }`}>
          <div className="absolute -top-3 right-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-violet-400/30">
            RECOMMENDED
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-violet-400">PRO</span>
              {currentPlan === "pro" && <span className="text-[10px] font-bold text-violet-400 bg-violet-950/40 border border-violet-500/20 px-2 py-0.5 rounded-full">Active</span>}
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">$19<span className="text-xs font-normal text-slate-400">/mo</span></div>
            
            <ul className="space-y-3.5 mt-6 text-[11px] text-slate-200">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> <span className="font-semibold text-white">All 9 social platforms</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Unlimited scheduled posts</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> 20 auto-reply rules</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Unlimited AI assists</li>
            </ul>
          </div>

          <button
            onClick={() => upgradePlan("pro")}
            className={`w-full py-2 text-xs font-bold rounded-lg transition-all ${
              currentPlan === "pro" 
                ? "bg-slate-900 border border-transparent text-slate-500 cursor-default" 
                : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/15"
            }`}
          >
            {currentPlan === "pro" ? "Current Tier" : "Select Pro Plan"}
          </button>
        </div>

        {/* Agency Plan */}
        <div className={`p-6 bg-[#0E1424] border rounded-2xl flex flex-col justify-between h-[380px] ${
          currentPlan === "agency" ? "border-violet-500 ring-1 ring-violet-500" : "border-slate-850"
        }`}>
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">AGENCY</span>
              {currentPlan === "agency" && <span className="text-[10px] font-bold text-violet-400 bg-violet-950/40 border border-violet-500/20 px-2 py-0.5 rounded-full">Active</span>}
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">$49<span className="text-xs font-normal text-slate-400">/mo</span></div>
            
            <ul className="space-y-3.5 mt-6 text-[11px] text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Everything in Pro tier</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Unlimited auto-reply rules</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> Team workspace members</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-400" /> White-label reporting</li>
            </ul>
          </div>

          <button
            onClick={() => upgradePlan("agency")}
            className={`w-full py-2 text-xs font-bold rounded-lg transition-all ${
              currentPlan === "agency" 
                ? "bg-slate-900 border border-transparent text-slate-500 cursor-default" 
                : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/15"
            }`}
          >
            {currentPlan === "agency" ? "Current Tier" : "Upgrade to Agency"}
          </button>
        </div>

      </div>
    </div>
  );
}
