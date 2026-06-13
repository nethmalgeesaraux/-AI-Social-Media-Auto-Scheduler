"use client";

import { useState } from "react";
import { useMockData } from "@/hooks/use-mock-data";
import { 
  Compass, 
  Link2, 
  X,
  Lock,
  Plus,
  Video,
  MessageSquare,
  Hash,
  Camera,
  Briefcase,
  Users,
  Music,
  MessageCircle
} from "lucide-react";

// Platform styling mapper
const platformConfig: Record<string, {
  color: string;
  bgColor: string;
  icon: any;
  displayName: string;
}> = {
  instagram: { displayName: "Instagram", color: "#E1306C", bgColor: "bg-pink-600/10 border-pink-500/20", icon: Camera },
  youtube: { displayName: "YouTube", color: "#FF0000", bgColor: "bg-red-600/10 border-red-500/20", icon: Video },
  tiktok: { displayName: "TikTok", color: "#00F2FE", bgColor: "bg-cyan-600/10 border-cyan-500/20", icon: Music },
  facebook: { displayName: "Facebook", color: "#1877F2", bgColor: "bg-blue-600/10 border-blue-500/20", icon: Users },
  linkedin: { displayName: "LinkedIn", color: "#0A66C2", bgColor: "bg-blue-700/10 border-blue-600/20", icon: Briefcase },
  pinterest: { displayName: "Pinterest", color: "#E60023", bgColor: "bg-red-700/10 border-red-600/20", icon: Compass },
  discord: { displayName: "Discord", color: "#5865F2", bgColor: "bg-indigo-600/10 border-indigo-500/20", icon: Link2 },
  twitter: { displayName: "Twitter / X", color: "#000000", bgColor: "bg-slate-800/20 border-slate-700/30", icon: MessageCircle },
  slack: { displayName: "Slack", color: "#4A154B", bgColor: "bg-purple-600/10 border-purple-500/20", icon: Hash },
};

export default function DashboardAccounts() {
  const { connectedAccounts, connectAccount, disconnectAccount, currentPlan } = useMockData();
  
  // OAuth Popup State
  const [oauthPlatform, setOauthPlatform] = useState<string | null>(null);
  const [handleInput, setHandleInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenOAuth = (platform: string) => {
    // Free plan check: max 2 accounts
    const activeCount = connectedAccounts.filter(a => a.connected).length;
    if (currentPlan === "free" && activeCount >= 2) {
      alert("Free plan is limited to 2 connected accounts. Upgrade to Pro in the Billing section to link all 9 platforms!");
      return;
    }
    
    setOauthPlatform(platform);
    setHandleInput(platform === "linkedin" || platform === "slack" || platform === "discord" ? "Your Brand Page" : "@yourbrand");
  };

  const handleAuthorize = () => {
    if (!oauthPlatform || !handleInput.trim()) return;
    setIsSubmitting(true);
    
    // Simulate API Roundtrip delay
    setTimeout(() => {
      connectAccount(oauthPlatform, handleInput.trim());
      setIsSubmitting(false);
      setOauthPlatform(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Connected Accounts</h2>
        <p className="text-sm text-slate-400">Link your channels to post content, trigger AI replies, and aggregate analytics.</p>
      </div>

      {/* Grid of channels */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {connectedAccounts.map((account) => {
          const config = platformConfig[account.platform] || {
            displayName: account.platform,
            color: "#64748B",
            bgColor: "bg-slate-600/10 border-slate-500/20",
            icon: Link2
          };
          
          const Icon = config.icon;
          
          return (
            <div 
              key={account.id}
              className={`p-5 rounded-xl border bg-[#0E1424] flex flex-col justify-between h-44 transition-all duration-300 ${account.connected ? "border-slate-800/80" : "border-slate-800/30 opacity-75 hover:opacity-100"}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${config.bgColor} border flex items-center justify-center`} style={{ color: config.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {account.connected ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Connected
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                      Offline
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-sm leading-tight">{config.displayName}</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {account.connected ? account.handle : "No account connected"}
                </p>
              </div>

              <div className="mt-4">
                {account.connected ? (
                  <button
                    onClick={() => disconnectAccount(account.platform)}
                    className="w-full py-1.5 text-xs font-semibold border border-rose-500/20 text-rose-400 hover:bg-rose-950/20 rounded-lg transition-all"
                  >
                    Disconnect Channel
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenOAuth(account.platform)}
                    className="w-full py-1.5 text-xs font-bold bg-violet-600/10 text-violet-400 hover:bg-violet-600 hover:text-white border border-violet-500/20 rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Connect Account
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated OAuth popup modal */}
      {oauthPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isSubmitting && setOauthPlatform(null)} />
          
          {/* Modal content */}
          <div className="bg-[#0E1424] border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl animate-scale-up">
            <button 
              onClick={() => setOauthPlatform(null)} 
              disabled={isSubmitting}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">OAuth Authorization</h3>
              <p className="text-xs text-slate-400 mt-1">
                QueueBot wants to connect with your <span className="text-violet-400 font-bold capitalize">{oauthPlatform}</span> profile.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Required Permissions:</div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-center gap-1.5">✓ View account details & followers</li>
                  <li className="flex items-center gap-1.5">✓ Post media, captions, and updates</li>
                  <li className="flex items-center gap-1.5">✓ Read and reply to user comments</li>
                </ul>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Account Username/Handle</label>
                <input 
                  type="text"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-200 border border-slate-800 rounded-lg text-sm focus:border-violet-500 outline-none"
                  placeholder="@yourbrand"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOauthPlatform(null)}
                disabled={isSubmitting}
                className="flex-1 py-2 text-sm font-semibold border border-slate-850 hover:bg-slate-900 text-slate-400 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAuthorize}
                disabled={isSubmitting || !handleInput.trim()}
                className="flex-1 py-2 text-sm font-bold bg-violet-600 text-white rounded-lg hover:bg-violet-500 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Authorize"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
