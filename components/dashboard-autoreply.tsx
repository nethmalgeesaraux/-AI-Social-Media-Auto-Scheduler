"use client";

import { useState } from "react";
import { useMockData, AutoReplyRule } from "@/hooks/use-mock-data";
import { generateReply } from "@/lib/gemini";
import { 
  Plus, 
  MessageSquare, 
  Sparkles, 
  Trash2, 
  Layers, 
  Play, 
  Settings,
  HelpCircle,
  Clock,
  ChevronRight
} from "lucide-react";

export default function DashboardAutoReply() {
  const { 
    autoReplyRules, 
    addRule, 
    toggleRule, 
    deleteRule, 
    connectedAccounts, 
    currentPlan, 
    incrementAIAssists 
  } = useMockData();
  
  const activeAccounts = connectedAccounts.filter(a => a.connected);

  // Form State
  const [selectedPlatform, setSelectedPlatform] = useState(activeAccounts[0]?.platform || "instagram");
  const [triggerType, setTriggerType] = useState<"keyword" | "any_comment" | "first_comment">("keyword");
  const [keywordsText, setKeywordsText] = useState("");
  const [replyTemplate, setReplyTemplate] = useState("");
  const [useAI, setUseAI] = useState(false);

  // Comment Webhook Simulator State
  const [simRuleId, setSimRuleId] = useState(autoReplyRules[0]?.id || "");
  const [simComment, setSimComment] = useState("Hi, how much does the Pro subscription cost?");
  const [simLoading, setSimLoading] = useState(false);
  const [simLogs, setSimLogs] = useState<Array<{
    id: string;
    ruleName: string;
    comment: string;
    reply: string;
    timestamp: string;
  }>>([
    {
      id: "log_1",
      ruleName: "Instagram (@yourbrand) - Keyword Rule",
      comment: "Is this tool promo running?",
      reply: "Hi there! Our plans start at $0/mo. Check out our Billing section for details! ⚡",
      timestamp: "10 mins ago"
    }
  ]);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeAccounts.length === 0) {
      alert("Please connect a social account first.");
      return;
    }

    const keywordArray = triggerType === "keyword" 
      ? keywordsText.split(",").map(k => k.trim().toLowerCase()).filter(Boolean)
      : [];

    if (triggerType === "keyword" && keywordArray.length === 0) {
      alert("Please enter at least one keyword for keyword matching trigger.");
      return;
    }

    if (!useAI && !replyTemplate.trim()) {
      alert("Please enter a reply template or toggle Gemini AI replies.");
      return;
    }

    addRule({
      platform: selectedPlatform,
      triggerType,
      keywords: keywordArray,
      replyTemplate: useAI ? "AI Context Generation" : replyTemplate.trim(),
      useAI,
    });

    // Reset Form
    setKeywordsText("");
    setReplyTemplate("");
    setUseAI(false);
    alert("Auto-reply rule added successfully!");
  };

  // Run Comment Webhook Simulation
  const handleSimulateWebhook = async () => {
    if (!simRuleId || !simComment.trim()) return;

    const matchedRule = autoReplyRules.find(r => r.id === simRuleId);
    if (!matchedRule) return;

    // Check if AI limit allows
    if (matchedRule.useAI) {
      const allowed = incrementAIAssists();
      if (!allowed) return;
    }

    setSimLoading(true);

    try {
      const account = connectedAccounts.find(a => a.platform === matchedRule.platform);
      const handle = account?.handle || "@yourbrand";
      
      let finalReply = "";
      if (matchedRule.useAI) {
        // Trigger AI reply via Gemini Client
        finalReply = await generateReply(simComment, "answer friendly and concisely");
      } else {
        finalReply = matchedRule.replyTemplate;
      }

      // Append to simulated log
      const newLog = {
        id: "log_" + Date.now(),
        ruleName: `${matchedRule.platform.toUpperCase()} (${handle}) - ${matchedRule.triggerType.replace("_", " ")}`,
        comment: simComment,
        reply: finalReply,
        timestamp: "Just now"
      };

      setSimLogs(prev => [newLog, ...prev]);
      setSimComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Active Rules & Rule Creator */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Active Rules List */}
        <div className="bg-[#0E1424] border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Auto-Reply Rules</h3>
            <span className="text-xs text-slate-500 font-mono">
              Rules: {autoReplyRules.length} / {currentPlan === "free" ? 2 : 20}
            </span>
          </div>

          {autoReplyRules.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No auto-reply rules configured. Create one below!
            </div>
          ) : (
            <div className="space-y-3">
              {autoReplyRules.map((rule) => {
                const acc = connectedAccounts.find(a => a.platform === rule.platform);
                const handle = acc?.handle || "@yourbrand";
                
                return (
                  <div key={rule.id} className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white capitalize">{rule.platform}</span>
                        <span className="text-[10px] text-slate-450 font-mono">({handle})</span>
                        {rule.useAI && (
                          <span className="text-[9px] font-bold text-violet-400 bg-violet-950/40 border border-violet-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> AI Enabled
                          </span>
                        )}
                      </div>
                      
                      <div className="text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-350">Trigger:</span> {rule.triggerType.replace("_", " ")} 
                        {rule.triggerType === "keyword" && ` [${rule.keywords.join(", ")}]`}
                      </div>

                      <div className="text-[11px] text-slate-500 line-clamp-1 italic">
                        Reply: {rule.replyTemplate}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Active Toggle Switch */}
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                          rule.enabled ? "bg-violet-600" : "bg-slate-800"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                          rule.enabled ? "translate-x-4" : "translate-x-0"
                        }`} />
                      </button>

                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rule Builder Form */}
        <div className="bg-[#0E1424] border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configure New Rule</h3>

          <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              {/* Account Selection */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Social Profile</label>
                {activeAccounts.length === 0 ? (
                  <div className="text-rose-400 font-semibold p-2 bg-rose-950/20 rounded">Link profiles first!</div>
                ) : (
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 outline-none"
                  >
                    {activeAccounts.map(a => (
                      <option key={a.id} value={a.platform}>{a.platform.toUpperCase()} ({a.handle})</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Trigger */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Trigger Condition</label>
                <select
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 outline-none"
                >
                  <option value="keyword">Keyword match in comment</option>
                  <option value="any_comment">Any comment left on post</option>
                  <option value="first_comment">First comment on post only</option>
                </select>
              </div>
            </div>

            {/* Keyword Field */}
            {triggerType === "keyword" && (
              <div className="space-y-1.5">
                <label className="block text-slate-400 font-semibold">Match Keywords (comma separated)</label>
                <input
                  type="text"
                  value={keywordsText}
                  onChange={(e) => setKeywordsText(e.target.value)}
                  placeholder="price, cost, pricing, discount, purchase"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
                />
              </div>
            )}

            {/* Gemini AI toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/45 border border-slate-850 rounded-xl">
              <div className="flex gap-2.5">
                <Sparkles className="w-5 h-5 text-violet-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-xs">Enable Google Gemini AI Auto-Replies</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed mt-0.5">Let Gemini write smart replies based on comment semantics.</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setUseAI(!useAI)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                  useAI ? "bg-violet-600" : "bg-slate-800"
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  useAI ? "translate-x-4" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* Static Template */}
            {!useAI && (
              <div className="space-y-1.5">
                <label className="block text-slate-400 font-semibold">Static Reply Template</label>
                <textarea
                  value={replyTemplate}
                  onChange={(e) => setReplyTemplate(e.target.value)}
                  rows={3}
                  placeholder="Hello! Thanks for writing to us. One of our specialists will DM you shortly!"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 outline-none resize-none leading-relaxed"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 font-bold text-white text-xs rounded-lg shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Auto-Reply Rule
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: Webhook Simulator */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Comment webhook simulator */}
        <div className="bg-[#0E1424] border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <MessageSquare className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Comment Webhook Simulator</h3>
          </div>

          {autoReplyRules.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center">
              Create an auto-reply rule on the left to test comment event simulation.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Simulate comment events received by Webhook endpoints to test triggers and verify Gemini AI responses.
              </p>

              {/* Select Rule to test */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Active Rule</label>
                <select
                  value={simRuleId}
                  onChange={(e) => setSimRuleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-350 outline-none"
                >
                  <option value="">Select a rule...</option>
                  {autoReplyRules.map((rule) => {
                    const acc = connectedAccounts.find(a => a.platform === rule.platform);
                    const handle = acc?.handle || "@yourbrand";
                    return (
                      <option key={rule.id} value={rule.id}>
                        {rule.platform.toUpperCase()} ({handle}) - {rule.triggerType}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* User Mock Comment text */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Mock Customer Comment</label>
                <input
                  type="text"
                  value={simComment}
                  onChange={(e) => setSimComment(e.target.value)}
                  placeholder="e.g. How much does this plan cost?"
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-200 outline-none"
                />
              </div>

              <button
                onClick={handleSimulateWebhook}
                disabled={simLoading || !simRuleId || !simComment.trim()}
                className="w-full py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-850/40 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {simLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Running AI reply evaluator...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" /> Fire Simulation Event
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Live event logs */}
        <div className="bg-[#0E1424] border border-[#111A36] p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-1.5 text-slate-350 border-b border-slate-900 pb-3">
            <Clock className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Comment Log Events</h3>
          </div>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {simLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg text-[11px] space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-violet-400 font-mono uppercase tracking-wider">{log.ruleName}</span>
                  <span className="text-[9px] text-slate-500">{log.timestamp}</span>
                </div>
                
                <p className="text-slate-300">
                  <span className="font-bold text-slate-400">Comment:</span> "{log.comment}"
                </p>
                
                <div className="p-2 bg-violet-950/20 border border-violet-900/25 text-violet-300 rounded font-medium flex gap-1 items-start">
                  <ChevronRight className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold text-violet-200">AI Reply:</span> {log.reply}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
