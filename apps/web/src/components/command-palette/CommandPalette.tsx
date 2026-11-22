"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Compass,
  Home,
  CheckSquare,
  BookOpen,
  CalendarDays,
  BarChart3,
  Sparkles,
  ArrowRight,
  Command,
  Plus,
  X,
  Layers,
} from "lucide-react";
import { useWorkspaceStore, NavTab } from "@/stores/workspace-store";
import { commandPaletteVariants } from "@/motion";

const CATEGORIES = ["Navigation", "Actions", "Create"] as const;

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setActiveTab, setAiModalOpen } =
    useWorkspaceStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const COMMANDS = [
    { id: "home", label: "Go to Home Dashboard", icon: Home, category: "Navigation" as const, action: () => setActiveTab("home"), shortcut: "H" },
    { id: "universe", label: "Open Spatial Universe Canvas", icon: Compass, category: "Navigation" as const, action: () => setActiveTab("universe"), shortcut: "U" },
    { id: "tasks", label: "Task Management & Kanban", icon: CheckSquare, category: "Navigation" as const, action: () => setActiveTab("tasks"), shortcut: "T" },
    { id: "notes", label: "Knowledge Base & Notes", icon: BookOpen, category: "Navigation" as const, action: () => setActiveTab("notes"), shortcut: "N" },
    { id: "timeline", label: "Project Timeline & Roadmap", icon: CalendarDays, category: "Navigation" as const, action: () => setActiveTab("timeline"), shortcut: "L" },
    { id: "analytics", label: "Spatial Productivity Analytics", icon: BarChart3, category: "Navigation" as const, action: () => setActiveTab("analytics"), shortcut: "A" },
    { id: "ai", label: "Launch AI Universe Architect", icon: Sparkles, category: "Actions" as const, action: () => setAiModalOpen(true), shortcut: "⌘G" },
    { id: "close", label: "Close Command Palette", icon: X, category: "Actions" as const, action: () => setCommandPaletteOpen(false), shortcut: "ESC" },
  ];

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Group by category
  const grouped = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, typeof COMMANDS>);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setHoveredId(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isCommandPaletteOpen) return null;

  const executeCommand = (action: () => void) => {
    action();
    setCommandPaletteOpen(false);
  };

  const activeCommand = hoveredId
    ? filteredCommands.find((c) => c.id === hoveredId)
    : filteredCommands[selectedIndex];

  return (
    <AnimatePresence>
      {/* Overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
        onClick={() => setCommandPaletteOpen(false)}
      >
        <motion.div
          variants={commandPaletteVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="w-full max-w-xl glass-elevated border border-white/[0.18] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Specular Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

          {/* Search Input Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/[0.10]">
            <Search className="h-4 w-4 text-[#9366FF] mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands, navigate sections..."
              className="flex-1 bg-transparent text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none font-sans"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setCommandPaletteOpen(false);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (filteredCommands.length > 0) {
                    setHoveredId(null);
                    setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
                  }
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (filteredCommands.length > 0) {
                    setHoveredId(null);
                    setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
                  }
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (activeCommand) {
                    executeCommand(activeCommand.action);
                  }
                }
              }}
            />
            <kbd className="px-2 py-0.5 rounded-lg bg-white/[0.06] border border-white/10 text-[10px] font-mono text-slate-400 ml-2">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="p-2 max-h-[380px] overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                No matching commands found for &quot;{query}&quot;
              </div>
            ) : (
              Object.entries(grouped).map(([category, cmds]) => (
                <div key={category} className="mb-3">
                  {/* Category Label */}
                  <div className="px-3 pb-1 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    {category}
                  </div>

                  {/* Commands */}
                  <div className="space-y-0.5">
                    {cmds.map((cmd) => {
                      const Icon = cmd.icon;
                      const isSelected = activeCommand?.id === cmd.id;
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => executeCommand(cmd.action)}
                          onMouseEnter={() => {
                            setHoveredId(cmd.id);
                            const idx = filteredCommands.findIndex((c) => c.id === cmd.id);
                            if (idx >= 0) setSelectedIndex(idx);
                          }}
                          onMouseLeave={() => setHoveredId(null)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-100 text-left group ${
                            isSelected
                              ? "bg-[#9366FF]/25 border border-[#9366FF]/40 shadow-glow-violet/20"
                              : "hover:bg-white/[0.06] border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-1.5 rounded-lg transition-colors ${
                              isSelected
                                ? "bg-[#9366FF]/35 text-white"
                                : "bg-white/[0.05] text-slate-400 group-hover:text-slate-200"
                            }`}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className={`text-xs font-medium truncate ${
                                isSelected ? "text-white" : "text-slate-300"
                              }`}>
                                {cmd.label}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            {cmd.shortcut && (
                              <kbd className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                                isSelected
                                  ? "bg-white/10 border-white/20 text-purple-200"
                                  : "bg-white/[0.06] border-white/10 text-slate-500"
                              }`}>
                                {cmd.shortcut}
                              </kbd>
                            )}
                            <ArrowRight className={`h-3.5 w-3.5 transition-all ${
                              isSelected ? "text-[#38BDF8] translate-x-0.5" : "text-slate-600"
                            }`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Hint */}
          <div className="px-4 py-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-slate-600">
            <span>ORBIT Spatial Command Palette</span>
            <div className="flex items-center gap-2">
              <span>↑↓ navigate</span>
              <span>↵ execute</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
