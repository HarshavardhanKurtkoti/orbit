"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Compass, ArrowRight } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function UniversePreview() {
  const router = useRouter();
  const { graphNodes, graphEdges, isSyncing } = useWorkspaceStore();

  const nodes = graphNodes || [];
  const edges = graphEdges || [];

  // Compute normalized coordinates for preview canvas (viewBox 0 0 500 240)
  const previewNodes = React.useMemo(() => {
    if (nodes.length === 0) return [];
    const minX = Math.min(...nodes.map((n: any) => n.position_x ?? 0));
    const maxX = Math.max(...nodes.map((n: any) => n.position_x ?? 500));
    const minY = Math.min(...nodes.map((n: any) => n.position_y ?? 0));
    const maxY = Math.max(...nodes.map((n: any) => n.position_y ?? 300));

    const widthRange = maxX - minX || 1;
    const heightRange = maxY - minY || 1;

    return nodes.slice(0, 10).map((n: any) => {
      const normX = 40 + (((n.position_x ?? 200) - minX) / widthRange) * 420;
      const normY = 30 + (((n.position_y ?? 100) - minY) / heightRange) * 170;
      return {
        ...n,
        normX,
        normY,
      };
    });
  }, [nodes]);

  // Map edges to coordinate pairs
  const previewEdges = React.useMemo(() => {
    const nodeMap = new Map(previewNodes.map((n) => [n.id, n]));
    return edges
      .map((e: any) => {
        const source = nodeMap.get(e.source_node_id);
        const target = nodeMap.get(e.target_node_id);
        if (!source || !target) return null;
        return {
          id: e.id,
          x1: source.normX,
          y1: source.normY,
          x2: target.normX,
          y2: target.normY,
          animated: e.relationship_type === "depends_on",
        };
      })
      .filter(Boolean);
  }, [previewNodes, edges]);

  const handleNavigate = () => {
    router.push("/universe");
  };

  return (
    <GlassPanel
      elevation="standard"
      className="p-5 flex flex-col justify-between overflow-hidden relative group cursor-pointer border-[#202e2b] hover:border-[#a7f3d0]/35 transition-all duration-200"
      onClick={handleNavigate}
    >
      {/* Header */}
      <div className="flex items-center justify-between z-10 pb-2 border-b border-[#202e2b]">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[#a7f3d0]" />
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#f1f5f4] font-medium flex items-center gap-2">
              <span>Knowledge Universe</span>
              {isSyncing && <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />}
            </h3>
            <p className="text-[11px] text-[#6e807d] font-mono">
              {nodes.length} connected coordinates in spatial graph
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
          className="text-[11px] font-mono text-[#9aaba8] hover:text-[#a7f3d0] flex items-center gap-1 transition-colors"
        >
          <span>Open canvas</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Interactive Micro SVG Preview */}
      <div className="my-4 h-44 w-full relative rounded-lg border border-[#16221f] bg-[#0b1312] overflow-hidden flex items-center justify-center">
        {/* Subtle coordinate dot grid */}
        <div className="absolute inset-0 spatial-canvas-grid opacity-30" />

        <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="orbitEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#202e2b" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Render connecting edges */}
          {previewEdges.map((edge: any) => (
            <line
              key={edge.id}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="#2a3d38"
              strokeWidth="1.5"
              strokeDasharray={edge.animated ? "4 4" : undefined}
              className={edge.animated ? "animate-pulse" : ""}
            />
          ))}

          {/* Render miniature nodes */}
          {previewNodes.map((n: any) => {
            const isGoal = n.entity_type === "goal";
            const isProject = n.entity_type === "project";
            const isTask = n.entity_type === "task";

            const fill = isGoal
              ? "#34d399"
              : isProject
              ? "#a7f3d0"
              : isTask
              ? "#38bdf8"
              : "#fbbf24";

            return (
              <g key={n.id} className="transition-transform group-hover:scale-105 duration-300">
                <circle
                  cx={n.normX}
                  cy={n.normY}
                  r="12"
                  fill="#101918"
                  stroke={fill}
                  strokeWidth="1.5"
                  className="shadow-sm"
                />
                <circle cx={n.normX} cy={n.normY} r="3" fill={fill} />
                <text
                  x={n.normX}
                  y={n.normY + 22}
                  textAnchor="middle"
                  fill="#9aaba8"
                  fontSize="9"
                  fontFamily="monospace"
                  className="select-none pointer-events-none"
                >
                  {((n.metadata?.title || n.title || "Entity") as string).slice(0, 14)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Ambient bottom gradient vignette */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0b1312] to-transparent pointer-events-none" />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#6e807d] pt-2 border-t border-[#16221f]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
          <span>visionOS spatial physics</span>
        </div>
        <span className="group-hover:text-[#a7f3d0] transition-colors">
          Click to enter 60fps graph &rarr;
        </span>
      </div>
    </GlassPanel>
  );
}
