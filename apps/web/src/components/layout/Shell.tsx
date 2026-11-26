"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Home,
  CheckSquare,
  BookOpen,
  CalendarDays,
  BarChart3,
  Sparkles,
  Search,
  X,
  Menu,
} from "lucide-react";
import { useWorkspaceStore, NavTab } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { InspectorDock } from "@/components/inspector/InspectorDock";
import { UniverseCanvas } from "@/features/universe/UniverseCanvas";
import { HomeDashboard } from "@/features/home/HomeDashboard";
import { TasksView } from "@/features/tasks/TasksView";
import { NotesView } from "@/features/notes/NotesView";
import { TimelineView } from "@/features/timeline/TimelineView";
import { AnalyticsView } from "@/features/analytics/AnalyticsView";
import { AiGeneratorModal } from "@/features/ai/AiGeneratorModal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { GlassButton } from "@/components/ui/GlassButton";

const NAV_ITEMS: Array<{ id: NavTab; label: string; icon: React.ElementType; badge?: string }> = [
  { id: "home", label: "Overview", icon: Home },
  { id: "universe", label: "Universe", icon: Compass, badge: "Flagship" },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "notes", label: "Notes", icon: BookOpen },
  { id: "timeline", label: "Timeline", icon: CalendarDays },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export function Shell() {
  const {
    activeTab,
    setActiveTab,
    currentWorkspace,
    setCurrentWorkspace,
    workspaces,
    setWorkspaces,
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    isAiModalOpen,
    setAiModalOpen,
    universeViewMode,
    setUniverseViewMode,
  } = useWorkspaceStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Auto authenticate with demo account on load
  useEffect(() => {
    async function init() {
      try {
        await api.demoLogin();
        const wsList = await api.listWorkspaces();
        setWorkspaces(wsList);
        if (wsList.length > 0) {
          setCurrentWorkspace(wsList[0]);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [setCurrentWorkspace, setWorkspaces]);

  // URL search params sync for deep-linking & preview captures
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as NavTab | null;
      if (tabParam && ["home", "universe", "tasks", "notes", "timeline", "analytics"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
      if (params.get("cmd") === "true" || params.get("commandPalette") === "true") {
        setCommandPaletteOpen(true);
      }
    }
  }, [setActiveTab, setCommandPaletteOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  return (
    <AmbientBackground>
      <div className="flex h-screen w-screen text-[#f1f5f4] select-none overflow-hidden relative">
        {/* 1. COMPACT APPLICATION SIDEBAR */}
        <aside
          className={`
            fixed md:relative inset-y-0 left-0 z-40
            w-64 md:w-[230px] p-2.5 flex flex-col justify-between
            transition-transform duration-200 ease-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* Main Slate Glass Sidebar Container */}
          <div className="h-full w-full rounded-xl glass-standard border-[#202e2b] flex flex-col justify-between p-3 relative overflow-hidden bg-[#101918]/90">
            <div>
              {/* ORBIT BRANDING */}
              <div className="flex items-center justify-between px-2 py-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-[#15221e] border border-[#202e2b] flex items-center justify-center text-[#a7f3d0]">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm tracking-tight text-[#f1f5f4] flex items-center gap-1.5 font-sans">
                      Orbit<span className="text-[#a7f3d0]">.</span>
                    </div>
                    <div className="text-[10px] text-[#9aaba8] font-mono tracking-tight flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                      <span>Workspace</span>
                    </div>
                  </div>
                </div>

                {/* Mobile close button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="md:hidden p-1 text-[#9aaba8] hover:text-[#f1f5f4]"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* GLOBAL SEARCH / COMMAND PALETTE TRIGGER */}
              <div className="mb-3">
                <button
                  onClick={() => setCommandPaletteOpen(true)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] hover:border-[#334641] text-xs font-medium text-[#9aaba8] hover:text-[#f1f5f4] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="h-4 w-4 text-[#9aaba8]" />
                    <span>Search</span>
                  </div>
                  <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#15221e] border border-[#202e2b] text-[#6e807d]">
                    ⌘K
                  </kbd>
                </button>
              </div>

              {/* NAVIGATION ITEMS */}
              <nav className="space-y-1">
                <div className="px-2 pt-1 pb-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#6e807d]">
                    Navigation
                  </span>
                </div>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between
                        transition-all duration-150 select-none
                        ${
                          isActive
                            ? "bg-[#15221e] text-[#f1f5f4] border border-[#202e2b]"
                            : "text-[#9aaba8] hover:text-[#f1f5f4] hover:bg-[#15221e]/40 border border-transparent"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`h-4 w-4 ${isActive ? "text-[#a7f3d0]" : "text-[#9aaba8]"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                            isActive
                              ? "bg-[#a7f3d0]/15 text-[#a7f3d0] border border-[#a7f3d0]/30"
                              : "bg-[#15221e] text-[#6e807d] border border-[#202e2b]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* QUICK ACTIONS */}
              <div className="mt-4 pt-3 border-t border-[#16221f] space-y-1">
                <div className="px-2 pb-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#6e807d]">
                    Tools
                  </span>
                </div>
                <button
                  onClick={() => setAiModalOpen(true)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#9aaba8] hover:text-[#a7f3d0] hover:bg-[#15221e]/50 border border-transparent hover:border-[#202e2b] flex items-center gap-2.5 transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-[#a7f3d0]" />
                  <span>AI Architect</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* 2. MAIN WORKSPACE VIEWPORT */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
          {/* TOPBAR HEADER */}
          <header className="h-12 border-b border-[#202e2b] bg-[#080d10]/80 backdrop-blur-md px-4 flex items-center justify-between z-30 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-1.5 rounded-lg text-[#9aaba8] hover:text-[#f1f5f4] hover:bg-[#15221e]"
                aria-label="Open mobile navigation"
              >
                <Menu className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#6e807d]">
                  Orbit
                </span>
                <span className="text-[#6e807d]">/</span>
                <span className="font-medium text-[#f1f5f4] capitalize">{activeTab}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Universe spatial vs tree toggle when in universe tab */}
              {activeTab === "universe" && (
                <div className="flex items-center rounded-lg bg-[#0b1312] border border-[#202e2b] p-0.5 text-xs font-mono">
                  <button
                    onClick={() => setUniverseViewMode("spatial")}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                      universeViewMode === "spatial"
                        ? "bg-[#15221e] text-[#a7f3d0] font-medium"
                        : "text-[#9aaba8] hover:text-[#f1f5f4]"
                    }`}
                  >
                    Spatial Graph
                  </button>
                  <button
                    onClick={() => setUniverseViewMode("tree")}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                      universeViewMode === "tree"
                        ? "bg-[#15221e] text-[#a7f3d0] font-medium"
                        : "text-[#9aaba8] hover:text-[#f1f5f4]"
                    }`}
                  >
                    Tree View
                  </button>
                </div>
              )}

              <GlassButton
                variant="subtle"
                size="sm"
                icon={<Search className="h-3.5 w-3.5" />}
                onClick={() => setCommandPaletteOpen(true)}
              >
                <span className="hidden sm:inline">Search</span>
                <kbd className="ml-1 text-[9px] font-mono opacity-60">⌘K</kbd>
              </GlassButton>

              <GlassButton
                variant="primary"
                size="sm"
                icon={<Sparkles className="h-3.5 w-3.5" />}
                onClick={() => setAiModalOpen(true)}
              >
                <span className="hidden sm:inline">Plan</span>
              </GlassButton>
            </div>
          </header>

          {/* VIEW SWITCHER CONTENT */}
          <div className="flex-1 min-w-0 h-[calc(100vh-3rem)] overflow-hidden relative">
            {activeTab === "home" && <HomeDashboard />}
            {activeTab === "universe" && <UniverseCanvas viewMode={universeViewMode} />}
            {activeTab === "tasks" && <TasksView />}
            {activeTab === "notes" && <NotesView />}
            {activeTab === "timeline" && <TimelineView />}
            {activeTab === "analytics" && <AnalyticsView />}
          </div>
        </main>

        {/* 3. DOCKED INSPECTOR DRAWER */}
        <InspectorDock />

        {/* 4. MODALS & OVERLAYS */}
        <CommandPalette />
        <AiGeneratorModal />
      </div>
    </AmbientBackground>
  );
}
