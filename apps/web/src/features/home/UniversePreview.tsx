"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, Sparkles, FolderGit2, CheckSquare, BookOpen, Target, ArrowUpRight, Plus } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassButton } from "@/components/ui/GlassButton";

export function UniversePreview() {
  const { currentWorkspace, setActiveTab, setAiModalOpen } = useWorkspaceStore();
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function loadGraph() {
      try {
        setLoading(true);
        const data = await api.getGraph(currentWorkspace.id);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      } catch (err) {
        console.error("Preview graph error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGraph();
  }, [currentWorkspace?.id]);

  // Compute normalized coordinates for preview canvas (viewBox 0 0 500 260)
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
      const normY = 35 + ((n.position_y - minY) / heightRange) * 190;
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
      className="p-5 flex flex-col justify-between overflow-hidden relative group cursor-pointer border-white/[0.12] hover:border-[#9366FF]/40 transition-all duration-300 shadow-glass-md hover:shadow-glow-violet/20"
      onClick={() => setActiveTab("universe")}
    >
      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#9366FF]/20 text-[#9366FF] border border-[#9366FF]/30">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-tight">Interactive Universe</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-[#38BDF8] border border-cyan-500/20">
                Live Spatial Mesh
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {nodes.length} connected coordinates in orbit
            </p>
          </div>
        </div>

        <button className="flex items-center gap-1 text-xs text-[#38BDF8] font-medium group-hover:translate-x-0.5 transition-transform">
          <span>Enter Universe</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Spatial Visualization Canvas */}
      <div className="relative h-56 w-full my-2 rounded-xl overflow-hidden bg-[#070914]/80 border border-white/5 flex items-center justify-center">
        {/* Subtle concentric orbit rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-80 h-80 rounded-full border border-purple-500/30" />
          <div className="absolute w-52 h-52 rounded-full border border-cyan-400/30" />
          <div className="absolute w-28 h-28 rounded-full border border-white/20" />
        </div>

        {/* Ambient background glow */}
        <div className="absolute w-40 h-40 rounded-full bg-[#9366FF]/15 blur-3xl pointer-events-none" />

        {loading ? (
          <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#9366FF] animate-ping" />
            SYNCHRONIZING COORDINATES...
          </div>
        ) : previewNodes.length === 0 ? (
          <div className="text-center p-4 z-10" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs text-slate-400 mb-3">No nodes materialized in current workspace</p>
            <div className="flex items-center justify-center gap-2">
              <GlassButton
                variant="primary"
                size="sm"
                icon={<Sparkles className="h-3.5 w-3.5" />}
                onClick={() => setAiModalOpen(true)}
              >
                Generate Universe
              </GlassButton>
            </div>
          </div>
        ) : (
          <svg className="w-full h-full" viewBox="0 0 500 260">
            <defs>
              <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9366FF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Connecting Edges */}
            {previewEdges.map((e: any) => (
              <line
                key={e.id}
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                stroke="url(#edgeGradient)"
                strokeWidth={1.5}
                strokeDasharray={e.animated ? "4 4" : "none"}
                className={e.animated ? "animate-[dash_20s_linear_infinite]" : ""}
              />
            ))}

            {/* Nodes */}
            {previewNodes.map((n) => {
              const isGoal = n.entity_type === "goal";
              const isProj = n.entity_type === "project";
              const isTask = n.entity_type === "task";
              const isNote = n.entity_type === "note";

              const color = isGoal
                ? "#34D399"
                : isProj
                ? "#9366FF"
                : isTask
                ? "#38BDF8"
                : "#FBBF24";

              const radius = isGoal ? 9 : isProj ? 7.5 : 6;

              return (
                <g
                  key={n.id}
                  onMouseEnter={() => setHoveredNode(n)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer transition-all duration-150"
                >
                  {/* Outer pulse aura */}
                  <circle
                    cx={n.normX}
                    cy={n.normY}
                    r={radius + 4}
                    fill={color}
                    fillOpacity={0.18}
                  />

                  {/* Core Node */}
                  <circle
                    cx={n.normX}
                    cy={n.normY}
                    r={radius}
                    fill={color}
                    stroke="#070914"
                    strokeWidth={1.5}
                    className="hover:scale-125 transition-transform"
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* Hover Tooltip Overlay */}
        {hoveredNode && (
          <div className="absolute bottom-3 left-4 right-4 pointer-events-none flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#101426]/90 border border-white/15 backdrop-blur-md text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9366FF]" />
              <span className="font-medium text-white truncate">
                {hoveredNode.metadata?.title || "Entity"}
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase text-purple-300 ml-2">
              {hoveredNode.entity_type}
            </span>
          </div>
        )}
      </div>

      {/* Footer Pill */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
        <span>Click anywhere to explore spatial canvas</span>
        <span className="text-[#9366FF] flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> Real-time Force Layout
        </span>
      </div>
    </GlassPanel>
  );
}
