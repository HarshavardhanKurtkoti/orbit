"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Orbit,
  Home,
  Compass,
  CheckSquare,
  BookOpen,
  CalendarDays,
  BarChart3,
  Sparkles,
  Command,
  Search,
  Bell,
  ChevronRight,
  ChevronDown,
  Layers,
  ListTree,
  SlidersHorizontal,
  X,
  Menu,
  Check,
} from "lucide-react";
import { useWorkspaceStore, NavTab } from "@/stores/workspace-store";
import { squashStretchVariant } from "@/motion";
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
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassButton } from "@/components/ui/GlassButton";

const NAV_ITEMS: Array<{ id: NavTab; label: string; icon: React.ElementType; badge?: string }> = [
  { id: "home", label: "Home", icon: Home },
  { id: "universe", label: "Universe", icon: Compass, badge: "Spatial" },
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
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

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
    <AmbientBackground>
      <div className="flex h-screen w-screen text-[#F8FAFC] select-none overflow-hidden relative">
        {/* 1. FLOATING GLASS NAVIGATION RAIL */}
        <aside
          className={`
            fixed md:relative inset-y-0 left-0 z-40
            w-64 md:w-[250px] p-3 flex flex-col justify-between
            transition-transform duration-300 ease-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* Main Floating Glass Container */}
          <div className="h-full w-full rounded-3xl glass-standard border-white/[0.09] flex flex-col justify-between p-3.5 shadow-2xl relative overflow-hidden">
            {/* Luminous atmospheric edge reflection */}
            <div className="absolute -top-16 -left-16 w-36 h-36 rounded-full bg-[#9366FF]/20 blur-2xl pointer-events-none" />

            <div>
              {/* ORBIT BRANDING */}
              <div className="flex items-center justify-between px-2 py-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#9366FF] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <Orbit className="h-5 w-5 text-white animate-[spin_35s_linear_infinite]" />
                    </div>
                    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#9366FF] to-[#38BDF8] opacity-35 blur-sm -z-10" />
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                      ORBIT
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono tracking-tight flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      SPATIAL OS v2.0
                    </p>
                  </div>
                </div>

                {/* Mobile close button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* WORKSPACE SWITCHER */}
              <div className="relative mb-4">
                <button
                  onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/15 flex items-center justify-between text-left transition-all"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] font-mono text-purple-300 uppercase tracking-wider">WORKSPACE</div>
                    <div className="text-xs font-semibold text-white truncate">
                      {currentWorkspace?.name || "Cosmos Prime"}
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                      isWorkspaceMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Workspace Switcher Popover */}
                <AnimatePresence>
                  {isWorkspaceMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-0 right-0 mt-1.5 p-1.5 rounded-xl glass-elevated border border-white/15 shadow-2xl z-50 space-y-1"
                    >
                      {workspaces.map((ws) => (
                        <button
                          key={ws.id}
                          onClick={() => {
                            setCurrentWorkspace(ws);
                            setIsWorkspaceMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                            currentWorkspace?.id === ws.id
                              ? "bg-[#9366FF]/20 text-white font-medium border border-[#9366FF]/30"
                              : "text-slate-300 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span className="truncate">{ws.name}</span>
                          {currentWorkspace?.id === ws.id && <Check className="h-3.5 w-3.5 text-[#38BDF8]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI ARCHITECT CTA (Principle 15: Von Restorff Effect) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap="press"
                variants={squashStretchVariant}
                onClick={() => setAiModalOpen(true)}
                className="w-full mb-5 p-2.5 rounded-2xl bg-gradient-to-r from-[#9366FF]/25 via-[#9366FF]/15 to-[#38BDF8]/15 border border-[#9366FF]/40 hover:border-[#9366FF] text-left flex items-center gap-3 group transition-all shadow-glow-violet/30"
              >
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#9366FF] to-[#38BDF8] text-white shadow-md">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white group-hover:text-purple-200 transition-colors">
                    AI Architect
                  </div>
                  <div className="text-[10px] text-purple-300/80 font-mono tracking-tight">Generate Workspace</div>
                </div>
              </motion.button>

              {/* NAVIGATION LINKS */}
              <nav className="space-y-1">
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative group ${
                        isActive
                          ? "text-white font-semibold shadow-inner"
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                      }`}
                    >
                      {/* Active glowing backdrop & selection indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavHighlight"
                          className="absolute inset-0 rounded-xl bg-white/[0.09] border border-white/[0.14] shadow-glass-sm -z-10"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive
                            ? "text-[#38BDF8]"
                            : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span className="tracking-wide">{item.label}</span>

                      {item.badge && (
                        <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-[#9366FF]/20 text-purple-300 border border-[#9366FF]/30">
                          {item.badge}
                        </span>
                      )}

                      {isActive && !item.badge && (
                        <motion.div
                          layoutId="activeNavDot"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* USER PROFILE CARD */}
            <div className="pt-3 border-t border-white/[0.08]">
              <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] transition-all cursor-pointer">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#9366FF] to-[#38BDF8] p-[1.5px]">
                    <div className="h-full w-full rounded-full bg-[#101426] flex items-center justify-center text-xs font-bold text-white">
                      CO
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070914]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">Commander Orbit</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">Spatial Architect</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          />
        )}

        {/* 2. MAIN APPLICATION WORKSPACE */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
          {/* TOP COMMAND BAR */}
          <header className="h-16 px-4 md:px-6 flex items-center justify-between z-20">
            {/* Left: Mobile hamburger & breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl glass-subtle text-slate-300 hover:text-white"
                aria-label="Open navigation"
              >
                <Menu className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="text-slate-400 hidden sm:inline">{currentWorkspace?.name || "Cosmos Prime"}</span>
                <ChevronRight className="h-3 w-3 text-slate-600 hidden sm:inline" />
                <span className="capitalize text-white font-semibold tracking-wide px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08]">
                  {activeTab}
                </span>
              </div>
            </div>

            {/* Right: Search command pill & view controls */}
            <div className="flex items-center gap-3">
              {/* Command Palette Trigger (Raycast style) */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-subtle hover:border-white/20 text-xs text-slate-400 hover:text-slate-100 transition-all shadow-glass-sm"
              >
                <Search className="h-3.5 w-3.5 text-[#38BDF8]" />
                <span className="hidden sm:inline">Search universe...</span>
                <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-slate-300 border border-white/10">
                  <Command className="h-2.5 w-2.5" /> K
                </kbd>
              </button>

              {/* Spatial vs Tree toggle for Universe */}
              {activeTab === "universe" && (
                <div className="flex items-center rounded-xl glass-subtle p-0.5 border-white/10">
                  <button
                    onClick={() => setUniverseViewMode("spatial")}
                    title="Spatial Graph Canvas"
                    className={`p-1.5 rounded-lg text-xs transition-all ${
                      universeViewMode === "spatial"
                        ? "bg-[#9366FF]/25 text-white shadow-sm border border-[#9366FF]/40"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setUniverseViewMode("tree")}
                    title="Accessible Tree View (WCAG 2.2)"
                    className={`p-1.5 rounded-lg text-xs transition-all ${
                      universeViewMode === "tree"
                        ? "bg-[#9366FF]/25 text-white shadow-sm border border-[#9366FF]/40"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <ListTree className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Notifications Pill */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setUnreadCount(0);
                  }}
                  className="p-2 rounded-xl glass-subtle hover:border-white/20 text-slate-300 hover:text-white transition-all relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#9366FF] ring-2 ring-[#070914] shadow-[0_0_8px_#9366FF]" />
                  )}
                </button>

                {/* Notifications Popover */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl glass-elevated border border-white/15 p-4 shadow-2xl z-50 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-xs font-semibold text-white">Spatial Notifications</span>
                        <span className="text-[10px] font-mono text-[#38BDF8]">All caught up</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
                          <div className="font-medium text-white flex items-center justify-between">
                            <span>Quantum Neural Engine</span>
                            <span className="text-[9px] text-slate-500 font-mono">10m ago</span>
                          </div>
                          <p className="text-[11px] text-slate-400">All vector index nodes synchronized to PostgreSQL.</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
                          <div className="font-medium text-white flex items-center justify-between">
                            <span>AI Blueprint Ready</span>
                            <span className="text-[9px] text-slate-500 font-mono">1h ago</span>
                          </div>
                          <p className="text-[11px] text-slate-400">AI Architect materialized 3 new interconnected projects.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* ACTIVE VIEW VIEWPORT */}
          <main className="flex-1 relative overflow-hidden">
            {isLoading ? (
              <div className="h-full w-full flex flex-col items-center justify-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#9366FF] to-[#38BDF8] flex items-center justify-center shadow-glow-violet">
                    <Orbit className="h-7 w-7 text-white animate-spin" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-mono tracking-wider animate-pulse">
                  CALIBRATING SPATIAL COORDINATES...
                </p>
              </div>
            ) : (
              <div className="h-full w-full relative">
                {activeTab === "universe" && <UniverseCanvas viewMode={universeViewMode} />}
                {activeTab === "home" && <HomeDashboard />}
                {(activeTab === "tasks" || (activeTab as string) === "projects") && <TasksView />}
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
    </AmbientBackground>
  );
}
