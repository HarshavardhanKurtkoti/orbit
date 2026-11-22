"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  FolderGit2,
  Tag,
  Circle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem, squashStretchVariant } from "@/motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

export function TasksView() {
  const { currentWorkspace, setSelectedEntity } = useWorkspaceStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("medium");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [isCreatingInLane, setIsCreatingInLane] = useState<string | null>(null);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function fetchTasks() {
      try {
        const [taskData, projData] = await Promise.all([
          api.listTasks(currentWorkspace.id),
          api.listProjects(currentWorkspace.id),
        ]);
        setTasks(taskData);
        setProjects(projData);
        if (projData.length > 0) setSelectedProjectId(projData[0].id);
      } catch (err) {
        console.error("Tasks fetch error:", err);
      }
    }
    fetchTasks();
  }, [currentWorkspace?.id]);

  const handleCreateTask = async (e?: React.FormEvent, laneStatus: string = "todo") => {
    if (e) e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const projId = selectedProjectId || (projects[0]?.id ?? "proj_orbital");

    try {
      const created = await api.createTask({
        project_id: projId,
        title: newTaskTitle.trim(),
        priority: selectedPriority,
        status: laneStatus,
        due_date: "Upcoming",
        tags: ["spatial"],
      });
      setTasks([created, ...tasks]);
      setNewTaskTitle("");
      setIsCreatingInLane(null);
    } catch (err) {
      console.error("Create task error:", err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Optimistic UI Update (Principle 16: Doherty threshold)
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));

    try {
      await api.updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const projectMap = React.useMemo(() => {
    return new Map(projects.map((p) => [p.id, p]));
  }, [projects]);

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority === "all") return true;
    return t.priority === filterPriority;
  });

  const columns = [
    {
      id: "todo",
      label: "To Do",
      color: "border-sky-500/40",
      accent: "bg-[#38BDF8]",
      glow: "hover:border-[#38BDF8]/40",
    },
    {
      id: "in_progress",
      label: "In Flight",
      color: "border-purple-500/40",
      accent: "bg-[#9366FF]",
      glow: "hover:border-[#9366FF]/40",
    },
    {
      id: "done",
      label: "Completed",
      color: "border-emerald-500/40",
      accent: "bg-[#34D399]",
      glow: "hover:border-[#34D399]/40",
    },
  ];

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. TOP HEADER & QUICK CREATION BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <CheckSquare className="h-6 w-6 text-[#38BDF8]" />
            Spatial Kanban & Execution Mesh
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status synchronization with the Universe coordinate graph.
          </p>
        </div>

        {/* Priority Filter and Add Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl glass-subtle text-xs border-white/10">
            <Filter className="h-3 w-3 text-slate-400" />
            <span className="text-slate-400 mr-1">Priority:</span>
            {["all", "urgent", "high", "medium"].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2 py-0.5 rounded-lg capitalize text-[11px] transition-colors ${
                  filterPriority === p
                    ? "bg-[#9366FF]/30 text-white font-medium border border-[#9366FF]/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. QUICK TASK CREATION FORM */}
      <GlassPanel elevation="standard" className="p-3.5">
        <form onSubmit={(e) => handleCreateTask(e, "todo")} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Type new operational task title..."
            className="flex-1 w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#9366FF] transition-colors"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Project picker */}
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#101426] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#9366FF] cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>

            {/* Priority picker */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#101426] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#9366FF] cursor-pointer"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <GlassButton
              type="submit"
              variant="primary"
              size="md"
              icon={<Plus className="h-4 w-4" />}
            >
              Add Task
            </GlassButton>
          </div>
        </form>
      </GlassPanel>

      {/* 3. FLOATING GLASS LANES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="space-y-3 flex flex-col">
              {/* Lane Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.accent} shadow-sm`} />
                  <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                    {col.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    {colTasks.length}
                  </span>
                  <button
                    onClick={() => setIsCreatingInLane(col.id)}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Add task to this lane"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Floating Lane Glass Surface */}
              <GlassPanel
                elevation="standard"
                className={`p-3 min-h-[500px] flex-1 flex flex-col space-y-3 transition-colors ${col.glow}`}
              >
                {/* Inline Lane Creation Form */}
                <AnimatePresence>
                  {isCreatingInLane === col.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-2xl glass-elevated border border-white/15 space-y-2 mb-2"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Task title..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#9366FF]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreateTask(undefined, col.id);
                          if (e.key === "Escape") setIsCreatingInLane(null);
                        }}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsCreatingInLane(null)}
                          className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <GlassButton
                          size="sm"
                          variant="primary"
                          onClick={() => handleCreateTask(undefined, col.id)}
                        >
                          Create
                        </GlassButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {colTasks.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-slate-500 font-mono">
                    <p>No tasks in this lane</p>
                    <button
                      onClick={() => setIsCreatingInLane(col.id)}
                      className="mt-2 text-[#38BDF8] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Plus className="h-3 w-3" /> Add one now
                    </button>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const isDone = task.status === "done";
                    const project = projectMap.get(task.project_id);

                    return (
                      <GlassCard
                        key={task.id}
                        elevation="elevated"
                        onClick={() =>
                          setSelectedEntity({
                            type: "task",
                            id: task.id,
                            data: task,
                          })
                        }
                        className="p-3.5 space-y-3 border-white/[0.09] hover:border-white/20 transition-all shadow-md group"
                      >
                        {/* Task Top: Project Badge & Priority */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-purple-300 flex items-center gap-1 truncate max-w-[140px]">
                            <FolderGit2 className="h-3 w-3 text-[#9366FF] flex-shrink-0" />
                            <span className="truncate">{project?.title || "Orbit Prime"}</span>
                          </span>

                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${
                              task.priority === "urgent"
                                ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                                : task.priority === "high"
                                ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                                : "bg-sky-500/15 border-sky-500/30 text-sky-300"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Title with checkbox */}
                        <div className="flex items-start gap-2.5">
                          <button
                            onClick={(e) =>
                              handleStatusChange(
                                task.id,
                                isDone ? "todo" : "done",
                                e
                              )
                            }
                            className="mt-0.5 p-0.5 text-slate-400 hover:text-white transition-colors"
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Circle className="h-4 w-4 text-slate-500 group-hover:text-purple-400" />
                            )}
                          </button>

                          <span
                            className={`text-xs font-semibold leading-relaxed ${
                              isDone ? "line-through text-slate-500" : "text-white"
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        {/* Footer info: Due date & status transition buttons */}
                        <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span>{task.due_date || "Upcoming"}</span>
                          </div>

                          {/* Quick lane transition buttons */}
                          <div className="flex items-center gap-1">
                            {col.id !== "todo" && (
                              <button
                                onClick={(e) => handleStatusChange(task.id, "todo", e)}
                                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                              >
                                Todo
                              </button>
                            )}
                            {col.id !== "in_progress" && (
                              <button
                                onClick={(e) => handleStatusChange(task.id, "in_progress", e)}
                                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                              >
                                Flight
                              </button>
                            )}
                            {col.id !== "done" && (
                              <button
                                onClick={(e) => handleStatusChange(task.id, "done", e)}
                                className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                              >
                                Done
                              </button>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })
                )}
              </GlassPanel>
            </div>
          );
        })}
      </div>
    </div>
  );
}
