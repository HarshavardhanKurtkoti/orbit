"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Clock, Tag, ArrowUpRight, Trash2, Edit3 } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { inspectorSheetVariants, motionTokens } from "@/motion";
import { api } from "@/lib/api";

export function InspectorDock() {
  const { selectedEntity, setSelectedEntity, isInspectorOpen, setInspectorOpen, currentWorkspace } =
    useWorkspaceStore();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

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

  return (
    <AnimatePresence>
      <motion.aside
        variants={inspectorSheetVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="w-80 border-l border-white/5 bg-[#08090D]/95 backdrop-blur-xl flex flex-col justify-between p-4 z-20 shadow-2xl"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/10 text-slate-300">
                {type}
              </span>
              <span className="text-xs text-slate-500 font-mono">#{id.slice(0, 8)}</span>
            </div>
            {/* Principle 18: Fast Closing */}
            <button
              onClick={() => {
                setInspectorOpen(false);
                setSelectedEntity(null);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Details Body */}
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Title</label>
              <h2 className="text-sm font-semibold text-white mt-1">{data.title || "Untitled Entity"}</h2>
            </div>

            {data.description && (
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Description</label>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{data.description}</p>
              </div>
            )}

            {/* Status selection */}
            {data.status && (
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Status</label>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  {["todo", "in_progress", "done"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                        data.status === st
                          ? "bg-[#8B5CF6] text-white font-medium"
                          : "bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Priority Indicator */}
            {data.priority && (
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Priority</label>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      data.priority === "urgent"
                        ? "bg-rose-500"
                        : data.priority === "high"
                        ? "bg-amber-500"
                        : "bg-sky-500"
                    }`}
                  />
                  <span className="text-xs capitalize text-slate-200">{data.priority}</span>
                </div>
              </div>
            )}

            {/* Tags for Notes */}
            {data.tags && (
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Tags</label>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {data.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-slate-300 border border-white/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">Synchronized with Postgres</span>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
