"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, Plus, Tag, Save } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";

export function NotesView() {
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [newTitle, setNewTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!currentWorkspace?.id) return;
    async function fetchNotes() {
      try {
        const data = await api.listNotes(currentWorkspace.id);
        setNotes(data);
        if (data.length > 0) {
          setSelectedNote(data[0]);
          setContent(data[0].content);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchNotes();
  }, [currentWorkspace?.id]);

  const handleCreateNote = async () => {
    if (!currentWorkspace?.id) return;
    try {
      const created = await api.createNote({
        workspace_id: currentWorkspace.id,
        title: "Untitled Note",
        content: "<p>Start drafting your documentation here...</p>",
        tags: ["general"],
      });
      setNotes([created, ...notes]);
      setSelectedNote(created);
      setContent(created.content);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;
    try {
      await api.updateNote(selectedNote.id, { content });
      selectedNote.content = content;
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* Sidebar List */}
      <div className="w-72 border-r border-white/5 bg-[#08090D] flex flex-col justify-between p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-400" />
              Notes & Knowledge
            </h2>
            <button
              onClick={handleCreateNote}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  setSelectedNote(note);
                  setContent(note.content);
                }}
                className={`p-3 rounded-xl cursor-pointer transition-colors ${
                  selectedNote?.id === note.id ? "bg-[#191C26] border border-amber-400/30" : "hover:bg-white/5"
                }`}
              >
                <div className="text-xs font-semibold text-white truncate">{note.title}</div>
                <div className="flex gap-1 mt-1.5">
                  {note.tags?.map((t: string) => (
                    <span key={t} className="text-[9px] font-mono text-slate-500">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Main */}
      <div className="flex-1 bg-[#11131A] flex flex-col p-8 overflow-y-auto">
        {selectedNote ? (
          <div className="max-w-3xl w-full mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h1 className="text-xl font-bold text-white">{selectedNote.title}</h1>
              <button
                onClick={handleSaveNote}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-medium text-black flex items-center gap-1.5 transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                Save Note
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              className="w-full h-[500px] bg-transparent text-slate-200 text-sm focus:outline-none resize-none font-sans leading-relaxed"
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">Select or create a note.</div>
        )}
      </div>
    </div>
  );
}
