"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Save,
  Search,
  Bold,
  Italic,
  Heading1,
  List,
  Code,
  Clock,
  Tag,
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { GlassButton } from "@/components/ui/GlassButton";

export function NotesView() {
  const { currentWorkspace, notes: storeNotes, setNotes: setStoreNotes } = useWorkspaceStore();
  const [notes, setNotes] = useState<any[]>(storeNotes);
  const [selectedNote, setSelectedNote] = useState<any>(storeNotes[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState(storeNotes[0]?.title || "");
  const [content, setContent] = useState(storeNotes[0]?.content || "");
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (storeNotes && storeNotes.length > 0) {
      setNotes(storeNotes);
      if (!selectedNote) {
        setSelectedNote(storeNotes[0]);
        setTitle(storeNotes[0].title);
        setContent(storeNotes[0].content);
      }
    }
  }, [storeNotes, selectedNote]);

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function fetchNotes() {
      try {
        const data = await api.listNotes(currentWorkspace.id);
        setNotes(data);
        setStoreNotes(data);
        if (data.length > 0 && !selectedNote) {
          setSelectedNote(data[0]);
          setTitle(data[0].title);
          setContent(data[0].content);
        }
      } catch (err) {
        console.error("Notes load error:", err);
      }
    }
    fetchNotes();
  }, [currentWorkspace?.id, setStoreNotes, selectedNote]);

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
        content: `# Untitled Knowledge Spec\n\nDocument your architectural decisions, data schemas, and systems design notes here...`,
        tags: ["architecture", "spec"],
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

  const insertFormatting = (prefix: string, suffix: string = "") => {
    setContent((prev: string) => `${prev}\n${prefix}Text${suffix}`);
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
    <div className="h-full w-full flex flex-col md:flex-row overflow-hidden bg-[#080d10] text-[#f1f5f4]">
      {/* 1. LEFT PANEL: Note Navigation Rail */}
      <div className="w-full md:w-72 border-r border-[#202e2b] bg-[#101918]/60 flex flex-col p-3.5 space-y-3 flex-shrink-0">
        {/* Header & Create Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-[#15221e] text-[#fbbf24] border border-[#202e2b]">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#f1f5f4] font-medium">
              Knowledge Base
            </h2>
          </div>

          <GlassButton
            variant="primary"
            size="sm"
            onClick={handleCreateNote}
            icon={<Plus className="h-3 w-3" />}
          >
            New
          </GlassButton>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="h-3.5 w-3.5 text-[#6e807d] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs text-[#f1f5f4] placeholder-[#6e807d] focus:outline-none focus:border-[#a7f3d0]"
          />
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {filteredNotes.map((note) => {
            const isSelected = selectedNote?.id === note.id;
            return (
              <button
                key={note.id}
                onClick={() => handleSelectNote(note)}
                className={`w-full p-2.5 rounded-lg text-left transition-all flex flex-col gap-1 border ${
                  isSelected
                    ? "bg-[#15221e] border-[#202e2b] text-[#f1f5f4]"
                    : "bg-transparent border-transparent text-[#9aaba8] hover:text-[#f1f5f4] hover:bg-[#15221e]/40"
                }`}
              >
                <div className="text-xs font-semibold truncate leading-snug">
                  {note.title || "Untitled Note"}
                </div>
                <div className="text-[10px] text-[#6e807d] font-mono truncate line-clamp-1">
                  {note.content?.slice(0, 50) || "Empty document"}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[9px] font-mono text-[#6e807d]">
                  <span>{new Date(note.created_at || Date.now()).toLocaleDateString()}</span>
                  {note.tags && note.tags[0] && (
                    <span className="px-1.5 py-0.2 rounded bg-[#0b1312] border border-[#202e2b]">
                      #{note.tags[0]}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. RIGHT PANEL: Document Editor */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#080d10]">
        {selectedNote ? (
          <>
            {/* Editor Top Toolbar */}
            <div className="px-5 py-3 border-b border-[#202e2b] bg-[#101918]/80 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-[#9aaba8]">
                <button
                  onClick={() => insertFormatting("## ")}
                  className="p-1.5 rounded hover:bg-[#15221e] hover:text-[#f1f5f4] transition-colors"
                  title="Heading"
                >
                  <Heading1 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => insertFormatting("**", "**")}
                  className="p-1.5 rounded hover:bg-[#15221e] hover:text-[#f1f5f4] transition-colors"
                  title="Bold"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => insertFormatting("*", "*")}
                  className="p-1.5 rounded hover:bg-[#15221e] hover:text-[#f1f5f4] transition-colors"
                  title="Italic"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => insertFormatting("```\n", "\n```")}
                  className="p-1.5 rounded hover:bg-[#15221e] hover:text-[#f1f5f4] transition-colors"
                  title="Code block"
                >
                  <Code className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => insertFormatting("- ")}
                  className="p-1.5 rounded hover:bg-[#15221e] hover:text-[#f1f5f4] transition-colors"
                  title="List"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono text-[#6e807d]">
                  {isSaved ? "Saved" : "Unsaved changes"}
                </span>
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={handleSaveNote}
                  disabled={isSaving || isSaved}
                  icon={<Save className="h-3 w-3" />}
                >
                  {isSaving ? "Saving..." : "Save"}
                </GlassButton>
              </div>
            </div>

            {/* Document Header & Textarea */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setIsSaved(false);
                }}
                placeholder="Note title..."
                className="w-full bg-transparent text-2xl md:text-3xl font-medium tracking-tight text-[#f1f5f4] focus:outline-none placeholder-[#6e807d] font-sans"
              />

              <div className="flex items-center gap-3 text-[10px] font-mono text-[#6e807d] pb-3 border-b border-[#16221f]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {readTime} min read
                </span>
                <span>•</span>
                <span>{wordCount} words</span>
                <span>•</span>
                <span>Markdown supported</span>
              </div>

              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setIsSaved(false);
                }}
                placeholder="Start writing documentation, system architecture notes, or specifications..."
                className="w-full h-[calc(100vh-260px)] bg-transparent text-xs md:text-sm text-[#d6dedc] leading-relaxed focus:outline-none placeholder-[#6e807d] font-mono resize-none"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#6e807d] font-mono text-xs">
            <BookOpen className="h-8 w-8 mb-2 opacity-40 text-[#a7f3d0]" />
            <p>Select a note or create a new document</p>
          </div>
        )}
      </div>
    </div>
  );
}
