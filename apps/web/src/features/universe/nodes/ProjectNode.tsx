"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { FolderGit2, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { ProgressRing } from "@/components/ui/ProgressRing";

export const ProjectNode = memo(({ id, data, selected }: NodeProps) => {
  const setSelectedEntity = useWorkspaceStore((s) => s.setSelectedEntity);
  const projData = data as any;
  const progress = projData.progress ?? 65;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      onClick={() =>
        setSelectedEntity({
          type: "project",
          id: projData.entityId || id,
          data: projData,
        })
      }
      className={`px-4 py-3.5 rounded-2xl glass-standard w-72 cursor-pointer select-none transition-all duration-200 relative group ${
        selected
          ? "border-[#9366FF] ring-2 ring-[#9366FF]/40 shadow-glow-violet"
          : "border-white/[0.12] hover:border-[#9366FF]/50 hover:shadow-glow-violet/30"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-[#9366FF] !border-2 !border-[#070914] shadow-[0_0_8px_#9366FF]"
      />

      {/* Luminous Top specular highlight */}
      <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#9366FF]/50 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-[#9366FF]/20 text-[#9366FF] border border-[#9366FF]/30">
            <FolderGit2 className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest font-semibold">
            PROJECT
          </span>
        </div>
        <ProgressRing progress={progress} size={28} strokeWidth={2.8} />
      </div>

      <div className="text-xs font-semibold text-white truncate group-hover:text-purple-200 transition-colors">
        {projData.title || "Untitled Project"}
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
        <span className="capitalize">{projData.priority || "medium"}</span>
        <span className="text-white font-medium">{progress}%</span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-[#9366FF] !border-2 !border-[#070914] shadow-[0_0_8px_#9366FF]"
      />
    </motion.div>
  );
});

ProjectNode.displayName = "ProjectNode";
