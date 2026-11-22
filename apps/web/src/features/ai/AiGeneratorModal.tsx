"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2, CheckCircle2, ArrowRight, ChevronRight, Zap } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { modalVariants, anticipationVariant } from "@/motion";
import { GlassButton } from "@/components/ui/GlassButton";

export function AiGeneratorModal() {
  const { isAiModalOpen, setAiModalOpen, currentWorkspace, setActiveTab } = useWorkspaceStore();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJob, setGeneratedJob] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isAiModalOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    try {
      setIsGenerating(true);
      let wsId = currentWorkspace?.id;
      if (!wsId || wsId === "ws_prime") {
        const workspaces = await api.listWorkspaces();
        if (workspaces && workspaces.length > 0) {
          wsId = workspaces[0].id;
        }
      }
      const job = await api.generateWorkspacePlan(wsId || "ws_prime", prompt.trim());
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
      window.location.reload();
    } catch (err) {
      console.error("Confirmation error:", err);
    } finally {
      setIsConfirming(false);
    }
  };

  const EXAMPLE_PROMPTS = [
    "Design a distributed microservices architecture with AI reasoning",
    "Build a cross-platform developer productivity suite",
    "Create a spatial knowledge management system with graph intelligence",
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="w-full max-w-2xl glass-elevated border border-white/[0.18] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
        >
          {/* Top Aurora lighting strip */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#9366FF]/60 to-transparent pointer-events-none" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-b from-[#9366FF]/25 to-transparent blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.10] relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#9366FF] to-[#38BDF8] text-white shadow-glow-violet">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="absolute -inset-0.5 rounded-2xl bg-[#9366FF]/30 blur-sm -z-10" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">AI Universe Architect</h2>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Pydantic-validated spatial workspace generation engine
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setAiModalOpen(false);
                setGeneratedJob(null);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="relative z-10">
            {!generatedJob?.result ? (
              /* PROMPT INPUT STAGE */
              <form onSubmit={handleGenerate} className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Describe your project vision or technical goal:
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. I want to build a distributed AI reasoning backend with PostgreSQL connection pooling, Redis caching, and a spatial knowledge graph interface..."
                    className="w-full h-36 px-4 py-3 rounded-2xl bg-[#070914]/80 border border-white/[0.10] hover:border-white/20 focus:border-[#9366FF] text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-sans leading-relaxed resize-none"
                  />
                </div>

                {/* Quick example prompts */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Quick start prompts:
                  </span>
                  <div className="space-y-1.5">
                    {EXAMPLE_PROMPTS.map((ex, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPrompt(ex)}
                        className="w-full text-left px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-[#9366FF]/30 text-xs text-slate-400 hover:text-white transition-all flex items-center gap-2 group"
                      >
                        <ChevronRight className="h-3 w-3 text-[#9366FF] flex-shrink-0" />
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                    <Zap className="h-3 w-3 text-[#9366FF]" />
                    Pydantic validated • PostgreSQL materialization
                  </span>

                  <GlassButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    disabled={isGenerating || !prompt.trim()}
                  >
                    {isGenerating ? "Synthesizing Blueprint..." : "Generate Roadmap"}
                  </GlassButton>
                </div>
              </form>
            ) : (
              /* BLUEPRINT PREVIEW STAGE */
              <div className="p-6 space-y-5">
                {/* Blueprint Summary */}
                <div className="p-4 rounded-2xl bg-[#070914]/70 border border-[#9366FF]/30 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#9366FF]/40 to-transparent" />
                  <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest">GENERATED SPATIAL BLUEPRINT</span>
                  <h3 className="text-base font-bold text-white mt-1">{generatedJob.result.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{generatedJob.result.description}</p>
                </div>

                {/* Synthesized Projects */}
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-3">
                    Synthesized Projects ({generatedJob.result.projects.length})
                  </span>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {generatedJob.result.projects.map((proj: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/15 transition-colors space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">{proj.title}</span>
                          <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                            proj.priority === "urgent"
                              ? "text-rose-300 bg-rose-500/10 border-rose-500/20"
                              : proj.priority === "high"
                              ? "text-purple-300 bg-purple-500/10 border-purple-500/20"
                              : "text-sky-300 bg-sky-500/10 border-sky-500/20"
                          }`}>
                            {proj.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                        <div className="space-y-1.5">
                          {proj.tasks.map((task: any, tIdx: number) => (
                            <div key={tIdx} className="text-[11px] text-slate-300 flex items-center gap-2 font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#9366FF] flex-shrink-0" />
                              <span>{task.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirmation Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                  <button
                    onClick={() => setGeneratedJob(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    ← Back to prompt
                  </button>

                  <GlassButton
                    variant="primary"
                    size="lg"
                    icon={isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    onClick={handleConfirm}
                    disabled={isConfirming}
                  >
                    {isConfirming ? "Materializing..." : "Materialize Into Universe"}
                  </GlassButton>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
