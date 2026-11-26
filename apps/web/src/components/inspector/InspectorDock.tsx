"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderGit2, CheckSquare, BookOpen, Target, ArrowUpRight } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { inspectorSheetVariants } from "@/motion";
import { api } from "@/lib/api";

export function InspectorDock() {
  const { selectedEntity, setSelectedEntity, isInspectorOpen, setInspectorOpen } =
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
    project: <FolderGit2 className="h-4 w-4 text-[#a7f3d0]" />,
    task: <CheckSquare className="h-4 w-4 text-[#38bdf8]" />,
    note: <BookOpen className="h-4 w-4 text-[#fbbf24]" />,
    goal: <Target className="h-4 w-4 text-[#34d399]" />,
  }[type] ?? null;

  const typeBadgeColor = {
    project: "bg-[#a7f3d0]/10 border-[#a7f3d0]/25 text-[#a7f3d0]",
    task: "bg-[#38bdf8]/10 border-[#38bdf8]/25 text-[#38bdf8]",
    note: "bg-[#fbbf24]/10 border-[#fbbf24]/25 text-[#fbbf24]",
    goal: "bg-[#34d399]/10 border-[#34d399]/25 text-[#34d399]",
  }[type] ?? "bg-[#15221e] border-[#202e2b] text-[#9aaba8]";

  const statusOptions = type === "project"
    ? ["planned", "in_progress", "completed", "on_hold"]
    : ["todo", "in_progress", "done"];

  return (
    <AnimatePresence>
      <motion.aside
        variants={inspectorSheetVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="w-80 glass-elevated border-l border-[#202e2b] flex flex-col z-20 shadow-2xl overflow-hidden bg-[#101918]"
      >
        {/* Top Highlight Line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#a7f3d0]/30 to-transparent pointer-events-none" />

        {/* Inspector Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#202e2b]">
          <div className="flex items-center gap-2">
            {typeIcon}
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest border ${typeBadgeColor}`}>
              {type}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#6e807d] font-mono">#{id.slice(0, 7)}</span>
            <button
              onClick={() => {
                setInspectorOpen(false);
                setSelectedEntity(null);
              }}
              className="p-1 rounded text-[#9aaba8] hover:text-[#f1f5f4] hover:bg-[#15221e] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Inspector Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Entity Title */}
          <div>
            <label className="text-[10px] font-mono text-[#6e807d] uppercase tracking-widest block mb-1">
              Title
            </label>
            {isEditing ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-[#0b1312] border border-[#202e2b] focus:border-[#a7f3d0] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#f1f5f4] focus:outline-none"
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
                <span className="text-sm font-semibold text-[#f1f5f4] leading-snug">
                  {data.title || "Untitled Entity"}
                </span>
              </div>
            )}
          </div>

          {/* Status selector */}
          {(type === "task" || type === "project") && (
            <div>
              <label className="text-[10px] font-mono text-[#6e807d] uppercase tracking-widest block mb-1.5">
                Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleStatusChange(opt)}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono capitalize transition-colors ${
                      data.status === opt
                        ? "bg-[#a7f3d0]/15 text-[#a7f3d0] border border-[#a7f3d0]/30 font-medium"
                        : "bg-[#0b1312] text-[#9aaba8] border border-[#202e2b] hover:text-[#f1f5f4]"
                    }`}
                  >
                    {opt.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Priority */}
          {data.priority && (
            <div>
              <label className="text-[10px] font-mono text-[#6e807d] uppercase tracking-widest block mb-1">
                Priority
              </label>
              <span className="text-xs font-mono text-[#f1f5f4] capitalize px-2 py-0.5 rounded bg-[#0b1312] border border-[#202e2b] inline-block">
                {data.priority}
              </span>
            </div>
          )}

          {/* Description / Content preview */}
          {(data.description || data.content) && (
            <div>
              <label className="text-[10px] font-mono text-[#6e807d] uppercase tracking-widest block mb-1">
                Details
              </label>
              <p className="text-xs text-[#9aaba8] leading-relaxed bg-[#0b1312] p-2.5 rounded-lg border border-[#202e2b]">
                {data.description || data.content}
              </p>
            </div>
          )}

          {/* Progress if present */}
          {data.progress !== undefined && (
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#6e807d] uppercase tracking-widest mb-1">
                <span>Progress</span>
                <span className="text-[#a7f3d0]">{data.progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#16221f] overflow-hidden">
                <div
                  className="h-full bg-[#a7f3d0] rounded-full transition-all duration-300"
                  style={{ width: `${data.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
