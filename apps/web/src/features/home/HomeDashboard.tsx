"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Compass,
  Sparkles,
  FolderGit2,
  CheckSquare,
  BookOpen,
  ArrowRight,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Layers,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { MetricCard } from "@/components/ui/MetricCard";
import { UniversePreview } from "./UniversePreview";
import { ActivityChart } from "./ActivityChart";

export function HomeDashboard() {
  const router = useRouter();
  const {
    currentWorkspace,
    projects,
    tasks,
    notes,
    analytics,
    isDataLoaded,
    isSyncing,
    loadWorkspaceData,
    updateTaskOptimistic,
    setSelectedEntity,
    setAiModalOpen,
  } = useWorkspaceStore();

  useEffect(() => {
    if (currentWorkspace?.id && !isDataLoaded && !isSyncing) {
      loadWorkspaceData(currentWorkspace.id);
    }
  }, [currentWorkspace?.id, isDataLoaded, isSyncing, loadWorkspaceData]);

  const toggleTask = async (task: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === "done" ? "todo" : "done";

    // Instant optimistic update (Doherty threshold < 100ms)
    updateTaskOptimistic(task.id, { status: newStatus });

    try {
      await api.updateTask(task.id, { status: newStatus });
    } catch {
      // Rollback on error
      updateTaskOptimistic(task.id, { status: task.status });
    }
  };

  const completedCount = tasks.filter((t: any) => t.status === "done").length;
  const graphNodeCount =
    analytics?.graph_density_nodes ?? (projects.length + tasks.length + notes.length || 9);

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. EDITORIAL HERO SECTION */}
      <div className="border border-[#202e2b] bg-[#101918] rounded-xl p-6 md:p-8 relative overflow-hidden">
        {/* Subtle background coordinate grid */}
        <div className="absolute inset-0 spatial-canvas-grid pointer-events-none opacity-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl space-y-3">
            {/* Kicker with mint signal rule */}
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-[2px] bg-[#a7f3d0] rounded-sm" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#a7f3d0] font-medium">
                01 / Workspace Overview
              </span>
            </div>

            {/* Editorial Heading */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight text-[#f1f5f4] font-sans">
              Ideas, <span className="font-serif italic text-[#a7f3d0]">connected.</span>
            </h1>

            <p className="text-xs md:text-sm text-[#9aaba8] leading-relaxed">
              Organize your projects, connect knowledge nodes, and turn architectural blueprints into execution across{" "}
              <span className="text-[#f1f5f4] font-medium">{currentWorkspace?.name || "Personal workspace"}</span>.
            </p>
          </div>

          {/* Primary Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <GlassButton
              variant="primary"
              size="md"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              onClick={() => setAiModalOpen(true)}
            >
              Plan project
            </GlassButton>
            <GlassButton
              variant="secondary"
              size="md"
              icon={<Compass className="h-3.5 w-3.5" />}
              onClick={() => router.push("/universe")}
            >
              Explore universe
            </GlassButton>
          </div>
        </div>
      </div>

      {/* 2. CORE METRICS STRIP */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-3.5"
      >
        <motion.div variants={staggerItem}>
          <MetricCard
            title="Projects"
            value={projects.length}
            subtitle={`${projects.filter((p: any) => p.status === "completed").length} delivered`}
            icon={<FolderGit2 className="h-4 w-4" />}
            accentColor="mint"
            onClick={() => router.push("/tasks")}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Tasks"
            value={tasks.length}
            subtitle={`${completedCount} completed`}
            icon={<CheckSquare className="h-4 w-4" />}
            accentColor="cyan"
            trend={{
              value: `${tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%`,
              positive: true,
            }}
            onClick={() => router.push("/tasks")}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Graph Nodes"
            value={graphNodeCount}
            subtitle={`${analytics?.graph_density_edges ?? 8} connections`}
            icon={<Layers className="h-4 w-4" />}
            accentColor="emerald"
            onClick={() => router.push("/universe")}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Notes"
            value={notes.length}
            subtitle="Specs & decisions"
            icon={<BookOpen className="h-4 w-4" />}
            accentColor="amber"
            onClick={() => router.push("/notes")}
          />
        </motion.div>
      </motion.div>

      {/* 3. TWO-COLUMN SPLIT: Universe Preview & Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Knowledge Universe Preview */}
        <UniversePreview />

        {/* Right: Active Priority Tasks */}
        <GlassPanel elevation="standard" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#202e2b]">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-[#38bdf8]" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#f1f5f4] font-medium">
                  Priority Tasks
                </h3>
              </div>
              <button
                onClick={() => router.push("/tasks")}
                className="text-[11px] font-mono text-[#9aaba8] hover:text-[#a7f3d0] flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="divide-y divide-[#16221f] mt-1">
              {tasks.slice(0, 5).map((task: any) => {
                const isDone = task.status === "done";
                return (
                  <div
                    key={task.id}
                    onClick={() =>
                      setSelectedEntity({
                        type: "task",
                        id: task.id,
                        data: task,
                      })
                    }
                    className="py-2.5 flex items-center justify-between gap-3 group cursor-pointer hover:bg-[#15221e]/40 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={(e) => toggleTask(task, e)}
                        className={`text-[#6e807d] hover:text-[#34d399] transition-colors p-0.5 ${
                          isDone ? "text-[#34d399]" : ""
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      </button>
                      <span
                        className={`text-xs truncate ${
                          isDone ? "line-through text-[#6e807d]" : "text-[#f1f5f4] group-hover:text-[#a7f3d0]"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#6e807d] flex-shrink-0">
                      <Clock className="h-3 w-3 text-[#6e807d]" />
                      <span>{task.due_date || "Upcoming"}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded border uppercase text-[9px] ${
                          task.priority === "urgent"
                            ? "border-[#f87171]/30 text-[#f87171] bg-[#f87171]/10"
                            : task.priority === "high"
                            ? "border-[#fbbf24]/30 text-[#fbbf24] bg-[#fbbf24]/10"
                            : "border-[#202e2b] text-[#9aaba8] bg-[#15221e]"
                        }`}
                      >
                        {task.priority || "med"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#16221f] flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#6e807d]">
              {completedCount} of {tasks.length} tasks resolved
            </span>
            <button
              onClick={() => router.push("/tasks")}
              className="text-xs text-[#a7f3d0] hover:underline flex items-center gap-1 font-medium"
            >
              <Plus className="h-3 w-3" />
              <span>Add task</span>
            </button>
          </div>
        </GlassPanel>
      </div>

      {/* 4. ACTIVITY & VELOCITY VISUALIZER */}
      <ActivityChart tasks={tasks} />

      {/* 5. ACTIVE PROJECTS SHOWCASE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-[#a7f3d0]" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#f1f5f4] font-medium">
              Active Projects
            </h2>
          </div>
          <button
            onClick={() => router.push("/tasks")}
            className="text-[11px] font-mono text-[#9aaba8] hover:text-[#a7f3d0] flex items-center gap-1 transition-colors"
          >
            <span>Roadmap overview</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.slice(0, 3).map((proj: any) => (
            <GlassCard
              key={proj.id}
              elevation="subtle"
              onClick={() =>
                setSelectedEntity({
                  type: "project",
                  id: proj.id,
                  data: proj,
                })
              }
              className="p-4 space-y-3 border-[#202e2b] hover:border-[#334641] transition-colors"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-[#15221e] border border-[#202e2b] text-[#9aaba8]">
                  {proj.status || "In Progress"}
                </span>
                <span className="text-xs font-mono text-[#a7f3d0] font-medium">
                  {proj.progress ?? 50}%
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#f1f5f4] tracking-tight">{proj.title}</h3>
                <p className="text-xs text-[#9aaba8] line-clamp-2 mt-1 leading-relaxed">
                  {proj.description || "Synthesizing spatial project deliverables."}
                </p>
              </div>

              {/* Progress bar */}
              <div className="h-1 w-full bg-[#16221f] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#a7f3d0] rounded-full transition-all duration-500"
                  style={{ width: `${proj.progress ?? 50}%` }}
                />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
