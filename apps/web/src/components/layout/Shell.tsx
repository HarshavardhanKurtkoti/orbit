"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Orbit,
  Home,
  Compass,
  FolderGit2,
  CheckSquare,
  BookOpen,
  CalendarDays,
  BarChart3,
  Sparkles,
  Command,
  Search,
  Bell,
  SlidersHorizontal,
  ChevronRight,
  Layers,
  ListTree,
  X,
  ExternalLink,
} from "lucide-react";
import { useWorkspaceStore, NavTab } from "@/stores/workspace-store";
import { motionTokens, squashStretchVariant, inspectorSheetVariants } from "@/motion";
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

const NAV_ITEMS: Array<{ id: NavTab; label: string; icon: React.ElementType }> = [
  { id: "universe", label: "Universe", icon: Compass },
  { id: "home", label: "Home", icon: Home },
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
    setWorkspaces,
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    isAiModalOpen,
    setAiModalOpen,
    universeViewMode,
    setUniverseViewMode,
  } = useWorkspaceStore();

  const [isLoading, setIsLoading] = useState(true);

  // Auto authenticate with demo account on load
  useEffect(() => {
    async function init() {
      try {
        const authData = await api.demoLogin();
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

  // Global Ctrl+K / Cmd+K listener (Principle 20: Frequency of Use)
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
    <div className="flex h-screen w-screen bg-[#08090D] text-[#F8FAFC] select-none overflow-hidden">
      {/* 1. LEFT NAVIGATION RAIL */}
      <aside className="w-16 md:w-60 border-r border-white/5 bg-[#08090D] flex flex-col justify-between py-4 px-2 md:px-3 z-30">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-2 mb-6">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Orbit className="h-5 w-5 text-white animate-spin" style={{ animationDuration: "25s" }} />
            </div>
            <div className="hidden md:block">
              <span className="font-semibold text-sm tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                ORBIT
              </span>
              <p className="text-[10px] text-slate-500 font-mono tracking-tight">OS v0.1 • COSMOS</p>
            </div>
          </div>

          {/* AI Generator CTA (Principle 15: Von Restorff Effect) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap="press"
            variants={squashStretchVariant}
            onClick={() => setAiModalOpen(true)}
            className="w-full mb-6 p-2 md:px-3 md:py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6]/20 to-[#38BDF8]/10 border border-[#8B5CF6]/40 hover:border-[#8B5CF6] text-left flex items-center gap-2.5 group transition-colors shadow-sm"
          >
            <div className="p-1 rounded-lg bg-[#8B5CF6]/30 text-[#8B5CF6] group-hover:text-white transition-colors">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-medium text-slate-200">AI Architect</div>
              <div className="text-[10px] text-purple-300/70">Generate Universe</div>
            </div>
          </motion.button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white/10 text-white font-semibold shadow-inner"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#38BDF8]" : "text-slate-400"}`} />
                  <span className="hidden md:inline">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="ml-auto w-1 h-3 rounded-full bg-[#38BDF8] hidden md:block"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info / Workspace Pill */}
        <div className="border-t border-white/5 pt-3 px-1">
          <div className="flex items-center gap-2.5 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="h-7 w-7 rounded-full bg-[#8B5CF6]/30 border border-[#8B5CF6]/40 flex items-center justify-center text-xs font-medium text-[#8B5CF6]">
              OC
            </div>
            <div className="hidden md:block truncate">
              <div className="text-xs font-medium truncate">Commander</div>
              <div className="text-[10px] text-slate-500 truncate">{currentWorkspace?.name || "Cosmos Prime"}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* TOP COMMAND BAR */}
        <header className="h-14 border-b border-white/5 bg-[#08090D]/80 backdrop-blur-md px-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="text-slate-200 font-medium">{currentWorkspace?.name || "Cosmos Prime"}</span>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <span className="capitalize text-slate-300 font-medium">{activeTab}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Command Palette Trigger (Principle 12: Fitts's law & Principle 20) */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search universe...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-300">
                <Command className="h-2.5 w-2.5" /> K
              </kbd>
            </button>

            {/* Spatial / Accessible Tree Toggle (WCAG 2.2 AA) */}
            {activeTab === "universe" && (
              <div className="flex items-center rounded-lg bg-white/5 p-0.5 border border-white/10">
                <button
                  onClick={() => setUniverseViewMode("spatial")}
                  title="Spatial Graph Canvas"
                  className={`p-1.5 rounded-md text-xs transition-colors ${
                    universeViewMode === "spatial" ? "bg-white/15 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setUniverseViewMode("tree")}
                  title="Accessible Tree / List View"
                  className={`p-1.5 rounded-md text-xs transition-colors ${
                    universeViewMode === "tree" ? "bg-white/15 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ListTree className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ACTIVE VIEW VIEWPORT */}
        <main className="flex-1 relative overflow-hidden">
          {isLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-3">
              <Orbit className="h-8 w-8 text-[#8B5CF6] animate-spin" />
              <p className="text-xs text-slate-400 font-mono tracking-wide">CONNECTING TO ORBIT KERNEL...</p>
            </div>
          ) : (
            <div className="h-full w-full relative">
              {activeTab === "universe" && <UniverseCanvas viewMode={universeViewMode} />}
              {activeTab === "home" && <HomeDashboard />}
              {activeTab === "tasks" && <TasksView />}
              {activeTab === "notes" && <NotesView />}
              {activeTab === "timeline" && <TimelineView />}
              {activeTab === "analytics" && <AnalyticsView />}
            </div>
          )}
        </main>
      </div>

      {/* 3. RIGHT CONTEXTUAL INSPECTOR DOCK */}
      <InspectorDock />

      {/* 4. GLOBAL COMMAND PALETTE (Ctrl+K) */}
      <CommandPalette />

      {/* 5. AI WORKSPACE GENERATOR MODAL */}
      <AiGeneratorModal />
    </div>
  );
}
