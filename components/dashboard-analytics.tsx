"use client";

import { useState, useEffect } from "react";
import { useMockData } from "@/hooks/use-mock-data";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { 
  Calendar, 
  TrendingUp, 
  Share2, 
  Award,
  ArrowUpRight,
  ChevronDown
} from "lucide-react";

// Mock chart data arrays
const reachTimelineData = [
  { day: "Jun 01", Reach: 4200 },
  { day: "Jun 03", Reach: 4800 },
  { day: "Jun 05", Reach: 5100 },
  { day: "Jun 07", Reach: 6200 },
  { day: "Jun 09", Reach: 5900 },
  { day: "Jun 11", Reach: 7300 },
  { day: "Jun 13", Reach: 8400 },
];

const platformEngagementData = [
  { name: "Instagram", Engagement: 4.8 },
  { name: "Twitter/X", Engagement: 2.1 },
  { name: "LinkedIn", Engagement: 5.6 },
  { name: "Facebook", Engagement: 1.8 },
  { name: "YouTube", Engagement: 6.2 },
];

export default function DashboardAnalytics() {
  const { posts } = useMockData();
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState<"reach" | "engagement">("reach");

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const performancePosts = [
    { id: 1, title: "Summer collection launch", platform: "📸 Instagram", reach: 24200, engagement: "6.8%", status: "Published" },
    { id: 2, title: "Automating workflow guidelines", platform: "💼 LinkedIn", reach: 18400, engagement: "5.4%", status: "Published" },
    { id: 3, title: "AI scheduler reveal teaser", platform: "🐦 Twitter/X", reach: 12100, engagement: "3.2%", status: "Published" },
    { id: 4, title: "5 design systems guidelines", platform: "💼 LinkedIn", reach: 9800, engagement: "4.9%", status: "Published" },
    { id: 5, title: "Workspace tour review", platform: "📸 Instagram", reach: 8900, engagement: "5.1%", status: "Published" },
  ];

  const sortedPosts = [...performancePosts].sort((a, b) => {
    if (sortBy === "reach") return b.reach - a.reach;
    return parseFloat(b.engagement) - parseFloat(a.engagement);
  });

  if (!mounted) {
    return (
      <div className="h-[450px] bg-[#0E1424] border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-xs">
        Loading analytics charts...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Performance Analytics</h2>
          <p className="text-sm text-slate-400">Track impressions, subscriber reach metrics, and engagement metrics.</p>
        </div>

        {/* Date Filter */}
        <button className="px-3.5 py-1.5 bg-[#0E1424] border border-slate-800 text-slate-350 text-xs font-semibold rounded-lg flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-violet-400" /> Last 14 Days <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>
      </div>

      {/* Grid of charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Reach Timeline Chart */}
        <div className="bg-[#0E1424] border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Reach Dynamics</span>
            <h3 className="text-sm font-bold text-white mt-0.5">Total Audience Reach (Impressions)</h3>
          </div>

          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reachTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.3} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0E1424", borderColor: "#334155", borderRadius: "8px" }}
                  labelStyle={{ color: "#94A3B8", fontWeight: "bold" }}
                />
                <Line type="monotone" dataKey="Reach" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: "#A78BFA", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Rate Bar Chart */}
        <div className="bg-[#0E1424] border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Engagement Index</span>
            <h3 className="text-sm font-bold text-white mt-0.5">Average Engagement Rate (%)</h3>
          </div>

          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformEngagementData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0E1424", borderColor: "#334155", borderRadius: "8px" }}
                  labelStyle={{ color: "#94A3B8", fontWeight: "bold" }}
                />
                <Bar dataKey="Engagement" fill="#06B6D4" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Sortable post list */}
      <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl overflow-hidden p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-900 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-violet-400" /> Post Performance Leaderboard
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-xs font-semibold px-2 py-1.5 rounded-lg text-slate-300 outline-none"
            >
              <option value="reach">Audience Reach</option>
              <option value="engagement">Engagement Rate</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead>
              <tr className="border-b border-slate-900 text-slate-450 uppercase text-[9px] font-bold tracking-wider">
                <th className="py-3 px-2">Campaign Description</th>
                <th className="py-3 px-2">Target Channel</th>
                <th className="py-3 px-2 text-right">Reach</th>
                <th className="py-3 px-2 text-right">Engagement</th>
                <th className="py-3 px-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedPosts.map((post) => (
                <tr key={post.id} className="border-b border-slate-900/40 hover:bg-slate-950/20 transition-all">
                  <td className="py-3.5 px-2 font-semibold text-slate-200 flex items-center gap-1.5">
                    {post.title} <ArrowUpRight className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100" />
                  </td>
                  <td className="py-3.5 px-2 text-slate-400">{post.platform}</td>
                  <td className="py-3.5 px-2 text-right font-mono font-medium">{post.reach.toLocaleString()}</td>
                  <td className="py-3.5 px-2 text-right font-mono font-medium text-cyan-400">{post.engagement}</td>
                  <td className="py-3.5 px-2 text-center">
                    <span className="bg-emerald-950/40 border border-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {post.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
