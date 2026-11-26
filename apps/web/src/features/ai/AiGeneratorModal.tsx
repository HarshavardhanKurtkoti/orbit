"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { api } from "@/lib/api";
import { modalVariants } from "@/motion";
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
      await api.confirmAiJob(generatedJob.id, generatedJob.result, currentWorkspace?.id);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080d10]/80 backdrop-blur-sm">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="w-full max-w-xl glass-elevated border border-[#202e2b] rounded-xl shadow-2xl overflow-hidden flex flex-col relative bg-[#101918]"
        >
          {/* Top highlight line */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#a7f3d0]/30 to-transparent pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#202e2b]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#15221e] text-[#a7f3d0] border border-[#202e2b]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#f1f5f4] tracking-tight">AI Architect</h2>
                <p className="text-[10px] text-[#6e807d] font-mono">
                  Autonomous workspace planning and project decomposition
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setAiModalOpen(false);
                setGeneratedJob(null);
              }}
              className="p-1 rounded text-[#9aaba8] hover:text-[#f1f5f4] hover:bg-[#15221e] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div>
            {!generatedJob?.result ? (
              /* PROMPT INPUT STAGE */
              <form onSubmit={handleGenerate} className="p-5 space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#6e807d] block mb-1.5">
                    Project Vision & Technical Goal
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to build (e.g. distributed cache, RAG observability pipeline, developer toolkit)..."
                    className="w-full h-28 px-3 py-2 rounded-lg bg-[#0b1312] border border-[#202e2b] focus:border-[#a7f3d0] text-xs text-[#f1f5f4] placeholder-[#6e807d] focus:outline-none transition-colors font-sans leading-relaxed resize-none"
                  />
                </div>

                {/* Example prompt pills */}
                <div>
                  <span className="text-[10px] font-mono text-[#6e807d] block mb-1.5">
                    Example blueprints:
                  </span>
                  <div className="space-y-1">
                    {EXAMPLE_PROMPTS.map((ex, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPrompt(ex)}
                        className="w-full text-left px-2.5 py-1.5 rounded bg-[#0b1312] border border-[#16221f] text-[11px] text-[#9aaba8] hover:text-[#f1f5f4] hover:border-[#202e2b] transition-colors truncate block"
                      >
                        → {ex}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#16221f]">
                  <span className="text-[10px] font-mono text-[#6e807d]">
                    Structured JSON decomposition
                  </span>
                  <GlassButton
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isGenerating || !prompt.trim()}
                    icon={
                      isGenerating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )
                    }
                  >
                    {isGenerating ? "Synthesizing..." : "Generate Plan"}
                  </GlassButton>
                </div>
              </form>
            ) : (
              /* PLAN REVIEW STAGE */
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#34d399] bg-[#34d399]/10 p-2.5 rounded-lg border border-[#34d399]/20">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>Blueprint generated successfully. Review the proposed project breakdown.</span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                  <div className="p-3 rounded-lg bg-[#0b1312] border border-[#202e2b]">
                    <h3 className="text-xs font-semibold text-[#f1f5f4]">
                      {generatedJob.result.project?.title || "Proposed Project"}
                    </h3>
                    <p className="text-[11px] text-[#9aaba8] mt-1 leading-relaxed">
                      {generatedJob.result.project?.description}
                    </p>
                  </div>

                  {generatedJob.result.tasks && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#6e807d]">
                        Proposed Tasks ({generatedJob.result.tasks.length})
                      </span>
                      {generatedJob.result.tasks.slice(0, 5).map((t: any, i: number) => (
                        <div
                          key={i}
                          className="px-2.5 py-1.5 rounded bg-[#0b1312] border border-[#16221f] text-xs text-[#d6dedc] flex items-center justify-between"
                        >
                          <span className="truncate">{t.title}</span>
                          <span className="text-[9px] font-mono uppercase text-[#a7f3d0]">
                            {t.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#16221f]">
                  <button
                    type="button"
                    onClick={() => setGeneratedJob(null)}
                    className="text-xs font-mono text-[#9aaba8] hover:text-[#f1f5f4]"
                  >
                    Back to edit
                  </button>
                  <GlassButton
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={isConfirming}
                    onClick={handleConfirm}
                    icon={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    {isConfirming ? "Materializing..." : "Apply to Workspace"}
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
