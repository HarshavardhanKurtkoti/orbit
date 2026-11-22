"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
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
import { FolderGit2, CheckSquare, BookOpen, Target, Sparkles } from "lucide-react";

interface UniverseCanvasProps {
  viewMode?: "spatial" | "tree";
}

export function UniverseCanvas({ viewMode = "spatial" }: UniverseCanvasProps) {
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);
  const setSelectedEntity = useWorkspaceStore((s) => s.setSelectedEntity);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);

  const nodeTypes = useMemo(
    () => ({
      project: ProjectNode,
      task: TaskNode,
      note: NoteNode,
      goal: GoalNode,
    }),
    []
  );

  // Load graph from API
  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function fetchGraph() {
      try {
        setLoading(true);
        const graph = await api.getGraph(currentWorkspace.id);
        const mappedNodes: Node[] = graph.nodes.map((n) => ({
          id: n.id,
          type: n.entity_type,
          position: { x: n.position_x, y: n.position_y },
          data: {
            ...n.metadata,
            entityId: n.entity_id,
            workspaceId: n.workspace_id,
          },
        }));

        const mappedEdges: Edge[] = graph.edges.map((e) => ({
          id: e.id,
          source: e.source_node_id,
          target: e.target_node_id,
          animated: e.relationship_type === "depends_on",
          style: { stroke: "#8B5CF6", strokeWidth: 1.5, opacity: 0.6 },
        }));

        setNodes(mappedNodes);
        setEdges(mappedEdges);
      } catch (err) {
        console.error("Failed to load universe graph:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGraph();
  }, [currentWorkspace?.id]);

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
      if (currentWorkspace?.id && connection.source && connection.target) {
        try {
          await api.createGraphEdge(currentWorkspace.id, {
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
      if (!currentWorkspace?.id) return;
      try {
        await api.updateGraphLayout(currentWorkspace.id, [
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


  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#08090D] text-slate-400 text-xs font-mono">
        LOADING SPATIAL COORDINATES...
      </div>
    );
  }

  // ACCESSIBLE TREE VIEW ALTERNATIVE (WCAG 2.2 AA)
  if (viewMode === "tree") {
    return (
      <div className="h-full w-full overflow-y-auto p-8 bg-[#08090D] text-white space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-xl font-bold">Universe Hierarchy (Tree View)</h1>
          <p className="text-xs text-slate-400 mt-1">Accessible structural view of all connected universe entities.</p>
        </div>

        <div className="space-y-4">
          {nodes.map((node) => {
            const isGoal = node.type === "goal";
            const isProject = node.type === "project";
            const isTask = node.type === "task";
            const isNote = node.type === "note";

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
                className="p-4 rounded-xl bg-[#11131A] border border-white/10 hover:border-[#8B5CF6]/50 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    {isGoal && <Target className="h-4 w-4 text-emerald-400" />}
                    {isProject && <FolderGit2 className="h-4 w-4 text-[#8B5CF6]" />}
                    {isTask && <CheckSquare className="h-4 w-4 text-[#38BDF8]" />}
                    {isNote && <BookOpen className="h-4 w-4 text-amber-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase text-slate-500">{node.type}</div>
                    <div className="text-sm font-medium text-white">{(node.data as any).title || "Untitled"}</div>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">{(node.data as any).priority || ""}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#08090D] relative select-none">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        fitView
        className="spatial-grid-bg"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="rgba(255, 255, 255, 0.08)" />
        <Controls className="!bg-[#11131A] !border-white/10 !fill-white" />
      </ReactFlow>
    </div>
  );
}
