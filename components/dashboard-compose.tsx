"use client";

import { useState, useEffect } from "react";
import { useMockData } from "@/hooks/use-mock-data";
import { generateCaption } from "@/lib/gemini";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Calendar, 
  Clock, 
  HelpCircle, 
  Send,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Platform characteristics
const platformsDetails: Record<string, {
  name: string;
  charLimit: number;
  color: string;
  dotColor: string;
}> = {
  instagram: { name: "Instagram", charLimit: 2200, color: "#E1306C", dotColor: "bg-pink-500" },
  twitter: { name: "Twitter / X", charLimit: 280, color: "#000000", dotColor: "bg-slate-700" },
  linkedin: { name: "LinkedIn", charLimit: 3000, color: "#0A66C2", dotColor: "bg-blue-600" },
  facebook: { name: "Facebook", charLimit: 5000, color: "#1877F2", dotColor: "bg-blue-500" },
  tiktok: { name: "TikTok", charLimit: 2200, color: "#00F2FE", dotColor: "bg-cyan-400" },
  youtube: { name: "YouTube", charLimit: 5000, color: "#FF0000", dotColor: "bg-red-500" },
  pinterest: { name: "Pinterest", charLimit: 500, color: "#E60023", dotColor: "bg-red-650" },
  discord: { name: "Discord", charLimit: 2000, color: "#5865F2", dotColor: "bg-indigo-500" },
  slack: { name: "Slack", charLimit: 4000, color: "#4A154B", dotColor: "bg-purple-600" }
};

