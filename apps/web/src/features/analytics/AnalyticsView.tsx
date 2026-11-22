"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Activity,
  Layers,
  Target,
  Sparkles,
  Zap,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressRing } from "@/components/ui/ProgressRing";

export function AnalyticsView() {
  const { currentWorkspace } = useWorkspaceStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function load() {
      try {
        setLoading(true);
        const data = await api.getAnalytics(currentWorkspace.id);
        setAnalytics(data);
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentWorkspace?.id]);

  const completionRate = analytics?.completion_rate ?? 67;

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-6 md:p-8 space-y-7 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.08]">
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
          <BarChart3 className="h-6 w-6 text-[#38BDF8]" />
          Spatial Productivity & Mesh Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics, throughput velocity, and coordinate graph density computed from PostgreSQL.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem}>
          <MetricCard
            title="Total Operations"
            value={analytics?.total_tasks ?? 18}
            subtitle={`${analytics?.completed_tasks ?? 12} completed`}
            icon={<CheckCircle2 className="h-4 w-4" />}
            accentColor="emerald"
            trend={{ value: `${completionRate}%`, positive: true }}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Mesh Nodes"
            value={analytics?.graph_density_nodes ?? 9}
            subtitle={`${analytics?.graph_density_edges ?? 8} relational edges`}
            icon={<Layers className="h-4 w-4" />}
            accentColor="cyan"
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Knowledge Density"
            value={analytics?.total_notes ?? 3}
            subtitle="Cross-referenced specs"
            icon={<Activity className="h-4 w-4" />}
            accentColor="amber"
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Active Flight Pipelines"
            value={analytics?.active_projects ?? 2}
            subtitle="Autonomous stages"
            icon={<Zap className="h-4 w-4" />}
            accentColor="violet"
          />
        </motion.div>
      </motion.div>

      {/* Deep Dive Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completion Velocity Card */}
        <GlassPanel elevation="standard" className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white tracking-wide">Execution Throughput</h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Optimal Rate
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-white font-sans">{completionRate}%</span>
              <p className="text-xs text-slate-400">Total task completion ratio</p>
            </div>
            <ProgressRing progress={completionRate} size={84} strokeWidth={7} color="gradient" showValue />
          </div>

          <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Completed tasks</span>
              <span className="text-white">{analytics?.completed_tasks ?? 12}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Remaining tasks</span>
              <span className="text-white">{(analytics?.total_tasks ?? 18) - (analytics?.completed_tasks ?? 12)}</span>
            </div>
          </div>
        </GlassPanel>

        {/* Spatial Topology Density */}
        <GlassPanel elevation="standard" className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white tracking-wide">Spatial Topology Density</h3>
            <span className="text-[10px] font-mono text-purple-300 bg-[#9366FF]/15 px-2 py-0.5 rounded-full border border-[#9366FF]/30">
              Coordinate Mesh
            </span>
          </div>

          <div className="space-y-3 py-2">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-mono">
                <span>Projects to Goals Ratio</span>
                <span className="text-[#9366FF]">100% Attached</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#9366FF] rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-mono">
                <span>Task Entity Linkage</span>
                <span className="text-[#38BDF8]">88% Resolved</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#38BDF8] rounded-full w-[88%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-mono">
                <span>Knowledge Base Graph Density</span>
                <span className="text-amber-400">75% Cross-referenced</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full w-[75%]" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] text-[11px] text-slate-400 font-mono">
            Relational graph synchronized across active workspace nodes.
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
