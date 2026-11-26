"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, FolderGit2, CheckCircle2, Clock } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
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
    <div className="h-full w-full overflow-y-auto px-4 py-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#202e2b]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-[2px] bg-[#a7f3d0] rounded-sm" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#a7f3d0] font-medium">
              04 / Project Roadmap
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-normal text-[#f1f5f4] font-sans">
            Roadmap, <span className="font-serif italic text-[#a7f3d0]">sequenced.</span>
          </h1>
          <p className="text-xs text-[#9aaba8]">
            Milestones, delivery targets, and project stages synchronized to workspace.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#9aaba8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
          <span>Active schedule</span>
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No Active Projects in Roadmap"
          description="Create projects or plan with AI Architect to view sequenced milestones."
        />
      ) : (
        <div className="space-y-3.5">
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
                className="p-4 md:p-5 space-y-3.5 border-[#202e2b] hover:border-[#334641] transition-all bg-[#101918]"
              >
                {/* Milestone Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#15221e] text-[#a7f3d0] border border-[#202e2b]">
                      <FolderGit2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#f1f5f4] group-hover:text-[#a7f3d0] transition-colors">
                          {proj.title}
                        </h3>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#0b1312] text-[#a7f3d0] border border-[#202e2b] uppercase">
                          Phase 0{idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-[#9aaba8] mt-0.5 line-clamp-1">{proj.description}</p>
                    </div>
                  </div>

                  <ProgressRing progress={progress} size={32} strokeWidth={2.8} color="mint" showValue />
                </div>

                {/* Progress Track */}
                <div className="space-y-1.5">
                  <div className="w-full h-2 bg-[#0b1312] rounded-full overflow-hidden p-0.5 border border-[#16221f]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-[#a7f3d0] rounded-full"
                    />
                  </div>

                  {/* Axis Milestone Markers */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#6e807d] pt-0.5">
                    <span>Kickoff</span>
                    <span>Architecture</span>
                    <span>Validation</span>
                    <span className={isCompleted ? "text-[#34d399] font-medium" : ""}>
                      {isCompleted ? "Completed" : "Target Delivery"}
                    </span>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-2 border-t border-[#16221f] flex items-center justify-between text-[10px] font-mono text-[#6e807d]">
                  <div className="flex items-center gap-2">
                    <span className="capitalize px-1.5 py-0.2 rounded bg-[#0b1312] text-[#d6dedc] border border-[#202e2b]">
                      {proj.status.replace("_", " ")}
                    </span>
                    <span className="capitalize">{proj.priority} priority</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#9aaba8]">
                    <Clock className="h-3 w-3 text-[#6e807d]" />
                    <span>In current cycle</span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
