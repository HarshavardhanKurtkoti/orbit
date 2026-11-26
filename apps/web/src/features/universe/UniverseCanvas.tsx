"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  Connection,
  addEdge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ProjectNode } from "./nodes/ProjectNode";
import { TaskNode } from "./nodes/TaskNode";
import { NoteNode } from "./nodes/NoteNode";
import { GoalNode } from "./nodes/GoalNode";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import {
  FolderGit2,
  CheckSquare,
  BookOpen,
  Target,
  Sparkles,
  RefreshCw,
  Compass,
  AlertCircle,
  Filter,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassButton } from "@/components/ui/GlassButton";
import { EmptyState } from "@/components/ui/EmptyState";

interface UniverseCanvasProps {
  viewMode?: "spatial" | "tree";
}

export function UniverseCanvas({ viewMode = "spatial" }: UniverseCanvasProps) {
  const { currentWorkspace, setSelectedEntity, setAiModalOpen } = useWorkspaceStore();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [isInteractive, setIsInteractive] = useState(true);

  const nodeTypes = useMemo(
    () => ({
      project: ProjectNode,
      task: TaskNode,
      note: NoteNode,
      goal: GoalNode,
    }),
    []
  );

  const fetchGraph = useCallback(async () => {
    const wsId = currentWorkspace?.id || "ws_prime";
    try {
      setLoading(true);
      setError(null);
      const graph = await api.getGraph(wsId);
      const mappedNodes: Node[] = (graph.nodes || []).map((n: any) => ({
        id: n.id,
        type: n.entity_type,
        position: { x: n.position_x, y: n.position_y },
        data: {
          ...n.metadata,
          title: n.metadata?.title || n.title || "Untitled Entity",
          progress: n.metadata?.progress ?? n.progress ?? 50,
          priority: n.metadata?.priority || n.priority || "medium",
          status: n.metadata?.status || n.status || "todo",
          entityId: n.entity_id || n.id,
          workspaceId: n.workspace_id || wsId,
        },
      }));

      const mappedEdges: Edge[] = (graph.edges || []).map((e: any) => ({
        id: e.id,
        source: e.source_node_id,
        target: e.target_node_id,
        animated: e.relationship_type === "depends_on",
        style: {
          stroke: e.relationship_type === "depends_on" ? "#a7f3d0" : "#2a3d38",
          strokeWidth: 1.5,
          opacity: 0.85,
        },
      }));

      setNodes(mappedNodes);
      setEdges(mappedEdges);
    } catch (err: any) {
      console.error("Failed to load universe graph:", err);
      setError("Unable to synchronize coordinates with the workspace API.");
    } finally {
      setLoading(false);
    }
  }, [currentWorkspace?.id]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    async (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
      const wsId = currentWorkspace?.id || "ws_prime";
      if (connection.source && connection.target) {
        try {
          await api.createGraphEdge(wsId, {
            source_node_id: connection.source,
            target_node_id: connection.target,
            relationship_type: "relates_to",
          });
        } catch (err) {
          console.error("Failed to persist edge:", err);
        }
      }
    },
    [currentWorkspace?.id]
  );

  const onNodeDragStop = useCallback(
    async (_event: unknown, node: Node) => {
      const wsId = currentWorkspace?.id || "ws_prime";
      try {
        await api.updateGraphLayout(wsId, [
          {
            id: node.id,
            position_x: node.position.x,
            position_y: node.position.y,
          },
        ]);
      } catch (err) {
        console.error("Failed to persist node position:", err);
      }
    },
    [currentWorkspace?.id]
  );

  const displayedNodes = useMemo(() => {
    if (filterType === "all") return nodes;
    return nodes.filter((n) => n.type === filterType);
  }, [nodes, filterType]);

  // Loading State
  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-[#080d10] relative">
        <GlassPanel elevation="elevated" className="p-6 flex flex-col items-center gap-3 text-center max-w-xs border-[#202e2b]">
          <div className="h-10 w-10 rounded-xl bg-[#15221e] border border-[#202e2b] flex items-center justify-center text-[#a7f3d0]">
            <Compass className="h-5 w-5 animate-spin" style={{ animationDuration: "8s" }} />
          </div>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#f1f5f4] font-medium">
              Loading Workspace Graph
            </h3>
            <p className="text-[11px] text-[#6e807d] font-mono mt-0.5">
              Calibrating spatial coordinates...
            </p>
          </div>
        </GlassPanel>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 bg-[#080d10]">
        <GlassPanel elevation="elevated" className="p-6 max-w-sm text-center flex flex-col items-center gap-3 border-[#f87171]/30">
          <div className="p-2.5 rounded-xl bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f1f5f4]">Connection Interrupted</h3>
            <p className="text-xs text-[#9aaba8] mt-1">{error}</p>
          </div>
          <GlassButton
            variant="primary"
            size="sm"
            icon={<RefreshCw className="h-3 w-3" />}
            onClick={fetchGraph}
          >
            Retry
          </GlassButton>
        </GlassPanel>
      </div>
    );
  }

  // Accessible Tree View Alternative (WCAG 2.2 AA)
  if (viewMode === "tree") {
    return (
      <div className="h-full w-full overflow-y-auto p-6 md:p-8 space-y-5 max-w-4xl mx-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#202e2b]">
          <div>
            <h1 className="text-lg font-semibold text-[#f1f5f4] flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#a7f3d0]" />
              Spatial Entity Hierarchy (Tree View)
            </h1>
            <p className="text-xs text-[#9aaba8] mt-0.5 font-mono">
              Semantic list of all workspace entities and dependencies.
            </p>
          </div>

          <GlassButton
            variant="primary"
            size="sm"
            icon={<Sparkles className="h-3.5 w-3.5" />}
            onClick={() => setAiModalOpen(true)}
          >
            Plan project
          </GlassButton>
        </div>

        {nodes.length === 0 ? (
          <EmptyState
            title="Empty Knowledge Graph"
            description="No entities are currently projected into this workspace."
            actionLabel="Plan with AI"
            onAction={() => setAiModalOpen(true)}
          />
        ) : (
          <div className="space-y-2">
            {nodes.map((node) => {
              const isGoal = node.type === "goal";
              const isProject = node.type === "project";
              const isTask = node.type === "task";
              const isNote = node.type === "note";

              const badgeColor = isGoal
                ? "text-[#34d399] bg-[#34d399]/10 border-[#34d399]/30"
                : isProject
                ? "text-[#a7f3d0] bg-[#a7f3d0]/10 border-[#a7f3d0]/30"
                : isTask
                ? "text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/30"
                : "text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/30";

              return (
                <div
                  key={node.id}
                  onClick={() =>
                    setSelectedEntity({
                      type: node.type as any,
                      id: (node.data as any).entityId || node.id,
                      data: node.data,
                    })
                  }
                  className="p-3.5 rounded-xl glass-standard hover:border-[#a7f3d0]/40 cursor-pointer transition-all flex items-center justify-between group bg-[#101918]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#15221e] border border-[#202e2b]">
                      {isGoal && <Target className="h-4 w-4 text-[#34d399]" />}
                      {isProject && <FolderGit2 className="h-4 w-4 text-[#a7f3d0]" />}
                      {isTask && <CheckSquare className="h-4 w-4 text-[#38bdf8]" />}
                      {isNote && <BookOpen className="h-4 w-4 text-[#fbbf24]" />}
                    </div>
                    <div>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${badgeColor}`}>
                        {node.type}
                      </span>
                      <div className="text-xs font-semibold text-[#f1f5f4] mt-0.5 group-hover:text-[#a7f3d0] transition-colors">
                        {(node.data as any).title || "Untitled Entity"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-[#9aaba8]">
                    <span className="capitalize">{(node.data as any).priority || "medium"}</span>
                    {(node.data as any).progress !== undefined && (
                      <span className="text-[#f1f5f4] font-medium">{(node.data as any).progress}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Empty Fallback
  if (nodes.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 bg-[#080d10] relative">
        <EmptyState
          title="Empty Knowledge Graph"
          description="Your coordinates have not yet been materialized. Create your first project or let the AI Architect plan your workspace."
          actionLabel="Plan with AI"
          onAction={() => setAiModalOpen(true)}
          secondaryActionLabel="Refresh"
          onSecondaryAction={fetchGraph}
        />
      </div>
    );
  }

  // Signature Spatial Canvas with React Flow (Systems in Motion aesthetic)
  return (
    <div className="h-full w-full bg-[#080d10] relative select-none overflow-hidden">
      {/* Floating Canvas Header Overlay */}
      <div className="absolute top-3 left-4 z-10 pointer-events-none flex items-center gap-2.5">
        <div className="px-3 py-1.5 rounded-lg glass-standard text-xs font-mono text-[#d6dedc] pointer-events-auto border-[#202e2b] shadow-sm flex items-center gap-2 bg-[#101918]/90">
          <span className={`w-1.5 h-1.5 rounded-full ${isInteractive ? "bg-[#34d399]" : "bg-[#f87171]"}`} />
          <span>{isInteractive ? "Interactive" : "Locked"}</span>
          <span className="text-[#6e807d]">•</span>
          <span>{nodes.length} Nodes</span>
          <span className="text-[#6e807d]">•</span>
          <span>{edges.length} Edges</span>
        </div>

        {/* Filter chips */}
        <div className="hidden sm:flex items-center rounded-lg bg-[#101918]/90 border border-[#202e2b] p-0.5 pointer-events-auto text-[10px] font-mono">
          {["all", "project", "task", "note"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2 py-0.5 rounded capitalize transition-colors ${
                filterType === t
                  ? "bg-[#15221e] text-[#a7f3d0] font-medium"
                  : "text-[#9aaba8] hover:text-[#f1f5f4]"
              }`}
            >
              {t === "all" ? "All" : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      <ReactFlow
        nodes={displayedNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodesDraggable={isInteractive}
        nodesConnectable={isInteractive}
        elementsSelectable={isInteractive}
        panOnDrag={isInteractive}
        zoomOnScroll={isInteractive}
        zoomOnPinch={isInteractive}
        zoomOnDoubleClick={isInteractive}
        panOnScroll={isInteractive}
        fitView
        className={`spatial-canvas-grid ${!isInteractive ? "!cursor-default [&_.react-flow__pane]:!cursor-default" : ""}`}
        minZoom={0.2}
        maxZoom={2.5}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#334641", strokeWidth: 1.5, opacity: 0.8 },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#202e2b" />

        {/* Custom Glass Controls */}
        <Controls
          onInteractiveChange={(interactiveStatus) => setIsInteractive(interactiveStatus)}
          className="!bg-[#101918]/90 !border-[#202e2b] !rounded-xl !p-1 !shadow-lg backdrop-blur-md [&>button]:!bg-[#15221e] [&>button]:!border-[#202e2b] [&>button]:!text-[#d6dedc] hover:[&>button]:!bg-[#1c2e29] hover:[&>button]:!text-[#a7f3d0] !fill-current"
          position="bottom-left"
        />

        {/* Custom Glass Minimap */}
        <MiniMap
          nodeColor={(n) => {
            if (n.type === "goal") return "#34d399";
            if (n.type === "project") return "#a7f3d0";
            if (n.type === "task") return "#38bdf8";
            return "#fbbf24";
          }}
          className="!bg-[#101918]/90 !border-[#202e2b] !rounded-xl !shadow-lg backdrop-blur-md"
          position="bottom-right"
          maskColor="rgba(8, 13, 16, 0.85)"
        />
      </ReactFlow>
    </div>
  );
}
