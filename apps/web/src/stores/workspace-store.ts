import { create } from "zustand";

export type NavTab = "universe" | "home" | "projects" | "tasks" | "notes" | "timeline" | "analytics";

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
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: null,
  workspaces: [],
  activeTab: "universe",
  selectedEntity: null,
  isInspectorOpen: false,
  isCommandPaletteOpen: false,
  isAiModalOpen: false,
  universeViewMode: "spatial",

  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedEntity: (entity) => set({ selectedEntity: entity, isInspectorOpen: entity !== null }),
  setInspectorOpen: (open) => set({ isInspectorOpen: open }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setAiModalOpen: (open) => set({ isAiModalOpen: open }),
  setUniverseViewMode: (mode) => set({ universeViewMode: mode }),
  toggleInspector: () => set((state) => ({ isInspectorOpen: !state.isInspectorOpen })),
}));
