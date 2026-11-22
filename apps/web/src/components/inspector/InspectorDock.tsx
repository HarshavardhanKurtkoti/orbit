"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Clock, Tag, ArrowUpRight, Trash2, Edit3, FolderGit2, CheckSquare, BookOpen, Target } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { inspectorSheetVariants, motionTokens } from "@/motion";
import { api } from "@/lib/api";
import { GlassButton } from "@/components/ui/GlassButton";

export function InspectorDock() {
  const { selectedEntity, setSelectedEntity, isInspectorOpen, setInspectorOpen, currentWorkspace } =
    useWorkspaceStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  if (!isInspectorOpen || !selectedEntity) return null;

  const { type, id, data } = selectedEntity;

  const handleStatusChange = async (newStatus: string) => {
    try {
      if (type === "task") {
        await api.updateTask(id, { status: newStatus });
        data.status = newStatus;
      } else if (type === "project") {
        await api.updateProject(id, { status: newStatus });
        data.status = newStatus;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const typeIcon = {
    project: <FolderGit2 className="h-4 w-4 text-[#9366FF]" />,
    task: <CheckSquare className="h-4 w-4 text-[#38BDF8]" />,
    note: <BookOpen className="h-4 w-4 text-amber-400" />,
    goal: <Target className="h-4 w-4 text-emerald-400" />,
  }[type] ?? null;

  const typeBadgeColor = {
    project: "bg-purple-500/15 border-purple-500/30 text-purple-300",
    task: "bg-sky-500/15 border-sky-500/30 text-sky-300",
    note: "bg-amber-500/15 border-amber-500/30 text-amber-300",
    goal: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
  }[type] ?? "bg-white/5 border-white/10 text-slate-300";

  const statusOptions = type === "project"
    ? ["planned", "in_progress", "completed", "on_hold"]
    : ["todo", "in_progress", "done"];

  const priorityColorMap: Record<string, string> = {
    urgent: "bg-rose-500/15 border-rose-500/30 text-rose-300",
    high: "bg-orange-500/15 border-orange-500/30 text-orange-300",
    medium: "bg-sky-500/15 border-sky-500/30 text-sky-300",
    low: "bg-slate-500/15 border-slate-500/20 text-slate-400",
  };
  const priorityColor = priorityColorMap[data.priority as string] ?? "bg-white/5 border-white/10 text-slate-400";

  return (
    <AnimatePresence>
      <motion.aside
        variants={inspectorSheetVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="w-80 glass-elevated border-l border-white/[0.10] flex flex-col z-20 shadow-2xl overflow-hidden"
      >
        {/* Luminous Top Border */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#9366FF]/40 to-transparent pointer-events-none" />

        {/* Inspector Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              {typeIcon}
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border ${typeBadgeColor}`}>
                {type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-slate-500 font-mono">#{id.slice(0, 7)}</span>
            {/* Principle 18: Fast Closing */}
            <button
              onClick={() => {
                setInspectorOpen(false);
                setSelectedEntity(null);
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Inspector Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Entity Title */}
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5">
              Title
            </label>
            {isEditing ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-white/5 border border-[#9366FF]/40 rounded-xl px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:border-[#9366FF]"
                onBlur={() => setIsEditing(false)}
              />
            ) : (
              <div
                className="group flex items-start gap-2 cursor-pointer"
                onClick={() => {
                  setEditTitle(data.title || "Untitled");
                  setIsEditing(true);
                }}
              >
                <h2 className="text-sm font-bold text-white leading-snug flex-1">
                  {data.title || "Untitled Entity"}
                </h2>
                <Edit3 className="h-3.5 w-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0" />
              </div>
            )}
          </div>

          {/* Description */}
          {data.description && (
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5">
                Description
              </label>
              <p className="text-xs text-slate-300 leading-relaxed">{data.description}</p>
            </div>
          )}

          {/* Status Selector */}
          {data.status !== undefined && (
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {statusOptions.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-3 py-1 rounded-xl text-xs capitalize transition-all ${
                      data.status === st
                        ? "bg-[#9366FF] text-white font-semibold shadow-glow-violet border border-[#9366FF]"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/10"
                    }`}
                  >
                    {st.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Priority Indicator */}
          {data.priority && (
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5">
                Priority
              </label>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-semibold capitalize ${priorityColor}`}>
                <span className={`w-2 h-2 rounded-full ${
                  data.priority === "urgent" ? "bg-rose-500" :
                  data.priority === "high" ? "bg-orange-400" :
                  data.priority === "medium" ? "bg-sky-400" : "bg-slate-400"
                }`} />
                {data.priority}
              </div>
            </div>
          )}

          {/* Progress Ring for projects/goals */}
          {data.progress !== undefined && (
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
                Progress
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                    <circle
                      cx="28" cy="28" r="22" fill="none"
                      stroke="url(#inspectorGrad)" strokeWidth="5"
                      strokeDasharray={`${2 * Math.PI * 22}`}
                      strokeDashoffset={`${2 * Math.PI * 22 * (1 - (data.progress || 0) / 100)}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="inspectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9366FF" />
                        <stop offset="100%" stopColor="#38BDF8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white rotate-90">
                    {data.progress}%
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{data.progress}% Done</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {data.progress < 50 ? "Early stage" : data.progress < 80 ? "In progress" : "Near completion"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tags for Notes */}
          {data.tags && data.tags.length > 0 && (
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {data.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/25 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Due Date */}
          {data.due_date && (
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5">
                Due Date
              </label>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <Clock className="h-3.5 w-3.5 text-[#38BDF8]" />
                <span>{data.due_date}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Synced to Postgres
          </span>
          <button
            onClick={() => {
              setInspectorOpen(false);
              setSelectedEntity(null);
            }}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-mono flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" /> Dismiss
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
