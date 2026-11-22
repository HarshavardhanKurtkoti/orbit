"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, CheckCircle, Activity, Layers, Target } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";

export function AnalyticsView() {
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function load() {
      try {
        const data = await api.getAnalytics(currentWorkspace.id);
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [currentWorkspace?.id]);

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-white/5">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#38BDF8]" />
          Productivity Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time metrics calculated directly from PostgreSQL data.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-[#11131A] border border-white/10 space-y-2">
          <span className="text-xs text-slate-400">Total Tasks</span>
          <div className="text-3xl font-bold text-white">{analytics?.total_tasks ?? 0}</div>
          <span className="text-[10px] font-mono text-emerald-400 block">
            {analytics?.completed_tasks ?? 0} completed
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#11131A] border border-white/10 space-y-2">
          <span className="text-xs text-slate-400">Completion Rate</span>
          <div className="text-3xl font-bold text-[#8B5CF6]">{analytics?.completion_rate ?? 0}%</div>
          <span className="text-[10px] font-mono text-slate-500 block">Task throughput</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#11131A] border border-white/10 space-y-2">
          <span className="text-xs text-slate-400">Graph Elements</span>
          <div className="text-3xl font-bold text-[#38BDF8]">{analytics?.graph_density_nodes ?? 0}</div>
          <span className="text-[10px] font-mono text-slate-500 block">
            {analytics?.graph_density_edges ?? 0} active connections
          </span>
        </div>
      </div>
    </div>
  );
}
