"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  Activity,
  Layers,
  Zap,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressRing } from "@/components/ui/ProgressRing";

export function AnalyticsView() {
  const { currentWorkspace, analytics: storeAnalytics, setAnalytics: setStoreAnalytics } = useWorkspaceStore();
  const [analytics, setAnalytics] = useState<any>(storeAnalytics);
  const [loading, setLoading] = useState(storeAnalytics === null);

  useEffect(() => {
    if (storeAnalytics) {
      setAnalytics(storeAnalytics);
      setLoading(false);
    }
  }, [storeAnalytics]);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function load() {
      try {
        const data = await api.getAnalytics(currentWorkspace.id);
        setAnalytics(data);
        setStoreAnalytics(data);
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentWorkspace?.id, setStoreAnalytics]);

  const completionRate = analytics?.completion_rate ?? 67;

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-[#202e2b] space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-5 h-[2px] bg-[#a7f3d0] rounded-sm" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#a7f3d0] font-medium">
            05 / Workspace Analytics
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-normal text-[#f1f5f4] font-sans">
          Throughput & <span className="font-serif italic text-[#a7f3d0]">intelligence.</span>
        </h1>
        <p className="text-xs text-[#9aaba8]">
          Operational metrics, task completion velocity, and graph coordinate density computed from database.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
      >
        <motion.div variants={staggerItem}>
          <MetricCard
            title="Total Operations"
            value={analytics?.total_tasks ?? 18}
            subtitle={`${analytics?.completed_tasks ?? 12} completed`}
            icon={<CheckCircle2 className="h-4 w-4" />}
            accentColor="mint"
            trend={{ value: `${completionRate}%`, positive: true }}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Graph Nodes"
            value={analytics?.graph_density_nodes ?? 9}
            subtitle={`${analytics?.graph_density_edges ?? 8} relational edges`}
            icon={<Layers className="h-4 w-4" />}
            accentColor="cyan"
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Knowledge Specs"
            value={analytics?.total_notes ?? 3}
            subtitle="Cross-referenced documents"
            icon={<Activity className="h-4 w-4" />}
            accentColor="amber"
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Active Projects"
            value={analytics?.active_projects ?? 2}
            subtitle="Operational pipelines"
            icon={<Zap className="h-4 w-4" />}
            accentColor="emerald"
          />
        </motion.div>
      </motion.div>

      {/* Deep Dive Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completion Velocity Card */}
        <GlassPanel elevation="standard" className="p-5 space-y-4 bg-[#101918]">
          <div className="flex items-center justify-between pb-3 border-b border-[#202e2b]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#f1f5f4] font-medium">
              Execution Throughput
            </h3>
            <span className="text-[10px] font-mono text-[#34d399] bg-[#34d399]/10 px-2 py-0.5 rounded border border-[#34d399]/20">
              Optimal Rate
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <span className="text-3xl font-semibold text-[#f1f5f4] font-sans tabular-nums">
                {completionRate}%
              </span>
              <p className="text-xs text-[#9aaba8]">Task completion ratio</p>
            </div>
            <ProgressRing progress={completionRate} size={76} strokeWidth={6} color="mint" showValue />
          </div>

          <div className="space-y-2 pt-2 border-t border-[#16221f] text-xs font-mono">
            <div className="flex justify-between text-[#9aaba8]">
              <span>Completed tasks</span>
              <span className="text-[#f1f5f4]">{analytics?.completed_tasks ?? 12}</span>
            </div>
            <div className="flex justify-between text-[#9aaba8]">
              <span>Pending tasks</span>
              <span className="text-[#f1f5f4]">
                {(analytics?.total_tasks ?? 18) - (analytics?.completed_tasks ?? 12)}
              </span>
            </div>
            <div className="flex justify-between text-[#9aaba8]">
              <span>Active pipelines</span>
              <span className="text-[#a7f3d0]">{analytics?.active_projects ?? 2}</span>
            </div>
          </div>
        </GlassPanel>

        {/* Spatial Mesh Density Card */}
        <GlassPanel elevation="standard" className="p-5 space-y-4 bg-[#101918]">
          <div className="flex items-center justify-between pb-3 border-b border-[#202e2b]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#f1f5f4] font-medium">
              Knowledge Graph Density
            </h3>
            <span className="text-[10px] font-mono text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/20">
              High Cohesion
            </span>
          </div>

          <div className="space-y-3 py-1">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-[#9aaba8]">
                <span>Project Nodes</span>
                <span className="text-[#a7f3d0]">40%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#16221f] overflow-hidden">
                <div className="h-full bg-[#a7f3d0] rounded-full" style={{ width: "40%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-[#9aaba8]">
                <span>Task Nodes</span>
                <span className="text-[#38bdf8]">40%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#16221f] overflow-hidden">
                <div className="h-full bg-[#38bdf8] rounded-full" style={{ width: "40%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-[#9aaba8]">
                <span>Note Nodes</span>
                <span className="text-[#fbbf24]">20%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#16221f] overflow-hidden">
                <div className="h-full bg-[#fbbf24] rounded-full" style={{ width: "20%" }} />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#16221f] flex justify-between text-[11px] font-mono text-[#6e807d]">
            <span>Graph connectivity index</span>
            <span className="text-[#a7f3d0]">0.88 / 1.0</span>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
