"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { modalVariants, motionTokens, anticipationVariant } from "@/motion";

export function AiGeneratorModal() {
  const { isAiModalOpen, setAiModalOpen, currentWorkspace, setActiveTab } = useWorkspaceStore();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJob, setGeneratedJob] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isAiModalOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !currentWorkspace?.id) return;
    try {
      setIsGenerating(true);
      const job = await api.generateWorkspacePlan(currentWorkspace.id, prompt.trim());
      setGeneratedJob(job);
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirm = async () => {
    if (!generatedJob?.id || !generatedJob?.result) return;
    try {
      setIsConfirming(true);
      await api.confirmAiJob(generatedJob.id, generatedJob.result);
      setAiModalOpen(false);
      setGeneratedJob(null);
      setPrompt("");
      setActiveTab("universe");
      window.location.reload(); // Refresh canvas with newly materialized nodes
    } catch (err) {
      console.error("Confirmation error:", err);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="w-full max-w-2xl bg-[#11131A] border border-purple-500/30 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">AI Universe Architect</h2>
                <p className="text-[11px] text-slate-400">Structured workspace generation powered by Pydantic models</p>
              </div>
            </div>
            <button
              onClick={() => {
                setAiModalOpen(false);
                setGeneratedJob(null);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form or Preview */}
          {!generatedJob?.result ? (
            <form onSubmit={handleGenerate} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300">Enter your goal or project vision:</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. I want to build a distributed backend microservices architecture with PostgreSQL connection pooling, Redis caching, and real-time observability..."
                  className="w-full mt-2 h-32 px-4 py-3 rounded-2xl bg-[#08090D] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-slate-500 font-mono">Demo engine validated with Pydantic</span>
                <motion.button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] text-xs font-semibold text-white shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span>{isGenerating ? "Synthesizing Blueprint..." : "Generate Roadmap"}</span>
                </motion.button>
              </div>
            </form>
          ) : (
            /* Editable Preview Stage */
            <div className="mt-4 space-y-4 overflow-y-auto max-h-[460px]">
              <div className="p-4 rounded-2xl bg-[#191C26] border border-white/10">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">GENERATED BLUEPRINT</span>
                <h3 className="text-base font-bold text-white mt-1">{generatedJob.result.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{generatedJob.result.description}</p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Synthesized Projects ({generatedJob.result.projects.length})
                </span>
                {generatedJob.result.projects.map((proj: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{proj.title}</span>
                      <span className="text-[10px] font-mono uppercase text-slate-400">{proj.priority}</span>
                    </div>
                    <div className="space-y-1">
                      {proj.tasks.map((task: any, tIdx: number) => (
                        <div key={tIdx} className="text-[11px] text-slate-300 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
                          <span>{task.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => setGeneratedJob(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5"
                >
                  Back to prompt
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  {isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span>Materialize Into Workspace</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
