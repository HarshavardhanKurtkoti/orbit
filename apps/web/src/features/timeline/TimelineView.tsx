"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, Flag, Clock } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";

export function TimelineView() {
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function load() {
      try {
        const data = await api.listProjects(currentWorkspace.id);
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [currentWorkspace?.id]);

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#8B5CF6]" />
            Timeline & Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-1">Gantt scheduling & milestone progress tracking.</p>
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((proj, idx) => (
          <div key={proj.id} className="p-4 rounded-2xl bg-[#11131A] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">{proj.title}</span>
              <span className="text-[10px] font-mono text-purple-400 uppercase">Phase {idx + 1}</span>
            </div>

            {/* Timeline Bar Track */}
            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] rounded-full transition-all duration-500"
                style={{ width: `${proj.progress || 40}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Progress: {proj.progress || 40}%</span>
              <span>Status: {proj.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
