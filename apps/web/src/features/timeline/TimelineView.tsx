"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Flag, Clock, FolderGit2, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { EmptyState } from "@/components/ui/EmptyState";

export function TimelineView() {
  const { currentWorkspace, setSelectedEntity } = useWorkspaceStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function load() {
      try {
        setLoading(true);
        const data = await api.listProjects(currentWorkspace.id);
        setProjects(data);
      } catch (err) {
        console.error("Timeline error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentWorkspace?.id]);

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-6 md:p-8 space-y-7 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <CalendarDays className="h-6 w-6 text-[#9366FF]" />
            Timeline & Spatial Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gantt milestones, flight trajectory, and project progress synchronized to workspace.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span>Active Orbit Schedule</span>
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No Active Projects in Timeline"
          description="Create projects or generate a roadmap with AI Architect to view execution phases."
        />
      ) : (
        <div className="space-y-4">
          {projects.map((proj, idx) => {
            const progress = proj.progress ?? 45;
            const isCompleted = proj.status === "completed" || progress === 100;

            return (
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
                className="p-5 space-y-4 border-white/[0.10] hover:border-[#9366FF]/40 transition-all shadow-glass-md"
              >
                {/* Milestone Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/15 text-[#9366FF] border border-purple-500/25">
                      <FolderGit2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                          {proj.title}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-purple-300 border border-white/10 uppercase">
                          Phase 0{idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{proj.description}</p>
                    </div>
                  </div>

                  <ProgressRing progress={progress} size={38} strokeWidth={3.5} showValue />
                </div>

                {/* Gantt Progress Track */}
                <div className="space-y-1.5">
                  <div className="w-full h-3 bg-white/[0.04] rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-gradient-to-r from-[#9366FF] via-[#38BDF8] to-[#22D3EE] rounded-full relative"
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/80 rounded-full blur-[1px]" />
                    </motion.div>
                  </div>

                  {/* Axis Milestone Markers */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>Kickoff</span>
                    <span>Q1 Synthesis</span>
                    <span>Q2 Orbit</span>
                    <span className={isCompleted ? "text-emerald-400 font-semibold" : ""}>
                      {isCompleted ? "Completed" : "Target Delivery"}
                    </span>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="capitalize px-2 py-0.5 rounded bg-white/5 text-slate-300">
                      {proj.status.replace("_", " ")}
                    </span>
                    <span className="capitalize">{proj.priority} Priority</span>
                  </div>
                  <span className="text-slate-500 flex items-center gap-1 group-hover:text-white transition-colors">
                    Inspect details <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
