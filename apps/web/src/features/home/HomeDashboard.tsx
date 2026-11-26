"use client";

import React, { useEffect, useState } from "react";
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
  const { currentWorkspace, setActiveTab, setSelectedEntity, setAiModalOpen } = useWorkspaceStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function loadData() {
      try {
        setLoading(true);
        const [projData, taskData, noteData, analyticsData] = await Promise.all([
          api.listProjects(currentWorkspace.id),
          api.listTasks(currentWorkspace.id),
          api.listNotes(currentWorkspace.id),
          api.getAnalytics(currentWorkspace.id),
        ]);
        setProjects(projData);
        setTasks(taskData);
        setNotes(noteData);
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

    // Doherty threshold: optimistic UI update (<100ms)
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
  const graphNodeCount = analytics?.graph_density_nodes ?? (projects.length + tasks.length + notes.length || 9);

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. EDITORIAL HERO SECTION (harshakurtkoti.in authority) */}
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
              onClick={() => setActiveTab("universe")}
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
            subtitle={`${projects.filter((p) => p.status === "completed").length} delivered`}
            icon={<FolderGit2 className="h-4 w-4" />}
            accentColor="mint"
            onClick={() => setActiveTab("tasks")}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Tasks"
            value={tasks.length}
            subtitle={`${completedCount} completed`}
            icon={<CheckSquare className="h-4 w-4" />}
            accentColor="cyan"
            trend={{ value: `${tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%`, positive: true }}
            onClick={() => setActiveTab("tasks")}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Graph Nodes"
            value={graphNodeCount}
            subtitle={`${analytics?.graph_density_edges ?? 8} connections`}
            icon={<Layers className="h-4 w-4" />}
            accentColor="emerald"
            onClick={() => setActiveTab("universe")}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <MetricCard
            title="Notes"
            value={notes.length}
            subtitle="Specs & decisions"
            icon={<BookOpen className="h-4 w-4" />}
            accentColor="amber"
            onClick={() => setActiveTab("notes")}
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
                onClick={() => setActiveTab("tasks")}
                className="text-[11px] font-mono text-[#9aaba8] hover:text-[#a7f3d0] flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="divide-y divide-[#16221f] mt-1">
              {tasks.slice(0, 5).map((task) => {
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

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                          task.priority === "urgent"
                            ? "text-[#f87171] bg-[#f87171]/10 border border-[#f87171]/20"
                            : task.priority === "high"
                            ? "text-[#fbbf24] bg-[#fbbf24]/10 border border-[#fbbf24]/20"
                            : "text-[#6e807d] bg-[#15221e]"
                        }`}
                      >
                        {task.priority || "medium"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#16221f] flex items-center justify-between text-[11px] font-mono text-[#6e807d]">
            <span>{completedCount} of {tasks.length} tasks completed</span>
            <span className="text-[#a7f3d0]">{tasks.length - completedCount} remaining</span>
          </div>
        </GlassPanel>
      </div>

      {/* 4. ACTIVITY & ROADMAP OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart tasks={tasks} />

        {/* Active Projects List */}
        <GlassPanel elevation="standard" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#202e2b]">
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-[#a7f3d0]" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#f1f5f4] font-medium">
                  Active Projects
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("timeline")}
                className="text-[11px] font-mono text-[#9aaba8] hover:text-[#a7f3d0] flex items-center gap-1 transition-colors"
              >
                <span>Roadmap</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="divide-y divide-[#16221f] mt-1">
              {projects.slice(0, 4).map((proj) => {
                const progress = proj.progress ?? 50;
                return (
                  <div
                    key={proj.id}
                    onClick={() =>
                      setSelectedEntity({
                        type: "project",
                        id: proj.id,
                        data: proj,
                      })
                    }
                    className="py-2.5 flex items-center justify-between gap-3 group cursor-pointer hover:bg-[#15221e]/40 px-2 rounded-lg transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#f1f5f4] group-hover:text-[#a7f3d0] truncate transition-colors">
                        {proj.title}
                      </div>
                      <div className="text-[10px] text-[#6e807d] font-mono truncate mt-0.5">
                        {proj.description || "Project module"}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-16 h-1.5 rounded-full bg-[#16221f] overflow-hidden">
                        <div className="h-full bg-[#a7f3d0] rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-[#9aaba8] w-7 text-right">
                        {progress}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#16221f] flex items-center justify-between text-[11px] font-mono text-[#6e807d]">
            <span>{projects.length} total projects</span>
            <span className="text-[#34d399]">Operational</span>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
