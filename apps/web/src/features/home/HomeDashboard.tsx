"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  FolderGit2,
  CheckSquare,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Layers,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem, cardHover3D, motionTokens } from "@/motion";

export function HomeDashboard() {
  const { currentWorkspace, setActiveTab, setSelectedEntity, setAiModalOpen } = useWorkspaceStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function loadData() {
      try {
        const [projData, taskData, analyticsData] = await Promise.all([
          api.listProjects(currentWorkspace.id),
          api.listTasks(currentWorkspace.id),
          api.getAnalytics(currentWorkspace.id),
        ]);
        setProjects(projData);
        setTasks(taskData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error("Dashboard data error:", err);
      }
    }
    loadData();
  }, [currentWorkspace?.id]);

  const toggleTask = async (task: any) => {
    const newStatus = task.status === "done" ? "todo" : "done";
    // Optimistic update (Principle 16: Doherty threshold)
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );
    try {
      await api.updateTask(task.id, { status: newStatus });
    } catch {
      // Rollback
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
      );
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Welcome back, Commander <span className="text-xl">✨</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System status operational • {projects.length} active projects in {currentWorkspace?.name || "Cosmos Prime"}
          </p>
        </div>

        <button
          onClick={() => setAiModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] text-xs font-semibold text-white shadow-lg shadow-purple-500/20 hover:opacity-90 transition-opacity flex items-center gap-2 self-start"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>New AI Blueprint</span>
        </button>
      </div>

      {/* Metrics Row (Principle 3: Stagger) */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem} className="p-4 rounded-2xl bg-[#11131A] border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Completed Tasks</span>
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{analytics?.completed_tasks ?? 0}</div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">{analytics?.completion_rate ?? 0}% completed</div>
        </motion.div>

        <motion.div variants={staggerItem} className="p-4 rounded-2xl bg-[#11131A] border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Projects</span>
            <FolderGit2 className="h-4 w-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{projects.length}</div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">In orbit</div>
        </motion.div>

        <motion.div variants={staggerItem} className="p-4 rounded-2xl bg-[#11131A] border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Graph Nodes</span>
            <Layers className="h-4 w-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{analytics?.graph_density_nodes ?? 0}</div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">Spatial elements</div>
        </motion.div>

        <motion.div variants={staggerItem} className="p-4 rounded-2xl bg-[#11131A] border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Knowledge Notes</span>
            <Activity className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{analytics?.total_notes ?? 0}</div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">Cross-referenced</div>
        </motion.div>
      </motion.div>

      {/* Main Grid: Projects & Today's Priorities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Projects Column (2/3 width) */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Active Projects</h2>
            <button
              onClick={() => setActiveTab("projects")}
              className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <motion.div
                key={proj.id}
                whileHover={cardHover3D.hover}
                onClick={() =>
                  setSelectedEntity({
                    type: "project",
                    id: proj.id,
                    data: proj,
                  })
                }
                className="p-4 rounded-2xl bg-[#11131A] border border-white/10 hover:border-[#8B5CF6]/50 cursor-pointer transition-colors shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-purple-400">{proj.priority}</span>
                  <span className="text-[10px] font-mono text-slate-500">{proj.progress}%</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-2 truncate">{proj.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{proj.description}</p>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-4">
                  <div
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] h-full rounded-full"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Priorities Task Checklist (1/3 width) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Priority Tasks</h2>
            <span className="text-xs text-slate-500 font-mono">{tasks.filter((t) => t.status !== "done").length} open</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#11131A] border border-white/10 space-y-2">
            {tasks.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">No active tasks.</div>
            ) : (
              tasks.slice(0, 6).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={task.status === "done"}
                    onChange={() => {}}
                    className="rounded bg-white/10 border-white/20 text-[#8B5CF6] focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs truncate ${
                        task.status === "done" ? "line-through text-slate-500" : "text-slate-200"
                      }`}
                    >
                      {task.title}
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-mono uppercase ${
                      task.priority === "urgent" ? "text-rose-400" : "text-slate-500"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
