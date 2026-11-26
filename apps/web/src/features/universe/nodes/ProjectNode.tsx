"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { FolderGit2 } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { ProgressRing } from "@/components/ui/ProgressRing";

export const ProjectNode = memo(({ id, data, selected }: NodeProps) => {
  const setSelectedEntity = useWorkspaceStore((s) => s.setSelectedEntity);
  const projData = data as any;
  const progress = projData.progress ?? 65;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
      onClick={() =>
        setSelectedEntity({
          type: "project",
          id: projData.entityId || id,
          data: projData,
        })
      }
      className={`px-3.5 py-3 rounded-xl glass-standard w-64 cursor-pointer select-none transition-all duration-150 relative group bg-[#101918] ${
        selected
          ? "border-[#a7f3d0] ring-1 ring-[#a7f3d0]/50"
          : "border-[#202e2b] hover:border-[#a7f3d0]/40"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-[#a7f3d0] !border !border-[#080d10]"
      />

      {/* Top subtle highlight */}
      <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#a7f3d0]/30 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#15221e] text-[#a7f3d0] border border-[#202e2b]">
            <FolderGit2 className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-mono text-[#a7f3d0] uppercase tracking-widest font-medium">
            Project
          </span>
        </div>
        <ProgressRing progress={progress} size={24} strokeWidth={2.5} color="mint" />
      </div>

      <div className="text-xs font-semibold text-[#f1f5f4] truncate group-hover:text-[#a7f3d0] transition-colors">
        {projData.title || "Untitled Project"}
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[#6e807d] pt-1.5 border-t border-[#16221f]">
        <span className="capitalize">{projData.priority || "medium"}</span>
        <span className="text-[#d6dedc] font-medium">{progress}%</span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-[#a7f3d0] !border !border-[#080d10]"
      />
    </motion.div>
  );
});

ProjectNode.displayName = "ProjectNode";
