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
  X,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { commandPaletteVariants } from "@/motion";

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setActiveTab, setAiModalOpen } =
    useWorkspaceStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const COMMANDS = [
    { id: "home", label: "Overview", icon: Home, category: "Navigation", action: () => setActiveTab("home"), shortcut: "H" },
    { id: "universe", label: "Knowledge Universe", icon: Compass, category: "Navigation", action: () => setActiveTab("universe"), shortcut: "U" },
    { id: "tasks", label: "Tasks & Execution", icon: CheckSquare, category: "Navigation", action: () => setActiveTab("tasks"), shortcut: "T" },
    { id: "notes", label: "Notes & Knowledge Base", icon: BookOpen, category: "Navigation", action: () => setActiveTab("notes"), shortcut: "N" },
    { id: "timeline", label: "Project Roadmap", icon: CalendarDays, category: "Navigation", action: () => setActiveTab("timeline"), shortcut: "L" },
    { id: "analytics", label: "Workspace Analytics", icon: BarChart3, category: "Navigation", action: () => setActiveTab("analytics"), shortcut: "A" },
    { id: "ai", label: "Plan with AI Architect", icon: Sparkles, category: "Actions", action: () => setAiModalOpen(true), shortcut: "⌘G" },
    { id: "close", label: "Close Menu", icon: X, category: "Actions", action: () => setCommandPaletteOpen(false), shortcut: "ESC" },
  ];

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="fixed inset-0 z-50 bg-[#080d10]/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
        onClick={() => setCommandPaletteOpen(false)}
      >
        <motion.div
          variants={commandPaletteVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="w-full max-w-lg glass-elevated border border-[#202e2b] rounded-xl shadow-2xl overflow-hidden flex flex-col bg-[#101918]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top highlight line */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#a7f3d0]/30 to-transparent pointer-events-none" />

          {/* Search Input Header */}
          <div className="flex items-center px-4 py-3 border-b border-[#202e2b] bg-[#0b1312]">
            <Search className="h-4 w-4 text-[#a7f3d0] mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search views, actions, or jump to..."
              className="flex-1 bg-transparent text-xs text-[#f1f5f4] placeholder-[#6e807d] focus:outline-none font-sans"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setCommandPaletteOpen(false);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (filteredCommands.length > 0) {
                    setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
                  }
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (filteredCommands.length > 0) {
                    setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
                  }
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (filteredCommands[selectedIndex]) {
                    executeCommand(filteredCommands[selectedIndex].action);
                  }
                }
              }}
            />
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#15221e] border border-[#202e2b] text-[#6e807d]">
              ESC
            </kbd>
          </div>

          {/* Command list */}
          <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
            {filteredCommands.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#6e807d] font-mono">
                No matching actions
              </div>
            ) : (
              filteredCommands.map((cmd, idx) => {
                const isSelected = selectedIndex === idx || hoveredId === cmd.id;
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd.action)}
                    onMouseEnter={() => {
                      setHoveredId(cmd.id);
                      setSelectedIndex(idx);
                    }}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between text-left transition-colors ${
                      isSelected
                        ? "bg-[#15221e] text-[#f1f5f4] border border-[#202e2b]"
                        : "text-[#9aaba8] hover:text-[#f1f5f4] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isSelected ? "text-[#a7f3d0]" : "text-[#6e807d]"}`} />
                      <span>{cmd.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-[#6e807d] uppercase tracking-wider">
                        {cmd.category}
                      </span>
                      {cmd.shortcut && (
                        <kbd className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0b1312] border border-[#202e2b] text-[#9aaba8]">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
