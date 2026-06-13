"use client";

import { useState } from "react";
import { useMockData, Post } from "@/hooks/use-mock-data";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Trash2, 
  Play, 
  Calendar as CalendarIcon,
  X,
  AlertCircle
} from "lucide-react";

// Platform colors for indicators
const platformColors: Record<string, string> = {
  instagram: "bg-pink-500",
  twitter: "bg-slate-400",
  linkedin: "bg-blue-600",
  facebook: "bg-blue-500",
  tiktok: "bg-cyan-400",
  youtube: "bg-red-500",
  pinterest: "bg-red-650",
  discord: "bg-indigo-500",
  slack: "bg-purple-600"
};

export default function DashboardCalendar() {
  const { posts, deletePost, publishPostImmediately } = useMockData();
  
  // Start with June 2026 (based on local metadata time)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed, so 5 = June
  const [selectedDay, setSelectedDay] = useState<number | null>(13); // Default to June 13

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper: Number of days in the month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper: Starting day index of the month (e.g. 0 = Sun, 1 = Mon)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedDay(null);
  };

  // Find posts scheduled for a specific calendar grid day
  const getPostsForDay = (day: number): Post[] => {
    return posts.filter(post => {
      if (!post.scheduledAt || post.status !== "scheduled") return false;
      const date = new Date(post.scheduledAt);
      return (
        date.getFullYear() === currentYear &&
        date.getMonth() === currentMonth &&
        date.getDate() === day
      );
    });
  };

  // Render Days Grid
  const renderDays = () => {
    const cells = [];
    
    // Empty cells for starting offset
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="h-24 bg-slate-950/10 border border-slate-900/30" />);
    }

    // Days numbers
    for (let day = 1; day <= daysInMonth; day++) {
      const dayPosts = getPostsForDay(day);
      const isSelected = selectedDay === day;
      const isToday = currentYear === 2026 && currentMonth === 5 && day === 13;

      cells.push(
        <div
          key={`day-${day}`}
          onClick={() => setSelectedDay(day)}
          className={`h-24 p-2 border border-slate-900/60 bg-[#0A0E1A] flex flex-col justify-between cursor-pointer hover:bg-slate-900/40 transition-all ${
            isSelected ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#070B16] bg-slate-900" : ""
          }`}
        >
          <div className="flex justify-between items-center">
            <span className={`text-xs font-bold font-mono ${
              isToday 
                ? "bg-violet-600 text-white w-5 h-5 rounded-full flex items-center justify-center" 
                : isSelected ? "text-violet-400" : "text-slate-400"
            }`}>
              {day}
            </span>
            
            {dayPosts.length > 0 && (
              <span className="text-[9px] font-bold text-slate-500 font-mono">
                {dayPosts.length} post{dayPosts.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Indicators for scheduled posts */}
          <div className="flex flex-wrap gap-1 mt-1">
            {dayPosts.map((post) => (
              <div key={post.id} className="flex gap-0.5">
                {post.platforms.map((plat) => (
                  <span 
                    key={plat}
                    className={`w-1.5 h-1.5 rounded-full ${platformColors[plat] || "bg-slate-400"}`} 
                    title={`${plat}: Scheduled`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Fill remaining grid spaces to complete a neat layout
    const totalSlots = cells.length;
    const remainingSlots = 42 - totalSlots; // standard 6-row grid
    for (let i = 0; i < (remainingSlots < 7 ? remainingSlots : remainingSlots - 7); i++) {
      cells.push(<div key={`empty-end-${i}`} className="h-24 bg-slate-950/10 border border-slate-900/30" />);
    }

    return cells;
  };

  const activeDayPosts = selectedDay ? getPostsForDay(selectedDay) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Content Calendar</h2>
          <p className="text-sm text-slate-400">Review scheduled marketing pipelines visually across channels.</p>
        </div>

        {/* Date navigators */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 border border-slate-800 hover:border-slate-700 bg-[#0E1424] text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white min-w-[110px] text-center font-mono">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 border border-slate-800 hover:border-slate-700 bg-[#0E1424] text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-8 bg-[#0E1424] border border-slate-800/80 rounded-2xl overflow-hidden p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 bg-slate-900/40">
            {renderDays()}
          </div>
        </div>

        {/* Selected Date Details Sidebar */}
        <div className="lg:col-span-4 bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-violet-400" />
              Schedule Details
            </h3>
            {selectedDay && (
              <span className="text-xs font-semibold text-slate-400 font-mono">
                {monthNames[currentMonth]} {selectedDay}, {currentYear}
              </span>
            )}
          </div>

          {!selectedDay ? (
            <div className="text-center py-12 text-xs text-slate-500">
              Select a calendar day to review scheduled post items.
            </div>
          ) : activeDayPosts.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500 space-y-2">
              <AlertCircle className="w-6 h-6 text-slate-600 mx-auto" />
              <p>No posts scheduled for this date.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {activeDayPosts.map((post) => {
                const timeStr = post.scheduledAt 
                  ? new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : "";

                return (
                  <div key={post.id} className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase font-mono">
                        <Clock className="w-3.5 h-3.5 text-violet-400" />
                        <span>{timeStr}</span>
                      </div>
                      
                      <div className="flex gap-1.5">
                        {post.platforms.map((plat) => (
                          <span 
                            key={plat} 
                            className={`w-2 h-2 rounded-full ${platformColors[plat] || "bg-slate-450"}`} 
                            title={plat}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-350 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>

                    <div className="flex gap-2 pt-2 border-t border-slate-900/60">
                      <button
                        onClick={() => publishPostImmediately(post.id)}
                        className="flex-1 py-1.5 bg-violet-600/10 hover:bg-violet-600 border border-violet-500/20 text-violet-400 hover:text-white rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                      >
                        <Play className="w-2.5 h-2.5" /> Post Now
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-1.5 border border-rose-500/10 text-rose-500 hover:bg-rose-950/30 rounded transition-all"
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
      </div>
    </div>
  );
}
