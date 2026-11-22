"use client";

import React, { useEffect, useState } from "react";
import { CheckSquare, Plus, Clock, AlertCircle } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";

export function TasksView() {
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);
  const setSelectedEntity = useWorkspaceStore((s) => s.setSelectedEntity);
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

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
        console.error(err);
      }
    }
    fetchTasks();
  }, [currentWorkspace?.id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProjectId) return;
    try {
      const created = await api.createTask({
        project_id: selectedProjectId,
        title: newTaskTitle.trim(),
        priority: "medium",
        status: "todo",
      });
      setTasks([created, ...tasks]);
      setNewTaskTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    try {
      await api.updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { id: "todo", label: "To Do", color: "border-sky-500/30" },
    { id: "in_progress", label: "In Progress", color: "border-purple-500/30" },
    { id: "done", label: "Done", color: "border-emerald-500/30" },
  ];

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-[#38BDF8]" />
            Task Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Kanban & status workflow synchronized with spatial universe.</p>
        </div>

        {/* Quick Task Creation Form */}
        <form onSubmit={handleCreateTask} className="flex items-center gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="New task title..."
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-medium text-white flex items-center gap-1 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </form>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-semibold text-slate-300">{col.label}</span>
                <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded bg-white/5">
                  {colTasks.length}
                </span>
              </div>

              <div className={`p-3 rounded-2xl bg-[#11131A] border ${col.color} min-h-[400px] space-y-2.5`}>
                {colTasks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-600">No tasks in this lane</div>
                ) : (
                  colTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() =>
                        setSelectedEntity({
                          type: "task",
                          id: t.id,
                          data: t,
                        })
                      }
                      className="p-3 rounded-xl bg-[#191C26] border border-white/10 hover:border-white/20 cursor-pointer transition-all shadow-sm group"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-medium text-white leading-snug">{t.title}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                        <span
                          className={`text-[9px] font-mono uppercase ${
                            t.priority === "urgent"
                              ? "text-rose-400"
                              : t.priority === "high"
                              ? "text-amber-400"
                              : "text-slate-500"
                          }`}
                        >
                          {t.priority}
                        </span>
                        <div className="flex gap-1">
                          {col.id !== "todo" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(t.id, "todo");
                              }}
                              className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 hover:bg-white/10 text-slate-400"
                            >
                              Todo
                            </button>
                          )}
                          {col.id !== "in_progress" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(t.id, "in_progress");
                              }}
                              className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 hover:bg-white/10 text-slate-400"
                            >
                              In Prog
                            </button>
                          )}
                          {col.id !== "done" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(t.id, "done");
                              }}
                              className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 hover:bg-white/10 text-emerald-400"
                            >
                              Done
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
