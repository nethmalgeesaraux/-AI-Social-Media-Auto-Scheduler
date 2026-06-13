"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useMockData } from "@/hooks/use-mock-data";

// Subcomponents
import DashboardAccounts from "@/components/dashboard-accounts";
import DashboardCompose from "@/components/dashboard-compose";
import DashboardCalendar from "@/components/dashboard-calendar";
import DashboardAutoReply from "@/components/dashboard-autoreply";
import DashboardAnalytics from "@/components/dashboard-analytics";
import DashboardBilling from "@/components/dashboard-billing";

// Icons
import { 
  Home, 
  Edit, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  MessageSquare, 
  Link2, 
  CreditCard, 
  Settings as SettingsIcon,
  Bell, 
  Search, 
  Sun, 
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Play,
  Trash2,
  Zap,
  Globe
} from "lucide-react";

// Platform styling mapper
const platformIcons: Record<string, string> = {
  instagram: "📸",
  twitter: "🐦",
  linkedin: "💼",
  facebook: "👥",
  tiktok: "🎵",
  youtube: "🎥",
  pinterest: "📌",
  discord: "💬",
  slack: "💬",
};

export default function DashboardHub() {
  const { theme, setTheme } = useTheme();
  const { posts, connectedAccounts, currentPlan, analyticsOverview, publishPostImmediately, deletePost } = useMockData();

  // Dashboard layout states
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeAccounts = connectedAccounts.filter(a => a.connected);
  const scheduledPosts = posts.filter(p => p.status === "scheduled");

  // Sidebar navigation sections
  const navItems = [
    { id: "dashboard", label: "Dashboard", section: "Main", icon: Home },
    { id: "compose", label: "Compose", section: "Main", icon: Edit },
    { id: "calendar", label: "Calendar", section: "Main", icon: CalendarIcon },
    { id: "analytics", label: "Analytics", section: "Main", icon: TrendingUp },
    
    { id: "autoreply", label: "Auto-Reply", section: "Automation", icon: MessageSquare },
    { id: "accounts", label: "Accounts", section: "Automation", icon: Link2 },
    
    { id: "billing", label: "Billing", section: "Settings", icon: CreditCard },
    { id: "settings", label: "Settings", section: "Settings", icon: SettingsIcon },
  ];

  // Search filter for posts
  const filteredScheduledPosts = scheduledPosts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#070B16]">
      {/* 1. SIDEBAR (Desktop) */}
      <aside className={`hidden md:flex flex-col bg-[#0A0F1D] border-r border-slate-900 transition-all duration-300 ${
        sidebarCollapsed ? "w-16" : "w-60"
      }`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-900">
          {!sidebarCollapsed && (
            <span className="font-bold text-base bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-1.5">
              ⚡ QueueBot
            </span>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 text-slate-500 hover:text-white rounded hover:bg-slate-950 transition-colors mx-auto"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 py-4 overflow-y-auto px-2.5 space-y-6">
          {["Main", "Automation", "Settings"].map((section) => {
            const items = navItems.filter(item => item.section === section);
            return (
              <div key={section} className="space-y-1.5">
                {!sidebarCollapsed && (
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5">
                    {section}
                  </span>
                )}
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive 
                          ? "bg-violet-600/10 text-violet-300 border-l-2 border-violet-500" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40"
                      }`}
                      title={sidebarCollapsed ? item.label : ""}
                    >
                      <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer User Details */}
        <div className="p-3 border-t border-slate-900 bg-slate-950/20">
          <div className="flex items-center gap-3 p-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              JD
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-200 truncate">John Doe</p>
                <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-current" /> {currentPlan} Plan
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          
          {/* Menu Panel */}
          <div className="relative flex flex-col w-64 bg-[#0A0F1D] border-r border-slate-900 h-full p-4 space-y-6 animate-slide-in">
            <div className="flex justify-between items-center pb-4 border-b border-slate-900">
              <span className="font-bold text-base bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-1.5">
                ⚡ QueueBot
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {["Main", "Automation", "Settings"].map((section) => {
                const items = navItems.filter(item => item.section === section);
                return (
                  <div key={section} className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5">
                      {section}
                    </span>
                    {items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            isActive 
                              ? "bg-violet-600/10 text-violet-300 border-l-2 border-violet-500" 
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40"
                          }`}
                        >
                          <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-900">
              <div className="flex items-center gap-3 p-1.5">
                <div className="w-8 h-8 bg-violet-600 text-white font-bold text-xs rounded-full flex items-center justify-center">
                  JD
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">John Doe</p>
                  <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wider font-mono">
                    {currentPlan} Plan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-900 bg-[#0A0F1D]/60 backdrop-blur-xs flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-1 md:hidden text-slate-400 hover:text-white rounded"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <h1 className="text-base font-bold text-white capitalize leading-none">
              {activeTab === "autoreply" ? "Auto-Reply Rules" : activeTab}
            </h1>
          </div>

          {/* Search box (only shows on dashboard) */}
          {activeTab === "dashboard" && (
            <div className="hidden sm:flex items-center gap-2 bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 w-60">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="bg-transparent text-xs text-slate-200 outline-none w-full"
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            {/* Dark Mode Switcher */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <div className="relative cursor-pointer p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
            </div>

            {/* New Post Button Shortcut */}
            {activeTab !== "compose" && (
              <button
                onClick={() => setActiveTab("compose")}
                className="px-3.5 py-1.5 text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white rounded-lg flex items-center gap-1.5 shadow-lg shadow-violet-500/10 transition-all"
              >
                ✏️ New Post
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* Dashboard Tab view */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Overview Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsOverview.map((card, idx) => (
                  <div key={idx} className="p-5 bg-[#0E1424] border border-slate-800/80 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</span>
                    <div className="text-2xl font-black text-white font-mono leading-none">{card.value}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      {card.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Two columns: Queue & Connected Status */}
              <div className="grid lg:grid-cols-12 gap-6 items-start">
                
                {/* Column 1: Upcoming Scheduled Posts */}
                <div className="lg:col-span-7 bg-[#0E1424] border border-slate-800/80 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Upcoming Scheduled Queue</h3>
                    <button onClick={() => setActiveTab("calendar")} className="text-[10px] font-bold text-violet-400 hover:underline">
                      Open Calendar →
                    </button>
                  </div>

                  {filteredScheduledPosts.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-500">
                      No posts currently scheduled. Switch to the Compose tab to create one!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredScheduledPosts.map((post) => {
                        const dateStr = post.scheduledAt 
                          ? new Date(post.scheduledAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                          : "";

                        return (
                          <div key={post.id} className="p-3.5 bg-slate-950/45 border border-slate-850 rounded-xl flex items-start justify-between gap-4">
                            <div className="space-y-2 flex-1 min-w-0">
                              <div className="flex flex-wrap gap-1.5 items-center">
                                {post.platforms.map((plat) => (
                                  <span 
                                    key={plat} 
                                    className="px-2 py-0.5 bg-slate-900 text-[10px] font-bold text-slate-400 border border-slate-800 rounded flex items-center gap-1 capitalize"
                                  >
                                    <span>{platformIcons[plat] || "🔗"}</span>
                                    <span>{plat}</span>
                                  </span>
                                ))}
                                <span className="text-[9px] text-slate-500 font-mono">📅 {dateStr}</span>
                              </div>
                              
                              <p className="text-xs text-slate-300 leading-relaxed truncate">
                                {post.content}
                              </p>
                            </div>

                            <div className="flex gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => publishPostImmediately(post.id)}
                                title="Publish Immediately"
                                className="p-1.5 bg-violet-600/10 hover:bg-violet-600 border border-violet-500/20 text-violet-400 hover:text-white rounded-lg transition-all"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                              </button>
                              <button
                                onClick={() => deletePost(post.id)}
                                title="Cancel Post"
                                className="p-1.5 border border-rose-500/10 text-rose-500 hover:bg-rose-950/30 rounded-lg transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Column 2: Connected accounts summary list */}
                <div className="lg:col-span-5 bg-[#0E1424] border border-slate-800/80 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Active Connected Channels</h3>
                    <button onClick={() => setActiveTab("accounts")} className="text-[10px] font-bold text-violet-400 hover:underline">
                      Manage →
                    </button>
                  </div>

                  {activeAccounts.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No accounts connected.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeAccounts.map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-2.5 bg-slate-950/20 border border-slate-900/50 rounded-xl">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg leading-none">{platformIcons[account.platform] || "📸"}</span>
                            <div>
                              <div className="text-xs font-bold text-slate-200 capitalize">{account.platform}</div>
                              <span className="text-[9px] text-slate-500 font-mono">{account.handle}</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/10 px-2 py-0.5 rounded-full">
                            ● Connected
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* Router render subpages */}
          {activeTab === "compose" && <DashboardCompose />}
          {activeTab === "calendar" && <DashboardCalendar />}
          {activeTab === "autoreply" && <DashboardAutoReply />}
          {activeTab === "accounts" && <DashboardAccounts />}
          {activeTab === "analytics" && <DashboardAnalytics />}
          {activeTab === "billing" && <DashboardBilling />}

          {/* Settings Tab fallback */}
          {activeTab === "settings" && (
            <div className="bg-[#0E1424] border border-slate-800/80 p-6 rounded-2xl max-w-xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Profile Settings</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage your workspace metadata configuration.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-slate-450 font-semibold mb-1">First Name</span>
                    <input type="text" defaultValue="John" className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg outline-none" />
                  </div>
                  <div>
                    <span className="block text-slate-450 font-semibold mb-1">Last Name</span>
                    <input type="text" defaultValue="Doe" className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg outline-none" />
                  </div>
                </div>

                <div>
                  <span className="block text-slate-450 font-semibold mb-1">Email Address</span>
                  <input type="text" defaultValue="john.doe@yourbrand.com" disabled className="w-full bg-slate-950 border border-slate-900 p-2.5 rounded-lg text-slate-500" />
                </div>

                <div>
                  <span className="block text-slate-450 font-semibold mb-1">Default Timezone</span>
                  <select className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg outline-none text-slate-300">
                    <option value="GMT+5:30">(GMT+05:30) Chennai, Kolkata, Mumbai</option>
                    <option value="EST">(GMT-05:00) Eastern Time (US & Canada)</option>
                    <option value="GMT">(GMT+00:00) Greenwich Mean Time</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end">
                  <button className="px-5 py-2 bg-violet-600 hover:bg-violet-500 font-bold text-white rounded-lg transition-colors">
                    Save Updates
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
