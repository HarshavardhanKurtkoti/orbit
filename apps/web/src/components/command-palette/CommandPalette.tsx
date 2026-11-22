"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  Compass,
  Home,
  CheckSquare,
  BookOpen,
  CalendarDays,
  BarChart3,
  Sparkles,
  ArrowRight,
  Layers,
  X,
} from "lucide-react";
import { useWorkspaceStore, NavTab } from "@/stores/workspace-store";
import { commandPaletteVariants } from "@/motion";

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setActiveTab,
    setAiModalOpen,
  } = useWorkspaceStore();

  const [query, setQuery] = useState("");

  const COMMANDS = [
    { id: "universe", label: "Go to Universe Canvas", icon: Compass, category: "Navigation", action: () => setActiveTab("universe") },
    { id: "home", label: "Go to Home Dashboard", icon: Home, category: "Navigation", action: () => setActiveTab("home") },
    { id: "tasks", label: "Go to Tasks", icon: CheckSquare, category: "Navigation", action: () => setActiveTab("tasks") },
    { id: "notes", label: "Go to Notes & Knowledge", icon: BookOpen, category: "Navigation", action: () => setActiveTab("notes") },
    { id: "timeline", label: "Go to Timeline", icon: CalendarDays, category: "Navigation", action: () => setActiveTab("timeline") },
    { id: "analytics", label: "Go to Analytics", icon: BarChart3, category: "Navigation", action: () => setActiveTab("analytics") },
    { id: "ai", label: "Launch AI Workspace Generator", icon: Sparkles, category: "Actions", action: () => setAiModalOpen(true) },
  ];

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isCommandPaletteOpen) setQuery("");
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          variants={commandPaletteVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="w-full max-w-xl bg-[#11131A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3 border-b border-white/10">
            <Search className="h-4 w-4 text-slate-400 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or jump to feature..."
              className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Escape") setCommandPaletteOpen(false);
                if (e.key === "Enter" && filteredCommands.length > 0) {
                  filteredCommands[0].action();
                  setCommandPaletteOpen(false);
                }
              }}
            />
            <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="p-2 max-h-80 overflow-y-auto space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No matching commands found.</div>
            ) : (
              filteredCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-[#8B5CF6]/20 group-hover:text-[#8B5CF6] transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{cmd.label}</div>
                        <div className="text-[10px] text-slate-500">{cmd.category}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
