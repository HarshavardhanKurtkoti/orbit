"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Boxes,
  ChevronsUpDown,
  Check,
  Plus,
  Loader2,
  FolderGit2,
  X,
  Sparkles,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export function WorkspaceSelector() {
  const {
    currentWorkspace,
    workspaces,
    setCurrentWorkspace,
    setWorkspaces,
    loadWorkspaceData,
  } = useWorkspaceStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsCreating(false);
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectWorkspace = (ws: any) => {
    if (ws.id === currentWorkspace?.id) {
      setIsOpen(false);
      return;
    }
    setCurrentWorkspace(ws);
    setIsOpen(false);
    setIsCreating(false);
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    try {
      setIsSubmitting(true);
      const created = await api.createWorkspace({
        name: newWorkspaceName.trim(),
        description: newWorkspaceDesc.trim() || undefined,
      });

      const updated = [created, ...workspaces.filter((w) => w.id !== created.id)];
      setWorkspaces(updated);
      setCurrentWorkspace(created);
      await loadWorkspaceData(created.id);

      setNewWorkspaceName("");
      setNewWorkspaceDesc("");
      setIsCreating(false);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to create workspace:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* MAIN TRIGGER BUTTON */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setIsCreating(false);
        }}
        className={`
          w-full px-2.5 py-2 rounded-lg text-left transition-all duration-150 flex items-center justify-between group
          ${
            isOpen
              ? "bg-[#15221e] border border-[#a7f3d0]/40 text-[#f1f5f4]"
              : "bg-[#0b1312] border border-[#202e2b] hover:border-[#334641] text-[#9aaba8] hover:text-[#f1f5f4]"
          }
        `}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-md bg-[#15221e] border border-[#202e2b] flex items-center justify-center text-[#a7f3d0] shrink-0 group-hover:border-[#a7f3d0]/40 transition-colors">
            <Boxes className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-[#f1f5f4] truncate leading-tight">
              {currentWorkspace?.name || "Orbit Workspace"}
            </div>
            <div className="text-[10px] text-[#6e807d] font-mono tracking-tight flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
              <span className="truncate">Active Workspace</span>
            </div>
          </div>
        </div>

        <ChevronsUpDown className="h-3.5 w-3.5 text-[#6e807d] shrink-0 ml-1.5 group-hover:text-[#9aaba8]" />
      </button>

      {/* DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-[#101918]/95 backdrop-blur-xl border border-[#202e2b] shadow-2xl p-2 space-y-2 overflow-hidden max-h-[360px] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-2 pt-1 pb-1 border-b border-[#16221f]">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#6e807d]">
                Workspaces ({workspaces.length})
              </span>
              <span className="text-[9px] font-mono text-[#a7f3d0]">Switch Plan</span>
            </div>

            {/* List of Workspaces */}
            <div className="space-y-1 overflow-y-auto max-h-48 pr-0.5">
              {workspaces.map((ws) => {
                const isActive = ws.id === currentWorkspace?.id;
                return (
                  <button
                    key={ws.id}
                    onClick={() => handleSelectWorkspace(ws)}
                    className={`
                      w-full px-2.5 py-2 rounded-lg text-left transition-all duration-120 flex items-center justify-between group
                      ${
                        isActive
                          ? "bg-[#15221e] border border-[#202e2b] text-[#f1f5f4]"
                          : "text-[#9aaba8] hover:text-[#f1f5f4] hover:bg-[#15221e]/50 border border-transparent"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FolderGit2
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isActive ? "text-[#a7f3d0]" : "text-[#6e807d] group-hover:text-[#9aaba8]"
                        }`}
                      />
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-medium truncate ${
                            isActive ? "text-[#a7f3d0]" : "text-[#f1f5f4]"
                          }`}
                        >
                          {ws.name}
                        </div>
                        {ws.description && (
                          <div className="text-[10px] text-[#6e807d] truncate font-sans">
                            {ws.description}
                          </div>
                        )}
                      </div>
                    </div>

                    {isActive && (
                      <Check className="h-3.5 w-3.5 text-[#a7f3d0] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* CREATE WORKSPACE SECTION */}
            <div className="pt-2 border-t border-[#16221f]">
              {!isCreating ? (
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#a7f3d0] hover:bg-[#15221e] border border-dashed border-[#202e2b] hover:border-[#a7f3d0]/40 flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Workspace</span>
                </button>
              ) : (
                <form onSubmit={handleCreateWorkspace} className="space-y-2 p-1 bg-[#0b1312] rounded-lg border border-[#202e2b]">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#a7f3d0]">
                      Create Workspace
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="text-[#6e807d] hover:text-[#f1f5f4]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Workspace Name (e.g. Plan B)"
                    autoFocus
                    className="w-full px-2.5 py-1.5 rounded bg-[#101918] border border-[#202e2b] focus:border-[#a7f3d0] text-xs text-[#f1f5f4] placeholder-[#6e807d] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newWorkspaceDesc}
                    onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full px-2.5 py-1 rounded bg-[#101918] border border-[#202e2b] focus:border-[#a7f3d0] text-[11px] text-[#f1f5f4] placeholder-[#6e807d] focus:outline-none"
                  />
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="px-2 py-1 text-[10px] font-mono text-[#6e807d] hover:text-[#f1f5f4]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !newWorkspaceName.trim()}
                      className="px-2.5 py-1 rounded bg-[#15221e] hover:bg-[#1c2e29] border border-[#a7f3d0]/40 text-[#a7f3d0] text-[11px] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                      <span>Create</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
