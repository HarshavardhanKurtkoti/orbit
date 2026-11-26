"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Plus,
  Clock,
  FolderGit2,
  Circle,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
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

    // Optimistic UI Update (Doherty threshold)
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
      accent: "bg-[#38bdf8]",
    },
    {
      id: "in_progress",
      label: "In Progress",
      accent: "bg-[#a7f3d0]",
    },
    {
      id: "done",
      label: "Completed",
      accent: "bg-[#34d399]",
    },
  ];

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#202e2b]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-[2px] bg-[#a7f3d0] rounded-sm" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#a7f3d0] font-medium">
              02 / Execution Board
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-normal text-[#f1f5f4] font-sans">
            Tasks, <span className="font-serif italic text-[#a7f3d0]">executed.</span>
          </h1>
          <p className="text-xs text-[#9aaba8]">
            Linear-inspired execution board synchronized with your knowledge graph.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs">
            <Filter className="h-3 w-3 text-[#6e807d]" />
            <span className="text-[#6e807d] mr-1 text-[11px] font-mono">Filter:</span>
            {["all", "urgent", "high", "medium", "low"].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2 py-0.5 rounded capitalize text-[10px] font-mono transition-colors ${
                  filterPriority === p
                    ? "bg-[#15221e] text-[#a7f3d0] font-medium border border-[#202e2b]"
                    : "text-[#9aaba8] hover:text-[#f1f5f4]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. QUICK TASK CREATION FORM */}
      <GlassPanel elevation="standard" className="p-3 bg-[#101918]">
        <form onSubmit={(e) => handleCreateTask(e, "todo")} className="flex flex-col sm:flex-row items-center gap-2.5">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 w-full px-3 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs text-[#f1f5f4] placeholder-[#6e807d] focus:outline-none focus:border-[#a7f3d0] transition-colors"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Project picker */}
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs text-[#d6dedc] focus:outline-none focus:border-[#a7f3d0] cursor-pointer"
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
              className="px-2.5 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs text-[#d6dedc] focus:outline-none focus:border-[#a7f3d0] cursor-pointer"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <GlassButton
              type="submit"
              variant="primary"
              size="sm"
              icon={<Plus className="h-3.5 w-3.5" />}
            >
              Add
            </GlassButton>
          </div>
        </form>
      </GlassPanel>

      {/* 3. KANBAN LANES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="space-y-2.5 flex flex-col">
              {/* Lane Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${col.accent}`} />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#d6dedc] font-medium">
                    {col.label}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono text-[#6e807d] px-1.5 py-0.2 rounded bg-[#0b1312] border border-[#202e2b]">
                    {colTasks.length}
                  </span>
                  <button
                    onClick={() => setIsCreatingInLane(col.id)}
                    className="p-1 rounded hover:bg-[#15221e] text-[#6e807d] hover:text-[#f1f5f4] transition-colors"
                    title="Add task to this lane"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Lane Surface */}
              <GlassPanel
                elevation="standard"
                className="p-2.5 min-h-[460px] flex-1 flex flex-col space-y-2.5 bg-[#101918]"
              >
                {/* Inline Creation Form */}
                <AnimatePresence>
                  {isCreatingInLane === col.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-2.5 rounded-lg glass-elevated border border-[#202e2b] bg-[#15221e] space-y-2 mb-1"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Task title..."
                        className="w-full px-2.5 py-1 rounded bg-[#0b1312] border border-[#202e2b] text-xs text-[#f1f5f4] focus:outline-none focus:border-[#a7f3d0]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreateTask(undefined, col.id);
                          if (e.key === "Escape") setIsCreatingInLane(null);
                        }}
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setIsCreatingInLane(null)}
                          className="px-2 py-0.5 text-[10px] font-mono text-[#9aaba8] hover:text-[#f1f5f4]"
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
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-[#6e807d] font-mono">
                    <p>No tasks in lane</p>
                    <button
                      onClick={() => setIsCreatingInLane(col.id)}
                      className="mt-1.5 text-[#a7f3d0] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Plus className="h-3 w-3" /> Add task
                    </button>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const isDone = task.status === "done";
                    const project = projectMap.get(task.project_id);

                    return (
                      <GlassCard
                        key={task.id}
                        elevation="standard"
                        onClick={() =>
                          setSelectedEntity({
                            type: "task",
                            id: task.id,
                            data: task,
                          })
                        }
                        className="p-3 space-y-2.5 border-[#202e2b] hover:border-[#334641] transition-all bg-[#0b1312] group rounded-lg"
                      >
                        {/* Task Top: Project Tag & Priority */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#a7f3d0] flex items-center gap-1 truncate max-w-[130px]">
                            <FolderGit2 className="h-3 w-3 text-[#a7f3d0] flex-shrink-0" />
                            <span className="truncate">{project?.title || "Workspace"}</span>
                          </span>

                          <span
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                              task.priority === "urgent"
                                ? "bg-[#f87171]/10 border-[#f87171]/25 text-[#f87171]"
                                : task.priority === "high"
                                ? "bg-[#fbbf24]/10 border-[#fbbf24]/25 text-[#fbbf24]"
                                : "bg-[#15221e] border-[#202e2b] text-[#9aaba8]"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Title with checkbox */}
                        <div className="flex items-start gap-2">
                          <button
                            onClick={(e) =>
                              handleStatusChange(
                                task.id,
                                isDone ? "todo" : "done",
                                e
                              )
                            }
                            className="mt-0.5 text-[#6e807d] hover:text-[#34d399] transition-colors"
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#34d399]" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-[#6e807d] group-hover:text-[#a7f3d0]" />
                            )}
                          </button>

                          <span
                            className={`text-xs font-medium leading-relaxed ${
                              isDone ? "line-through text-[#6e807d]" : "text-[#f1f5f4]"
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        {/* Footer info: Due date & status transition buttons */}
                        <div className="pt-2 border-t border-[#16221f] flex items-center justify-between text-[10px] font-mono text-[#6e807d]">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{task.due_date || "Upcoming"}</span>
                          </div>

                          {/* Quick lane transition buttons */}
                          <div className="flex items-center gap-1">
                            {col.id !== "todo" && (
                              <button
                                onClick={(e) => handleStatusChange(task.id, "todo", e)}
                                className="px-1.5 py-0.2 rounded bg-[#15221e] hover:bg-[#1c2e29] text-[#9aaba8] hover:text-[#f1f5f4] transition-colors"
                              >
                                Todo
                              </button>
                            )}
                            {col.id !== "in_progress" && (
                              <button
                                onClick={(e) => handleStatusChange(task.id, "in_progress", e)}
                                className="px-1.5 py-0.2 rounded bg-[#15221e] hover:bg-[#1c2e29] text-[#9aaba8] hover:text-[#a7f3d0] transition-colors"
                              >
                                In Progress
                              </button>
                            )}
                            {col.id !== "done" && (
                              <button
                                onClick={(e) => handleStatusChange(task.id, "done", e)}
                                className="px-1.5 py-0.2 rounded bg-[#34d399]/10 hover:bg-[#34d399]/20 text-[#34d399] transition-colors"
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
