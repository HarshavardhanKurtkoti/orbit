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
  Orbit,
  RefreshCw,
  Plus,
  Compass,
  AlertCircle,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedEdges: Edge[] = (graph.edges || []).map((e: any) => ({
        id: e.id,
        source: e.source_node_id,
        target: e.target_node_id,
        animated: e.relationship_type === "depends_on",
        style: {
          stroke: e.relationship_type === "depends_on" ? "#9366FF" : "#38BDF8",
          strokeWidth: 2,
          opacity: 0.7,
        },
      }));

      setNodes(mappedNodes);
      setEdges(mappedEdges);
    } catch (err: any) {
      console.error("Failed to load universe graph:", err);
      setError("Unable to synchronize spatial coordinates with the orbit kernel.");
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

  // Debounced node drag persistence (Principle 16: Doherty threshold & reliability)
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

  // 1. Sleek Glass Loading State (Eliminates indefinite "LOADING SPATIAL COORDINATES...")
  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-[#070914] relative overflow-hidden">
        {/* Ambient Aurora behind loader */}
        <div className="w-80 h-80 rounded-full bg-[#9366FF]/20 blur-3xl pointer-events-none" />

        <GlassPanel elevation="elevated" className="p-8 flex flex-col items-center gap-4 text-center max-w-sm z-10">
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#9366FF] to-[#38BDF8] flex items-center justify-center shadow-glow-violet">
              <Orbit className="h-8 w-8 text-white animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-[#9366FF]/30 blur-sm -z-10 animate-pulse" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              SYNCHRONIZING SPATIAL MESH
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              Calibrating 60 FPS force-directed coordinates...
            </p>
          </div>
        </GlassPanel>
      </div>
    );
  }

  // 2. Error Recovery State
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 bg-[#070914]">
        <GlassPanel elevation="elevated" className="p-8 max-w-md text-center flex flex-col items-center gap-4 border-rose-500/30">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Spatial Connection Interrupted</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{error}</p>
          </div>
          <GlassButton
            variant="primary"
            size="md"
            icon={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={fetchGraph}
          >
            Retry Connection
          </GlassButton>
        </GlassPanel>
      </div>
    );
  }

  // 3. Accessible Tree View Alternative (WCAG 2.2 AA)
  if (viewMode === "tree") {
    return (
      <div className="h-full w-full overflow-y-auto p-6 md:p-10 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Compass className="h-5 w-5 text-[#9366FF]" />
              Universe Spatial Hierarchy (Tree View)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Accessible semantic structure of all connected workspace coordinates.
            </p>
          </div>

          <GlassButton
            variant="primary"
            size="sm"
            icon={<Sparkles className="h-3.5 w-3.5" />}
            onClick={() => setAiModalOpen(true)}
          >
            Generate Nodes
          </GlassButton>
        </div>

        {nodes.length === 0 ? (
          <EmptyState
            title="Empty Spatial Universe"
            description="No entities are currently projected into this workspace coordinate frame."
            actionLabel="Generate Blueprint"
            onAction={() => setAiModalOpen(true)}
          />
        ) : (
          <div className="space-y-3">
            {nodes.map((node) => {
              const isGoal = node.type === "goal";
              const isProject = node.type === "project";
              const isTask = node.type === "task";
              const isNote = node.type === "note";

              const badgeColor = isGoal
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                : isProject
                ? "text-purple-300 bg-purple-500/10 border-purple-500/30"
                : isTask
                ? "text-sky-300 bg-sky-500/10 border-sky-500/30"
                : "text-amber-300 bg-amber-500/10 border-amber-500/30";

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
                  className="p-4 rounded-2xl glass-standard hover:border-[#9366FF]/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 group-hover:bg-white/[0.08] transition-colors">
                      {isGoal && <Target className="h-5 w-5 text-emerald-400" />}
                      {isProject && <FolderGit2 className="h-5 w-5 text-[#9366FF]" />}
                      {isTask && <CheckSquare className="h-5 w-5 text-[#38BDF8]" />}
                      {isNote && <BookOpen className="h-5 w-5 text-amber-400" />}
                    </div>
                    <div>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${badgeColor}`}>
                        {node.type}
                      </span>
                      <div className="text-sm font-semibold text-white mt-1 group-hover:text-purple-200 transition-colors">
                        {(node.data as any).title || "Untitled Coordinate"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <span className="capitalize">{(node.data as any).priority || "medium"}</span>
                    {(node.data as any).progress !== undefined && (
                      <span className="text-white font-medium">{(node.data as any).progress}%</span>
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

  // 4. Empty Canvas Fallback
  if (nodes.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 bg-[#070914] relative">
        <EmptyState
          title="Empty Spatial Mesh"
          description="Your spatial coordinates have not yet been materialized. Create your first project or let the AI Architect synthesize a complete cosmic roadmap."
          actionLabel="Generate with AI"
          onAction={() => setAiModalOpen(true)}
          secondaryActionLabel="Refresh Canvas"
          onSecondaryAction={fetchGraph}
        />
      </div>
    );
  }

  // 5. Signature Spatial Canvas with React Flow
  return (
    <div className="h-full w-full bg-[#070914] relative select-none overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#9366FF]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#38BDF8]/10 blur-[120px] pointer-events-none" />

      {/* Floating Canvas Header Overlay */}
      <div className="absolute top-4 left-6 z-10 pointer-events-none flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-xl glass-subtle text-xs font-mono text-slate-300 pointer-events-auto border-white/10 shadow-glass-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{nodes.length} Spatial Nodes</span>
          <span className="text-slate-600">•</span>
          <span>{edges.length} Dependencies</span>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        fitView
        className="spatial-canvas-grid"
        minZoom={0.2}
        maxZoom={2.5}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#9366FF", strokeWidth: 2, opacity: 0.7 },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.2} color="rgba(255, 255, 255, 0.08)" />

        {/* Custom Glass Controls */}
        <Controls
          className="!bg-[#101426]/90 !border-white/15 !rounded-2xl !p-1.5 !shadow-2xl backdrop-blur-xl [&>button]:!bg-white/5 [&>button]:!border-white/10 [&>button]:!text-slate-200 hover:[&>button]:!bg-[#9366FF]/30 hover:[&>button]:!text-white !fill-current"
          position="bottom-left"
        />

        {/* Custom Glass Minimap */}
        <MiniMap
          nodeColor={(n) => {
            if (n.type === "goal") return "#34D399";
            if (n.type === "project") return "#9366FF";
            if (n.type === "task") return "#38BDF8";
            return "#FBBF24";
          }}
          className="!bg-[#101426]/90 !border-white/15 !rounded-2xl !shadow-2xl backdrop-blur-xl"
          position="bottom-right"
          maskColor="rgba(7, 9, 20, 0.85)"
        />
      </ReactFlow>
    </div>
  );
}