export default function DashboardCompose() {
  const { connectedAccounts, addPost, currentPlan, incrementAIAssists } = useMockData();
  const activeAccounts = connectedAccounts.filter(a => a.connected);

  // Form State
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [scheduledDate, setScheduledDate] = useState("2026-06-15");
  const [scheduledTime, setScheduledTime] = useState("15:00");
  const [isSchedule, setIsSchedule] = useState(true);
  
  // Media State
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // ImageKit URL Transformation values
  const [ikWidth, setIkWidth] = useState(800);
  const [ikFilter, setIkFilter] = useState("none"); // none, grayscale, contrast, blur, brightness
  const [ikBrightness, setIkBrightness] = useState(100);
  const [ikContrast, setIkContrast] = useState(100);

  // AI Assist States
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    captions: string[];
    hashtags: string[];
  } | null>(null);
  
  // Preview State
  const [previewTab, setPreviewTab] = useState("instagram");

  // Determine current limit based on selected platforms (lowest limit rules)
  const getCharLimit = () => {
    if (selectedPlatforms.length === 0) return 2200;
    const limits = selectedPlatforms.map(p => platformsDetails[p]?.charLimit || 2200);
    return Math.min(...limits);
  };

  const charLimit = getCharLimit();
  const charsRemaining = charLimit - caption.length;

  // Pre-select first connected platform
  useEffect(() => {
    if (activeAccounts.length > 0 && selectedPlatforms.length === 0) {
      setSelectedPlatforms([activeAccounts[0].platform]);
      setPreviewTab(activeAccounts[0].platform);
    }
  }, [connectedAccounts]);

  const handleTogglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(prev => prev.filter(p => p !== platform));
      }
    } else {
      setSelectedPlatforms(prev => [...prev, platform]);
    }
  };

  // Mock upload selector
  const handleSelectMockImage = (url: string) => {
    setIsUploading(true);
    setTimeout(() => {
      setImageUrl(url);
      setIsUploading(false);
    }, 800);
  };

  // Trigger Gemini AI caption assist
  const handleGenerateAICaption = async () => {
    if (!aiPrompt.trim()) return;
    
    // Check Free usage limit
    const allowed = incrementAIAssists();
    if (!allowed) return;

    setAiLoading(true);
    try {
      const res = await generateCaption(aiPrompt, selectedPlatforms[0] || "instagram");
      setAiSuggestions(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // Save/Submit Post
  const handleSchedulePost = () => {
    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }
    if (!caption.trim() && !imageUrl) {
      alert("Post needs caption text or media content.");
      return;
    }

    const scheduledDateTime = isSchedule 
      ? new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString() 
      : new Date().toISOString();

    addPost(
      caption,
      selectedPlatforms,
      scheduledDateTime,
      imageUrl ? [imageUrl] : []
    );

    // Reset Form
    setCaption("");
    setImageUrl(null);
    setAiSuggestions(null);
    setAiPrompt("");
    alert(isSchedule ? "Post successfully scheduled!" : "Post published successfully!");
  };

  // Apply filters visually via inline styles
  const getFilterStyle = () => {
    let filterString = `brightness(${ikBrightness}%) contrast(${ikContrast}%)`;
    if (ikFilter === "grayscale") filterString += " grayscale(100%)";
    if (ikFilter === "blur") filterString += " blur(2px)";
    return { filter: filterString };
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Composer Controls */}
      <div className="lg:col-span-7 space-y-6">
        {/* Step 1: Platforms */}
        <div className="bg-[#0E1424] border border-slate-800/80 p-5 rounded-2xl space-y-3">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Select Publishing Targets</label>
          {activeAccounts.length === 0 ? (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>No channels connected. Go to the Accounts section to link your profiles first!</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {activeAccounts.map((account) => {
                const isSelected = selectedPlatforms.includes(account.platform);
                const info = platformsDetails[account.platform];
                
                return (
                  <button
                    key={account.id}
                    onClick={() => handleTogglePlatform(account.platform)}
                    className={`px-3.5 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all ${
                      isSelected 
                        ? "bg-violet-600/10 border-violet-500 text-violet-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${info?.dotColor || "bg-slate-400"}`} />
                    <span>{info?.name} ({account.handle})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 2: Content Area */}
        <div className="bg-[#0E1424] border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Caption content</label>
            <span className={`text-xs font-mono font-medium ${charsRemaining < 0 ? "text-rose-400" : "text-slate-400"}`}>
              {caption.length} / {charLimit}
            </span>
          </div>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={5}
            maxLength={charLimit + 200} // Allow typing past limit to show warning red count
            placeholder="Write an engaging message... Use hashtags and mentions."
            className="w-full p-4 bg-slate-950/80 text-slate-200 border border-slate-800/85 rounded-xl text-sm focus:border-violet-500 outline-none resize-none leading-relaxed"
          />

          {charsRemaining < 0 && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Character limit exceeded for selected platforms.
            </p>
          )}

          {/* AI Assist Module */}
          <div className="border-t border-slate-900 pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Gemini AI Assist</span>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask Gemini: 'write a promotion post for my new software release'"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs outline-none focus:border-violet-500"
              />
              <button
                onClick={handleGenerateAICaption}
                disabled={aiLoading || !aiPrompt.trim()}
                className="px-4 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800/40 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                {aiLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Suggest"}
              </button>
            </div>

            {/* AI Copy suggestions */}
            {aiSuggestions && (
              <div className="bg-slate-950/50 p-4 border border-slate-850 rounded-xl space-y-3 animate-fade-in">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">CLICK TO USE SUGGESTION:</div>
                <div className="space-y-2.5">
                  {aiSuggestions.captions.map((s, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        const tags = aiSuggestions.hashtags.slice(0, 5).join(" ");
                        setCaption(`${s}\n\n${tags}`);
                      }}
                      className="p-3 bg-slate-900 border border-slate-800 hover:border-violet-500/50 text-slate-300 hover:text-white rounded-lg text-xs leading-relaxed cursor-pointer transition-all"
                    >
                      {s}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-900">
                  {aiSuggestions.hashtags.map((h, i) => (
                    <span 
                      key={i} 
                      onClick={() => setCaption(prev => prev + " " + h)}
                      className="text-[10px] bg-slate-900 text-violet-400 hover:text-white cursor-pointer px-2 py-0.5 rounded border border-slate-800"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Media Upload & ImageKit transformations */}
        <div className="bg-[#0E1424] border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Media Upload</label>

          {imageUrl ? (
            <div className="space-y-4">
              {/* Image Preview container */}
              <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center h-48">
                <img 
                  src={imageUrl} 
                  alt="Post preview" 
                  style={getFilterStyle()} 
                  className="max-h-full max-w-full object-contain transition-all duration-300"
                />
                <button
                  onClick={() => setImageUrl(null)}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/85 text-white font-bold p-1 rounded-full text-xs"
                >
                  ✕
                </button>
              </div>

              {/* ImageKit transformation settings */}
              <div className="p-4 bg-slate-950/30 border border-slate-900 rounded-xl space-y-4 text-xs">
                <div className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-violet-400" /> ImageKit URL Transforms
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Select filters */}
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Preset Filter</label>
                    <select
                      value={ikFilter}
                      onChange={(e) => setIkFilter(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-300 outline-none"
                    >
                      <option value="none">Original</option>
                      <option value="grayscale">Grayscale</option>
                      <option value="blur">Soft Blur</option>
                    </select>
                  </div>

                  {/* Resizing Width */}
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Scale Width ({ikWidth}px)</label>
                    <input
                      type="range"
                      min={400}
                      max={1200}
                      step={50}
                      value={ikWidth}
                      onChange={(e) => setIkWidth(Number(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                  </div>

                  {/* Brightness */}
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Brightness ({ikBrightness}%)</label>
                    <input
                      type="range"
                      min={50}
                      max={150}
                      value={ikBrightness}
                      onChange={(e) => setIkBrightness(Number(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Contrast ({ikContrast}%)</label>
                    <input
                      type="range"
                      min={50}
                      max={150}
                      value={ikContrast}
                      onChange={(e) => setIkContrast(Number(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center bg-slate-950/20 hover:bg-slate-950/45 transition-colors">
              <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium mb-4">Choose from our premium demo catalog to simulate uploader:</p>
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleSelectMockImage("https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&auto=format&fit=crop&q=80")}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-[10px] text-slate-300 font-semibold"
                >
                  🌆 WorkSpace Tech
                </button>
                <button
                  onClick={() => handleSelectMockImage("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80")}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-[10px] text-slate-300 font-semibold"
                >
                  🏖️ Summer Beach
                </button>
                <button
                  onClick={() => handleSelectMockImage("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80")}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-[10px] text-slate-300 font-semibold"
                >
                  🌌 AI & Network
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Schedule */}
        <div className="bg-[#0E1424] border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Publish Timing</label>
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-900 text-xs font-semibold">
              <button
                onClick={() => setIsSchedule(true)}
                className={`px-3 py-1 rounded-md transition-all ${isSchedule ? "bg-violet-600 text-white" : "text-slate-400"}`}
              >
                Schedule
              </button>
              <button
                onClick={() => setIsSchedule(false)}
                className={`px-3 py-1 rounded-md transition-all ${!isSchedule ? "bg-violet-600 text-white" : "text-slate-400"}`}
              >
                Post Now
              </button>
            </div>
          </div>

          {isSchedule && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-450 uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date
                </span>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-violet-500"
                />
              </div>
              
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-450 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Time (GMT+5:30)
                </span>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-violet-500"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSchedulePost}
            disabled={charsRemaining < 0}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 font-bold text-white text-sm rounded-xl transition-all shadow-xl shadow-violet-500/5 hover:shadow-violet-500/15 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSchedule ? "📅 Confirm Schedule Post" : "⚡ Publish Live Now"}
          </button>
        </div>
      </div>

      {/* RIGHT: Live Feed Preview */}
      <div className="lg:col-span-5 space-y-4 sticky top-[80px]">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Mockup Feed Preview</h3>

        {/* Tab selection */}
        <div className="flex border-b border-slate-850">
          <button
            onClick={() => setPreviewTab("instagram")}
            className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all ${
              previewTab === "instagram" ? "border-violet-500 text-violet-400" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            Instagram
          </button>
          <button
            onClick={() => setPreviewTab("twitter")}
            className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all ${
              previewTab === "twitter" ? "border-violet-500 text-violet-400" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            Twitter / X
          </button>
          <button
            onClick={() => setPreviewTab("linkedin")}
            className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all ${
              previewTab === "linkedin" ? "border-violet-500 text-violet-400" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            LinkedIn
          </button>
        </div>

        {/* Mockups */}
        <div className="bg-[#090D1A] border border-slate-850 p-4 rounded-2xl">
          {previewTab === "instagram" && (
            <div className="border border-slate-900 rounded-xl bg-black overflow-hidden max-w-sm mx-auto shadow-xl">
              {/* Insta Header */}
              <div className="p-3 flex items-center gap-2.5 border-b border-slate-950">
                <div className="w-7 h-7 rounded-full bg-pink-600 text-white font-bold text-[10px] flex items-center justify-center">YB</div>
                <div>
                  <div className="text-xs font-bold text-slate-200">yourbrand</div>
                  <div className="text-[9px] text-slate-450">Miami, Florida</div>
                </div>
              </div>

              {/* Insta Image */}
              <div className="bg-slate-950 aspect-square flex items-center justify-center relative overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt="preview" style={getFilterStyle()} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-slate-600 text-xs flex flex-col items-center gap-1">
                    <ImageIcon className="w-6 h-6" /> Image asset will load here
                  </div>
                )}
              </div>

              {/* Insta Actions */}
              <div className="p-3.5 space-y-2 text-xs">
                <div className="flex gap-3 text-slate-300 font-semibold">
                  <span>❤️</span> <span>💬</span> <span>✈️</span>
                </div>
                <div className="text-[10px] font-bold text-slate-300">1,248 likes</div>
                <div className="text-[11px] leading-relaxed text-slate-300">
                  <span className="font-bold mr-1.5">yourbrand</span>
                  {caption || "Write your caption content to preview rendering live..."}
                </div>
              </div>
            </div>
          )}

          {previewTab === "twitter" && (
            <div className="border border-slate-850 rounded-xl bg-slate-950 p-4 max-w-sm mx-auto text-[13px] leading-relaxed shadow-xl text-slate-200">
              {/* Twitter Header */}
              <div className="flex gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-[11px] flex items-center justify-center">JD</div>
                <div>
                  <div className="font-bold flex items-center gap-1">John Doe <span className="text-[10px] text-slate-400 font-normal">@yourbrand · 2m</span></div>
                  <div className="text-[10px] text-violet-400 font-semibold">QueueBot Scheduler</div>
                </div>
              </div>

              {/* Twitter text */}
              <p className="mb-3 whitespace-pre-wrap">
                {caption || "Write your caption content to preview rendering live..."}
              </p>

              {/* Twitter image */}
              {imageUrl && (
                <div className="border border-slate-900 rounded-xl overflow-hidden mb-3 bg-slate-900 max-h-48 flex items-center justify-center">
                  <img src={imageUrl} alt="preview" style={getFilterStyle()} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Twitter Actions */}
              <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900/50">
                <span>💬 0</span> <span>🔁 0</span> <span>❤️ 1</span> <span>📊 1</span>
              </div>
            </div>
          )}

          {previewTab === "linkedin" && (
            <div className="border border-slate-850 rounded-xl bg-slate-950 p-4 max-w-sm mx-auto shadow-xl text-[12px] text-slate-200">
              {/* LI Header */}
              <div className="flex gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-700 text-white font-bold text-[12px] flex items-center justify-center">YB</div>
                <div>
                  <div className="font-bold">Your Brand Page</div>
                  <div className="text-[9px] text-slate-500">12,408 followers</div>
                  <div className="text-[9px] text-slate-500">Promoted · Scheduled</div>
                </div>
              </div>

              {/* LI text */}
              <p className="mb-3 whitespace-pre-wrap leading-relaxed">
                {caption || "Write your caption content to preview rendering live..."}
              </p>

              {/* LI Image */}
              {imageUrl && (
                <div className="border border-slate-900/60 rounded-lg overflow-hidden bg-slate-900 mb-3 max-h-44 flex items-center justify-center">
                  <img src={imageUrl} alt="preview" style={getFilterStyle()} className="w-full h-full object-cover" />
                </div>
              )}

              {/* LI Actions */}
              <div className="flex justify-between border-t border-slate-900 pt-2.5 text-slate-400 font-semibold text-[11px]">
                <span>👍 Like</span> <span>💬 Comment</span> <span>🔁 Repost</span> <span>➡️ Send</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
