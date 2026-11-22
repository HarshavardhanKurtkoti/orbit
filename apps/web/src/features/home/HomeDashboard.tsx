"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Orbit,
  Sparkles,
  FolderGit2,
  CheckSquare,
  Layers,
  BookOpen,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem, cardHover3D } from "@/motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { UniversePreview } from "./UniversePreview";
import { ActivityChart } from "./ActivityChart";

export function HomeDashboard() {
  const { currentWorkspace, setActiveTab, setSelectedEntity, setAiModalOpen } = useWorkspaceStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function loadData() {
      try {
        setLoading(true);
        const [projData, taskData, analyticsData] = await Promise.all([
          api.listProjects(currentWorkspace.id),
          api.listTasks(currentWorkspace.id),
          api.getAnalytics(currentWorkspace.id),
        ]);
        setProjects(projData);
        setTasks(taskData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentWorkspace?.id]);

  const toggleTask = async (task: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === "done" ? "todo" : "done";

    // Principle 16: Doherty threshold (<100ms optimistic feedback)
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

    try {
      await api.updateTask(task.id, { status: newStatus });
    } catch {
      // Rollback on error
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
      );
    }
  };

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-6 md:p-8 space-y-7 max-w-7xl mx-auto">
      {/* 1. HERO SECTION: Apple visionOS / Midnight Glass Banner */}
      <GlassPanel
        elevation="elevated"
        glow="aurora"
        className="p-6 md:p-8 relative overflow-hidden border-white/[0.14]"
      >
        {/* Spatial Aurora and Orbital Ring Artwork */}
        <div className="absolute -right-16 -top-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#9366FF]/25 via-[#38BDF8]/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-56 h-56 rounded-full border border-purple-500/30 animate-[spin_60s_linear_infinite]" style={{ borderStyle: "dashed" }} />
          <div className="absolute w-36 h-36 rounded-full border border-cyan-400/30 animate-[spin_35s_linear_infinite_reverse]" />
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-[#9366FF]/40 to-[#38BDF8]/40 blur-md" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-mono text-purple-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ORBIT SPATIAL KERNEL ACTIVE</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans">
              Welcome back, Commander <span className="inline-block hover:rotate-12 transition-transform">✦</span>
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Spatial mesh operational with{" "}
              <span className="text-[#38BDF8] font-semibold">{projects.length} active projects</span> and{" "}
              <span className="text-[#9366FF] font-semibold">{tasks.length} synchronized tasks</span> in{" "}
              <span className="text-white font-medium">{currentWorkspace?.name || "Cosmos Prime"}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <GlassButton
              variant="primary"
              size="lg"
              icon={<Sparkles className="h-4 w-4" />}
              onClick={() => setAiModalOpen(true)}
            >
              Synthesize Blueprint
            </GlassButton>
            <GlassButton
              variant="subtle"
              size="lg"
              onClick={() => setActiveTab("universe")}
            >
              View Canvas
            </GlassButton>
          </div>
        </div>
      </GlassPanel>

      {/* 2. KPI METRICS CARDS (Principle 3: Staggered entrance) */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem}>
          <MetricCard
            title="Completed Tasks"
            value={completedCount}
            subtitle={`${completionRate}% throughput rate`}
            icon={<CheckSquare className="h-4 w-4" />}
            accentColor="emerald"
            trend={{ value: `${completionRate}%`, positive: true }}
            onClick={() => setActiveTab("tasks")}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Active Projects"
            value={projects.length}
            subtitle="Autonomous pipelines"
            icon={<FolderGit2 className="h-4 w-4" />}
            accentColor="violet"
            onClick={() => setActiveTab("tasks")}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Graph Nodes"
            value={analytics?.graph_density_nodes ?? 9}
            subtitle="Connected coordinates"
            icon={<Layers className="h-4 w-4" />}
            accentColor="cyan"
            onClick={() => setActiveTab("universe")}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Knowledge Notes"
            value={analytics?.total_notes ?? 3}
            subtitle="Cross-referenced specs"
            icon={<BookOpen className="h-4 w-4" />}
            accentColor="amber"
            onClick={() => setActiveTab("notes")}
          />
        </motion.div>
      </motion.div>

      {/* 3. ASYMMETRIC BENTO GRID: UNIVERSE PREVIEW & ACTIVITY CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Universe Preview (7 cols) */}
        <div className="lg:col-span-7">
          <UniversePreview />
        </div>

        {/* Right Column: Activity Velocity Chart (5 cols) */}
        <div className="lg:col-span-5">
          <ActivityChart tasks={tasks} />
        </div>
      </div>

      {/* 4. ACTIVE PROJECTS & PRIORITY TASKS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Projects (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white tracking-wide">Active Projects</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                {projects.length} in orbit
              </span>
            </div>
            <button
              onClick={() => setActiveTab("universe")}
              className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 font-medium"
            >
              <span>Explore all</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((proj) => (
              <GlassCard
                key={proj.id}
                elevation="standard"
                onClick={() =>
                  setSelectedEntity({
                    type: "project",
                    id: proj.id,
                    data: proj,
                  })
                }
                className="p-5 flex flex-col justify-between min-h-[170px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-md border ${
                        proj.priority === "urgent"
                          ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                          : proj.priority === "high"
                          ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                          : "bg-sky-500/15 border-sky-500/30 text-sky-300"
                      }`}
                    >
                      {proj.priority}
                    </span>
                    <ProgressRing progress={proj.progress || 0} size={32} strokeWidth={3} />
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors truncate">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="capitalize">{proj.status.replace("_", " ")}</span>
                  <span className="text-white font-medium">{proj.progress || 0}% Done</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Priority Tasks Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white tracking-wide">Priority Tasks</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                {tasks.filter((t) => t.status !== "done").length} pending
              </span>
            </div>
            <button
              onClick={() => setActiveTab("tasks")}
              className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 font-medium"
            >
              <span>Kanban</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <GlassPanel elevation="standard" className="p-3 space-y-2">
            {tasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No active tasks in orbit.</div>
            ) : (
              tasks.slice(0, 6).map((task) => {
                const isDone = task.status === "done";
                return (
                  <motion.div
                    key={task.id}
                    whileHover={{ scale: 1.01, x: 2 }}
                    onClick={() =>
                      setSelectedEntity({
                        type: "task",
                        id: task.id,
                        data: task,
                      })
                    }
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.04] hover:border-white/[0.12] cursor-pointer transition-all group"
                  >
                    {/* Interactive Completion Checkbox */}
                    <button
                      onClick={(e) => toggleTask(task, e)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-500 group-hover:text-purple-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-xs font-medium truncate transition-all ${
                          isDone
                            ? "line-through text-slate-500"
                            : "text-slate-200 group-hover:text-white"
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {task.due_date || "Upcoming"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        task.priority === "urgent"
                          ? "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                          : task.priority === "high"
                          ? "text-purple-400 bg-purple-500/10 border border-purple-500/20"
                          : "text-slate-400 bg-white/5"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </motion.div>
                );
              })
            )}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
