import { create } from "zustand";
import { api } from "@/lib/api";

export type NavTab = "home" | "universe" | "tasks" | "notes" | "timeline" | "analytics" | "projects" | "users";

export interface SelectedEntity {
  type: "project" | "task" | "note" | "goal";
  id: string;
  data: any;
}

interface WorkspaceState {
  currentWorkspace: any | null;
  workspaces: any[];
  activeTab: NavTab;
  selectedEntity: SelectedEntity | null;
  isInspectorOpen: boolean;
  isCommandPaletteOpen: boolean;
  isAiModalOpen: boolean;
  universeViewMode: "spatial" | "tree"; // WCAG 2.2 accessible tree view alternative

  // Shared cached entity collections for instant, zero-flicker tab switching
  projects: any[];
  tasks: any[];
  notes: any[];
  analytics: any | null;
  graphNodes: any[];
  graphEdges: any[];
  isDataLoaded: boolean;
  isGraphLoaded: boolean;
  isSyncing: boolean;

  // Actions
  setCurrentWorkspace: (workspace: any) => void;
  setWorkspaces: (workspaces: any[]) => void;
  setActiveTab: (tab: NavTab) => void;
  setSelectedEntity: (entity: SelectedEntity | null) => void;
  setInspectorOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setAiModalOpen: (open: boolean) => void;
  setUniverseViewMode: (mode: "spatial" | "tree") => void;
  toggleInspector: () => void;

  // Collection Setters & Optimistic Mutators
  setProjects: (projects: any[]) => void;
  setTasks: (tasks: any[]) => void;
  setNotes: (notes: any[]) => void;
  setAnalytics: (analytics: any) => void;
  setGraphData: (data: { nodes: any[]; edges: any[] }) => void;
  updateTaskOptimistic: (taskId: string, patch: any) => void;
  updateGraphPositions: (positions: Array<{ id: string; position_x: number; position_y: number }>) => void;

  // Async Background Data Fetchers (SWR Pattern)
  initializeFromCache: () => void;
  loadWorkspaceData: (workspaceId?: string) => Promise<void>;
  revalidateGraph: (workspaceId?: string) => Promise<void>;
}

// Prepopulate from synchronous local cache so frame 0 has rich content
const initialGraph = api.getCachedGraph();
const initialProjects = api.getCachedProjects();
const initialTasks = api.getCachedTasks();
const initialNotes = api.getCachedNotes();
const initialWorkspaces = api.getCachedWorkspaces();

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  currentWorkspace: initialWorkspaces.length > 0 ? initialWorkspaces[0] : null,
  workspaces: initialWorkspaces,
  activeTab: "home", // Overview is the default landing page
  selectedEntity: null,
  isInspectorOpen: false,
  isCommandPaletteOpen: false,
  isAiModalOpen: false,
  universeViewMode: "spatial",

  projects: initialProjects,
  tasks: initialTasks,
  notes: initialNotes,
  analytics: null,
  graphNodes: initialGraph.nodes || [],
  graphEdges: initialGraph.edges || [],
  isDataLoaded: initialProjects.length > 0,
  isGraphLoaded: (initialGraph.nodes || []).length > 0,
  isSyncing: false,

  setCurrentWorkspace: (workspace) => {
    set({ currentWorkspace: workspace });
    if (workspace?.id) {
      get().loadWorkspaceData(workspace.id);
    }
  },

  setWorkspaces: (workspaces) => set({ workspaces }),

  setActiveTab: (tab) => {
    // Gracefully normalize legacy or alias tabs
    const normalizedTab = tab === "projects" ? "tasks" : tab;
    set({ activeTab: normalizedTab });
  },

  setSelectedEntity: (entity) => set({ selectedEntity: entity, isInspectorOpen: entity !== null }),
  setInspectorOpen: (open) => set({ isInspectorOpen: open }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setAiModalOpen: (open) => set({ isAiModalOpen: open }),
  setUniverseViewMode: (mode) => set({ universeViewMode: mode }),
  toggleInspector: () => set((state) => ({ isInspectorOpen: !state.isInspectorOpen })),

  setProjects: (projects) => set({ projects }),
  setTasks: (tasks) => set({ tasks }),
  setNotes: (notes) => set({ notes }),
  setAnalytics: (analytics) => set({ analytics }),

  setGraphData: ({ nodes, edges }) =>
    set({
      graphNodes: nodes,
      graphEdges: edges,
      isGraphLoaded: true,
    }),

  updateTaskOptimistic: (taskId, patch) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
    }));
  },

  updateGraphPositions: (positions) => {
    const posMap = new Map(positions.map((p) => [p.id, p]));
    set((state) => ({
      graphNodes: state.graphNodes.map((n) => {
        const update = posMap.get(n.id);
        if (update) {
          return { ...n, position_x: update.position_x, position_y: update.position_y };
        }
        return n;
      }),
    }));
  },

  initializeFromCache: () => {
    const g = api.getCachedGraph();
    const p = api.getCachedProjects();
    const t = api.getCachedTasks();
    const n = api.getCachedNotes();
    const w = api.getCachedWorkspaces();

    set({
      graphNodes: g.nodes || [],
      graphEdges: g.edges || [],
      projects: p,
      tasks: t,
      notes: n,
      workspaces: w,
      currentWorkspace: w.length > 0 ? w[0] : null,
      isDataLoaded: p.length > 0,
      isGraphLoaded: (g.nodes || []).length > 0,
    });
  },

  loadWorkspaceData: async (workspaceId?: string) => {
    const wsId = workspaceId || get().currentWorkspace?.id || "ws_prime";
    try {
      set({ isSyncing: true });
      const [projData, taskData, noteData, analyticsData, graphData] = await Promise.all([
        api.listProjects(wsId),
        api.listTasks(wsId),
        api.listNotes(wsId),
        api.getAnalytics(wsId),
        api.getGraph(wsId),
      ]);

      set({
        projects: projData,
        tasks: taskData,
        notes: noteData,
        analytics: analyticsData,
        graphNodes: graphData.nodes || [],
        graphEdges: graphData.edges || [],
        isDataLoaded: true,
        isGraphLoaded: true,
        isSyncing: false,
      });
    } catch (err) {
      console.warn("Background workspace sync notice:", err);
      set({ isSyncing: false });
    }
  },

  revalidateGraph: async (workspaceId?: string) => {
    const wsId = workspaceId || get().currentWorkspace?.id || "ws_prime";
    try {
      set({ isSyncing: true });
      const graphData = await api.getGraph(wsId);
      if (graphData && Array.isArray(graphData.nodes) && graphData.nodes.length > 0) {
        set({
          graphNodes: graphData.nodes,
          graphEdges: graphData.edges || [],
          isGraphLoaded: true,
          isSyncing: false,
        });
      } else {
        set({ isSyncing: false });
      }
    } catch {
      set({ isSyncing: false });
    }
  },
}));
