"use client";

import React from "react";
import { MockDataProvider } from "@/hooks/use-mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MockDataProvider>
      <div className="min-h-screen bg-[#070B16] text-slate-100 flex flex-col antialiased">
        {children}
      </div>
    </MockDataProvider>
  );
}
