"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Structure definitions
export interface Post {
  id: string;
  content: string;
  status: "draft" | "scheduled" | "published" | "failed";
  scheduledAt: string | null;
  platforms: string[];
  mediaUrls: string[];
}

export interface ConnectedAccount {
  id: string;
  platform: string; // instagram, youtube, tiktok, facebook, linkedin, pinterest, discord, twitter, slack
  handle: string;
  avatar: string;
  connected: boolean;
}

export interface AutoReplyRule {
  id: string;
  platform: string;
  triggerType: "keyword" | "any_comment" | "first_comment";
  keywords: string[];
  replyTemplate: string;
  useAI: boolean;
  enabled: boolean;
}

export interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

interface MockDataContextType {
  posts: Post[];
  connectedAccounts: ConnectedAccount[];
  autoReplyRules: AutoReplyRule[];
  currentPlan: "free" | "pro" | "agency";
  usageLimits: {
    postsUsed: number;
    postsMax: number;
    rulesUsed: number;
    rulesMax: number;
    aiAssistsUsed: number;
    aiAssistsMax: number;
  };
  analyticsOverview: MetricCard[];
  addPost: (content: string, platforms: string[], scheduledAt: string | null, mediaUrls: string[]) => void;
  deletePost: (id: string) => void;
  publishPostImmediately: (id: string) => void;
  connectAccount: (platform: string, handle: string) => void;
  disconnectAccount: (platform: string) => void;
  addRule: (rule: Omit<AutoReplyRule, "id" | "enabled">) => void;
  toggleRule: (id: string) => void;
  deleteRule: (id: string) => void;
  upgradePlan: (plan: "free" | "pro" | "agency") => void;
  incrementAIAssists: () => boolean;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  // 1. Core State
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro" | "agency">("pro");
  const [aiAssistsCount, setAiAssistsCount] = useState(1);

  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
    {
      id: "acc_1",
      platform: "instagram",
      handle: "@yourbrand",
      avatar: "JD",
      connected: true,
    },
    {
      id: "acc_2",
      platform: "twitter",
      handle: "@yourbrand",
      avatar: "JD",
      connected: true,
    },
    {
      id: "acc_3",
      platform: "linkedin",
      handle: "Your Brand Page",
      avatar: "YB",
      connected: true,
    },
    {
      id: "acc_4",
      platform: "youtube",
      handle: "@yourbrand_shorts",
      avatar: "JD",
      connected: false,
    },
    {
      id: "acc_5",
      platform: "tiktok",
      handle: "@yourbrand_official",
      avatar: "JD",
      connected: false,
    },
    {
      id: "acc_6",
      platform: "facebook",
      handle: "Your Brand FB",
      avatar: "YB",
      connected: false,
    },
    {
      id: "acc_7",
      platform: "pinterest",
      handle: "Your Brand Pins",
      avatar: "YB",
      connected: false,
    },
    {
      id: "acc_8",
      platform: "discord",
      handle: "Your Community Server",
      avatar: "YC",
      connected: false,
    },
    {
      id: "acc_9",
      platform: "slack",
      handle: "Internal Workspaces",
      avatar: "IW",
      connected: false,
    },
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "post_1",
      content: "Summer collection launch event is kicking off today! Check out the link in bio for early access. 📸✨ #SummerStyle #NewDrop",
      status: "scheduled",
      scheduledAt: new Date(Date.now() + 3 * 3600000).toISOString(), // 3 hours from now
      platforms: ["instagram"],
      mediaUrls: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"],
    },
    {
      id: "post_2",
      content: "Exciting news coming soon! We've been working on something huge for social media managers. Turn notifications on! ⚡📱 #Productivity #QueueBot",
      status: "scheduled",
      scheduledAt: new Date(Date.now() + 24 * 3600000).toISOString(), // 24 hours from now
      platforms: ["twitter"],
      mediaUrls: [],
    },
    {
      id: "post_3",
      content: "Sharing our Q3 industry insights on SaaS growth and automated multi-platform engagement operations. Read the full report on our blog.",
      status: "published",
      scheduledAt: new Date(Date.now() - 48 * 3600000).toISOString(), // 2 days ago
      platforms: ["linkedin"],
      mediaUrls: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80"],
    },
    {
      id: "post_4",
      content: "5 ways to automate your marketing workflow without losing your brand authenticity. 💡🤖 #Automation #SocialMarketing",
      status: "draft",
      scheduledAt: null,
      platforms: ["linkedin", "twitter"],
      mediaUrls: [],
    },
  ]);

  const [autoReplyRules, setAutoReplyRules] = useState<AutoReplyRule[]>([
    {
      id: "rule_1",
      platform: "instagram",
      triggerType: "keyword",
      keywords: ["price", "cost", "how much", "promo"],
      replyTemplate: "Hi there! Our premium plans start at $19/mo, but we have a Free tier as well! Check them out here: queuebot.app/pricing ⚡",
      useAI: false,
      enabled: true,
    },
    {
      id: "rule_2",
      platform: "twitter",
      triggerType: "any_comment",
      keywords: [],
      replyTemplate: "Generate a smart reply using Gemini AI models",
      useAI: true,
      enabled: true,
    },
  ]);

  // Usage stats calculator
  const usageLimits = {
    postsUsed: posts.filter(p => p.status === "scheduled" || p.status === "published").length,
    postsMax: currentPlan === "free" ? 10 : currentPlan === "pro" ? 500 : 99999, // 99999 represents unlimited
    rulesUsed: autoReplyRules.length,
    rulesMax: currentPlan === "free" ? 2 : currentPlan === "pro" ? 20 : 99999,
    aiAssistsUsed: aiAssistsCount,
    aiAssistsMax: currentPlan === "free" ? 5 : 99999,
  };

  // 2. Metrics & Analytics State
  const [analyticsOverview, setAnalyticsOverview] = useState<MetricCard[]>([
    { label: "Total Posts", value: "248", change: "↑ 12% this month", trend: "up" },
    { label: "Scheduled Queue", value: "2", change: "Next: Today 3:00 PM", trend: "up" },
    { label: "Total Reach", value: "84.2K", change: "↑ 8.4% this month", trend: "up" },
    { label: "Auto-Replies Sent", value: "1,340", change: "↑ 22.1% this month", trend: "up" },
  ]);

  useEffect(() => {
    // Update metric numbers when lists change
    setAnalyticsOverview([
      { label: "Total Posts", value: String(posts.length + 244), change: "↑ 12% this month", trend: "up" },
      { label: "Scheduled Queue", value: String(posts.filter(p => p.status === "scheduled").length), change: "Keep queue active", trend: "up" },
      { label: "Total Reach", value: "84.2K", change: "↑ 8.4% this month", trend: "up" },
      { label: "Auto-Replies Sent", value: "1,340", change: "↑ 22.1% this month", trend: "up" },
    ]);
  }, [posts]);

  // 3. Actions
  const addPost = (content: string, platforms: string[], scheduledAt: string | null, mediaUrls: string[]) => {
    // Check limit
    if (usageLimits.postsUsed >= usageLimits.postsMax) {
      alert("Post limit reached for your plan! Upgrade in the Billing tab.");
      return;
    }

    const newPost: Post = {
      id: "post_" + Math.random().toString(36).substring(7),
      content,
      status: scheduledAt ? "scheduled" : "draft",
      scheduledAt,
      platforms,
      mediaUrls,
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const publishPostImmediately = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return { ...p, status: "published", scheduledAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  const connectAccount = (platform: string, handle: string) => {
    setConnectedAccounts(prev =>
      prev.map(acc => {
        if (acc.platform === platform) {
          return { ...acc, connected: true, handle };
        }
        return acc;
      })
    );
  };

  const disconnectAccount = (platform: string) => {
    setConnectedAccounts(prev =>
      prev.map(acc => {
        if (acc.platform === platform) {
          return { ...acc, connected: false, handle: "" };
        }
        return acc;
      })
    );
  };

  const addRule = (rule: Omit<AutoReplyRule, "id" | "enabled">) => {
    if (usageLimits.rulesUsed >= usageLimits.rulesMax) {
      alert("Rule limits reached! Upgrade in the Billing tab.");
      return;
    }
    const newRule: AutoReplyRule = {
      ...rule,
      id: "rule_" + Math.random().toString(36).substring(7),
      enabled: true,
    };
    setAutoReplyRules(prev => [...prev, newRule]);
  };

  const toggleRule = (id: string) => {
    setAutoReplyRules(prev =>
      prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const deleteRule = (id: string) => {
    setAutoReplyRules(prev => prev.filter(r => r.id !== id));
  };

  const upgradePlan = (plan: "free" | "pro" | "agency") => {
    setCurrentPlan(plan);
  };

  const incrementAIAssists = (): boolean => {
    if (usageLimits.aiAssistsUsed >= usageLimits.aiAssistsMax) {
      alert("AI assists limit reached for the Free tier! Upgrade to Pro for unlimited AI assists.");
      return false;
    }
    setAiAssistsCount(prev => prev + 1);
    return true;
  };

  return (
    <MockDataContext.Provider
      value={{
        posts,
        connectedAccounts,
        autoReplyRules,
        currentPlan,
        usageLimits,
        analyticsOverview,
        addPost,
        deletePost,
        publishPostImmediately,
        connectAccount,
        disconnectAccount,
        addRule,
        toggleRule,
        deleteRule,
        upgradePlan,
        incrementAIAssists,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
}
