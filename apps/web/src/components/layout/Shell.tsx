"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  Home,
  CheckSquare,
  BookOpen,
  CalendarDays,
  BarChart3,
  Users,
  Sparkles,
  Search,
  X,
  Menu,
  LogOut,
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
import { UsersView } from "@/features/users/UsersView";
import { AiGeneratorModal } from "@/features/ai/AiGeneratorModal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { GlassButton } from "@/components/ui/GlassButton";
import { WorkspaceSelector } from "@/components/layout/WorkspaceSelector";

interface NavItemConfig {
  id: NavTab;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: "home", label: "Overview", href: "/", icon: Home },
  { id: "universe", label: "Universe", href: "/universe", icon: Compass, badge: "Flagship" },
  { id: "tasks", label: "Tasks", href: "/tasks", icon: CheckSquare },
  { id: "notes", label: "Notes", href: "/notes", icon: BookOpen },
  { id: "timeline", label: "Timeline", href: "/timeline", icon: CalendarDays },
  { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart3 },
  { id: "users", label: "Users & Access", href: "/users", icon: Users },
];

interface ShellProps {
  children?: React.ReactNode;
  activeTab?: NavTab;
}

export function Shell({ children, activeTab: propTab }: ShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    activeTab: storeTab,
    setActiveTab,
    setCurrentWorkspace,
    setWorkspaces,
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    isAiModalOpen,
    setAiModalOpen,
    universeViewMode,
    setUniverseViewMode,
    loadWorkspaceData,
  } = useWorkspaceStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Derive active tab from current URL pathname or explicit prop
  const activeTab: NavTab = useMemo(() => {
    if (propTab) return propTab;
    if (!pathname || pathname === "/" || pathname === "/overview") return "home";
    if (pathname.startsWith("/universe")) return "universe";
    if (pathname.startsWith("/tasks")) return "tasks";
    if (pathname.startsWith("/notes")) return "notes";
    if (pathname.startsWith("/timeline")) return "timeline";
    if (pathname.startsWith("/analytics")) return "analytics";
    if (pathname.startsWith("/users")) return "users";
    return storeTab || "home";
  }, [pathname, propTab, storeTab]);

  // Synchronize store tab with pathname
  useEffect(() => {
    if (activeTab && activeTab !== storeTab) {
      setActiveTab(activeTab);
    }
  }, [activeTab, storeTab, setActiveTab]);

  // Route Protection & Session Initialization
  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      setIsAuthenticated(false);
      router.replace("/login");
      return;
    }

    setIsAuthenticated(true);

    async function init() {
      try {
        const user = await api.getMe();
        setCurrentUser(user);
        const wsList = await api.listWorkspaces();
        if (wsList && wsList.length > 0) {
          setWorkspaces(wsList);
          const savedWsId = typeof window !== "undefined" ? localStorage.getItem("orbit_active_workspace_id") : null;
          const activeWs = wsList.find((w: any) => w.id === savedWsId) || wsList[0];
          setCurrentWorkspace(activeWs);
          loadWorkspaceData(activeWs.id);
        }
      } catch (err: any) {
        console.warn("Workspace init warning:", err);
        if (err?.message?.includes("401") || err?.message?.includes("credentials")) {
          api.setTokens(null, null);
          setIsAuthenticated(false);
          router.replace("/login");
        }
      }
    }
    init();
  }, [router, setCurrentWorkspace, setWorkspaces, loadWorkspaceData]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      setIsAuthenticated(false);
      router.replace("/login");
    }
  };

  const userRole = currentUser?.role;
  const isPrivileged = userRole === "admin" || userRole === "owner";

  // RBAC: "Users & Access" is strictly restricted to owner and admin (hidden from member)
  const visibleNavItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      if (item.id === "users") {
        return isPrivileged;
      }
      return true;
    });
  }, [isPrivileged]);

  // If a non-privileged member tries to visit /users, redirect them to /
  useEffect(() => {
    if (activeTab === "users" && currentUser && !isPrivileged) {
      router.replace("/");
    }
  }, [activeTab, currentUser, isPrivileged, router]);

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

  if (isAuthenticated !== true) {
    return (
      <AmbientBackground>
        <div className="flex h-screen w-screen items-center justify-center text-xs font-mono text-[#a7f3d0] bg-[#080d10]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#15221e] border border-[#202e2b] flex items-center justify-center text-[#a7f3d0] animate-pulse">
              <Compass className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-ping" />
              <span>Verifying Orbit session...</span>
            </div>
          </div>
        </div>
      </AmbientBackground>
    );
  }

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
              <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="h-7 w-7 rounded-lg bg-[#15221e] border border-[#202e2b] flex items-center justify-center text-[#a7f3d0] group-hover:border-[#a7f3d0]/40 transition-colors">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm tracking-tight text-[#f1f5f4] flex items-center gap-1.5 font-sans group-hover:text-[#a7f3d0] transition-colors">
                      Orbit<span className="text-[#a7f3d0]">.</span>
                    </div>
                    <div className="text-[10px] text-[#6e807d] font-mono tracking-tight">
                      Spatial OS
                    </div>
                  </div>
                </Link>

                {/* Mobile close button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="md:hidden p-1 text-[#9aaba8] hover:text-[#f1f5f4]"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* INTERACTIVE WORKSPACE SELECTOR */}
              <div className="mb-3">
                <WorkspaceSelector />
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

              {/* NAVIGATION ITEMS WITH REAL ROUTING LINKS */}
              <nav className="space-y-1">
                <div className="px-2 pt-1 pb-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#6e807d]">
                    Navigation
                  </span>
                </div>
                {visibleNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
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
                    </Link>
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

            {/* USER PROFILE & LOGOUT FOOTER */}
            <div className="pt-3 border-t border-[#16221f] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#15221e] border border-[#202e2b] flex items-center justify-center font-mono text-xs text-[#a7f3d0] font-bold shrink-0">
                  {currentUser?.display_name?.slice(0, 1).toUpperCase() || "C"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-[#f1f5f4] truncate">
                    {currentUser?.display_name || "Orbit User"}
                  </div>
                  <div className="text-[10px] text-[#6e807d] font-mono capitalize">
                    {currentUser?.role || "member"}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-[#6e807d] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Sign out of Orbit"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
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
                <span className="font-medium text-[#f1f5f4] capitalize">
                  {activeTab === "home" ? "Overview" : activeTab}
                </span>
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

          {/* VIEW SWITCHER / PAGE CONTENT */}
          <div className="flex-1 min-w-0 h-[calc(100vh-3rem)] overflow-hidden relative">
            {children ? (
              children
            ) : (
              <>
                {activeTab === "home" && <HomeDashboard />}
                {activeTab === "universe" && <UniverseCanvas viewMode={universeViewMode} />}
                {activeTab === "tasks" && <TasksView />}
                {activeTab === "notes" && <NotesView />}
                {activeTab === "timeline" && <TimelineView />}
                {activeTab === "analytics" && <AnalyticsView />}
                {activeTab === "users" && <UsersView />}
              </>
            )}
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
