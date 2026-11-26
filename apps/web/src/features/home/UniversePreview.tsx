"use client";

import React, { useState, useEffect } from "react";
import { Compass, ArrowRight } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function UniversePreview() {
  const { currentWorkspace, setActiveTab } = useWorkspaceStore();
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function loadGraph() {
      try {
        const data = await api.getGraph(currentWorkspace.id);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      } catch (err) {
        console.error("Preview graph error:", err);
      }
    }
    loadGraph();
  }, [currentWorkspace?.id]);

  // Compute normalized coordinates for preview canvas (viewBox 0 0 500 240)
  const previewNodes = React.useMemo(() => {
    if (nodes.length === 0) return [];
    const minX = Math.min(...nodes.map((n) => n.position_x ?? 0));
    const maxX = Math.max(...nodes.map((n) => n.position_x ?? 500));
    const minY = Math.min(...nodes.map((n) => n.position_y ?? 0));
    const maxY = Math.max(...nodes.map((n) => n.position_y ?? 300));

    const widthRange = maxX - minX || 1;
    const heightRange = maxY - minY || 1;

    return nodes.slice(0, 10).map((n) => {
      const normX = 40 + ((n.position_x - minX) / widthRange) * 420;
      const normY = 30 + ((n.position_y - minY) / heightRange) * 170;
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
      .map((e) => {
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

  return (
    <GlassPanel
      elevation="standard"
      className="p-5 flex flex-col justify-between overflow-hidden relative group cursor-pointer border-[#202e2b] hover:border-[#a7f3d0]/35 transition-all duration-200"
      onClick={() => setActiveTab("universe")}
    >
      {/* Header */}
      <div className="flex items-center justify-between z-10 pb-2 border-b border-[#202e2b]">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[#a7f3d0]" />
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#f1f5f4] font-medium">
              Knowledge Universe
            </h3>
            <p className="text-[11px] text-[#6e807d] font-mono">
              {nodes.length} connected coordinates in spatial graph
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("universe");
          }}
          className="text-[11px] font-mono text-[#9aaba8] hover:text-[#a7f3d0] flex items-center gap-1 transition-colors"
        >
          <span>Open canvas</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Systems Architecture Preview Display (harshakurtkoti.in Systems in Motion style) */}
      <div className="relative my-3 h-[180px] w-full rounded-lg bg-[#0b1312] border border-[#16221f] overflow-hidden flex items-center justify-center">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 spatial-canvas-grid opacity-35" />

        <svg className="w-full h-full" viewBox="0 0 500 240">
          <defs>
            <linearGradient id="edgeLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#202e2b" />
              <stop offset="50%" stopColor="#334641" />
              <stop offset="100%" stopColor="#202e2b" />
            </linearGradient>
          </defs>

          {/* Edges */}
          {previewEdges.map((e: any) => (
            <line
              key={e.id}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="#2a3d38"
              strokeWidth="1.2"
              strokeDasharray={e.animated ? "4 3" : undefined}
            />
          ))}

          {/* Nodes */}
          {previewNodes.map((n) => {
            const isProject = n.entity_type === "project";
            const isTask = n.entity_type === "task";
            const isNote = n.entity_type === "note";
            const color = isProject ? "#a7f3d0" : isTask ? "#38bdf8" : isNote ? "#fbbf24" : "#34d399";

            return (
              <g key={n.id} className="transition-transform duration-200">
                <circle
                  cx={n.normX}
                  cy={n.normY}
                  r={isProject ? 6 : 4.5}
                  fill="#101918"
                  stroke={color}
                  strokeWidth={1.5}
                />
                <text
                  x={n.normX + 9}
                  y={n.normY + 3}
                  fill="#9aaba8"
                  fontSize="8"
                  fontFamily="monospace"
                  className="pointer-events-none select-none"
                >
                  {n.title?.slice(0, 14) || "Node"}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-2 left-2 flex items-center gap-3 text-[9px] font-mono text-[#6e807d]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a7f3d0]" /> Project
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" /> Task
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" /> Note
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-[#6e807d]">
        <span>Spatial relational graph</span>
        <span className="text-[#a7f3d0]">Interactive ✦</span>
      </div>
    </GlassPanel>
  );
}
