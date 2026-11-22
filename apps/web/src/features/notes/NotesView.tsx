"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Plus,
  Tag,
  Save,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  Code,
  Copy,
  Trash2,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassButton } from "@/components/ui/GlassButton";
import { EmptyState } from "@/components/ui/EmptyState";

export function NotesView() {
  const { currentWorkspace } = useWorkspaceStore();
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function fetchNotes() {
      try {
        const data = await api.listNotes(currentWorkspace.id);
        setNotes(data);
        if (data.length > 0) {
          setSelectedNote(data[0]);
          setTitle(data[0].title);
          setContent(data[0].content);
        }
      } catch (err) {
        console.error("Notes load error:", err);
      }
    }
    fetchNotes();
  }, [currentWorkspace?.id]);

  const handleSelectNote = (note: any) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsSaved(true);
  };

  const handleCreateNote = async () => {
    const wsId = currentWorkspace?.id || "ws_prime";
    try {
      const created = await api.createNote({
        workspace_id: wsId,
        title: "Untitled Knowledge Spec",
        content: `# Untitled Knowledge Spec

Draft your architecture decisions and spatial specifications here...`,
        tags: ["architecture", "spatial"],
      });
      setNotes([created, ...notes]);
      setSelectedNote(created);
      setTitle(created.title);
      setContent(created.content);
      setIsSaved(true);
    } catch (err) {
      console.error("Create note error:", err);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;
    try {
      setIsSaving(true);
      await api.updateNote(selectedNote.id, { title, content });
      selectedNote.title = title;
      selectedNote.content = content;
      setNotes((prev) =>
        prev.map((n) => (n.id === selectedNote.id ? { ...n, title, content } : n))
      );
      setIsSaved(true);
    } catch (err) {
      console.error("Save note error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Insert markdown helper tokens
  const insertFormatting = (prefix: string, suffix: string = "") => {
    setContent((prev) => `${prev}\n${prefix}Text${suffix}`);
    setIsSaved(false);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="h-full w-full flex flex-col md:flex-row overflow-hidden bg-[#070914] text-[#F8FAFC]">
      {/* 1. LEFT PANEL: Glass Note Navigation Rail */}
      <div className="w-full md:w-80 border-r border-white/[0.08] bg-[#101426]/50 backdrop-blur-xl flex flex-col p-4 space-y-4">
        {/* Header & Create Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
              <BookOpen className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide">Knowledge Base</h2>
          </div>

          <GlassButton
            variant="primary"
            size="sm"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={handleCreateNote}
          >
            New Note
          </GlassButton>
        </div>

        {/* Search Notes Input */}
        <div className="relative">
          <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#9366FF] transition-colors"
          />
        </div>

        {/* Note Cards List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredNotes.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              No notes found.
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all duration-150 border ${
                    isSelected
                      ? "glass-elevated border-amber-400/40 shadow-glow-violet/20"
                      : "bg-white/[0.02] hover:bg-white/[0.05] border-transparent hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isSelected ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {note.title || "Untitled"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {note.content?.replace(/<[^>]*>?/gm, "").replace(/#/g, "") || "Empty note"}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {note.tags?.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-white/5 text-slate-400 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. MAIN PANEL: Focused Writing Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#070914]/70">
        {selectedNote ? (
          <div className="flex-1 flex flex-col h-full max-w-4xl w-full mx-auto p-6 md:p-10 space-y-4 overflow-y-auto">
            {/* Top Toolbar: Formats and Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              {/* Rich Text Format Buttons */}
              <div className="flex items-center gap-1 p-1 rounded-xl glass-subtle border-white/10">
                <button
                  onClick={() => insertFormatting("## ")}
                  title="Heading 2"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Heading2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => insertFormatting("**", "**")}
                  title="Bold"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  onClick={() => insertFormatting("*", "*")}
                  title="Italic"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  onClick={() => insertFormatting("- ")}
                  title="List"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => insertFormatting("```\n", "\n```")}
                  title="Code Block"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Code className="h-4 w-4" />
                </button>
              </div>

              {/* Document Metadata & Autosave Indicator */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-500 hidden sm:inline">
                  {wordCount} words • {readTime} min read
                </span>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSaved ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                    }`}
                  />
                  <span>{isSaved ? "Saved to mesh" : "Unsaved changes"}</span>
                </div>

                <GlassButton
                  variant="primary"
                  size="sm"
                  icon={<Save className="h-3.5 w-3.5" />}
                  onClick={handleSaveNote}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </GlassButton>
              </div>
            </div>

            {/* Editable Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsSaved(false);
              }}
              placeholder="Note Title..."
              className="w-full bg-transparent text-2xl md:text-3xl font-extrabold text-white placeholder-slate-600 focus:outline-none tracking-tight font-sans pt-2"
            />

            {/* Note Tags */}
            <div className="flex items-center gap-2 pb-2">
              <Tag className="h-3.5 w-3.5 text-amber-400" />
              {selectedNote.tags?.map((t: string) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Distraction-Free Spacious Writing Surface */}
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setIsSaved(false);
              }}
              placeholder="Draft your architectural decisions, research notes, and specs..."
              className="w-full flex-1 min-h-[460px] bg-transparent text-slate-200 text-sm leading-relaxed focus:outline-none resize-none font-sans p-1 selection:bg-[#9366FF]/30"
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-6">
            <EmptyState
              title="No Knowledge Note Selected"
              description="Choose a note from the navigation rail or create a new spatial document to capture your ideas."
              actionLabel="Create Note"
              onAction={handleCreateNote}
            />
          </div>
        )}
      </div>
    </div>
  );
}
