"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  Activity,
  Zap,
} from "lucide-react";

const PROMPT = "Deconstruct distributed neural cluster and map 3D spatial coordinates";
const TICK_MS = 40;
const EXIT_MS = 400;

type Scene = "synthesis" | "graph" | "security";

interface SceneConfig {
  id: Scene;
  label: string;
  duration: number;
}

const SCENES: SceneConfig[] = [
  { id: "synthesis", label: "AI Synthesis", duration: 9600 },
  { id: "graph", label: "Spatial Graph", duration: 8800 },
  { id: "security", label: "JWT Security", duration: 7600 },
];

// Timeline milestones for Scene 1 (synthesis)
const TYPE_START = 400;
const TYPE_MS_PER_CHAR = 32;
const TYPED_AT = TYPE_START + PROMPT.length * TYPE_MS_PER_CHAR;
const SYNTHESIZE_AT = TYPED_AT + 600;
const PROGRESS_MS = 2200;
const ENTITIES_AT = SYNTHESIZE_AT + PROGRESS_MS + 200;

function easeOutCubic(t: number): number {
  const clamped = Math.min(Math.max(t, 0), 1);
  return 1 - Math.pow(1 - clamped, 3);
}

export function SpatialDemoPanel() {
  const [sceneIndex, setSceneIndex] = React.useState(0);
  const [t, setT] = React.useState(0);
  const [loop, setLoop] = React.useState(0);

  // Auto-playing demo clock
  React.useEffect(() => {
    let start = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      let elapsed = now - start;
      const currentDuration = SCENES[sceneIndex].duration;

      if (elapsed >= currentDuration) {
        setSceneIndex((prev) => (prev + 1) % SCENES.length);
        if (sceneIndex === SCENES.length - 1) setLoop((l) => l + 1);
        start = performance.now();
        elapsed = 0;
      }
      setT(elapsed);
    }, TICK_MS);

    return () => window.clearInterval(timer);
  }, [sceneIndex]);

  const currentScene = SCENES[sceneIndex].id;

  return (
    <div className="relative flex w-full h-full min-h-[580px] flex-col justify-between overflow-hidden rounded-3xl border border-[#202e2b] bg-[#0c1413]/90 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
      {/* Background Animated Radial Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, #34d399 0%, #059669 40%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-[450px] w-[450px] rounded-full blur-3xl opacity-15"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, #0284c7 40%, transparent 70%)",
        }}
      />

      {/* TOP HEADER */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15221e] border border-[#202e2b] text-[10px] font-mono text-[#a7f3d0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-ping" />
          <span>SPATIAL ENGINE • 60 FPS REACTIVE CANVAS</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#f1f5f4] leading-snug">
          Next-Generation Spatial OS & Knowledge Graph
        </h2>
        <p className="text-xs text-[#9aaba8] leading-relaxed max-w-lg">
          Autonomous AI workspace synthesis, interactive 60fps visionOS coordinate graphs, and cryptographic JWT session rotation backed by Neon Serverless PostgreSQL.
        </p>
      </div>

      {/* CENTER INTERACTIVE DEMO STAGE */}
      <div className="relative z-10 my-6 flex-1 flex items-center justify-center min-h-[300px]">
        <AnimatePresence mode="wait">
          {currentScene === "synthesis" && (
            <motion.div
              key={`scene-synthesis-${loop}`}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md space-y-3"
            >
              <SynthesisScene t={t} />
            </motion.div>
          )}

          {currentScene === "graph" && (
            <motion.div
              key={`scene-graph-${loop}`}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md space-y-3"
            >
              <GraphScene t={t} />
            </motion.div>
          )}

          {currentScene === "security" && (
            <motion.div
              key={`scene-security-${loop}`}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md space-y-3"
            >
              <SecurityScene t={t} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM SCENE SELECTOR PILLS */}
      <div className="relative z-10 pt-4 border-t border-[#202e2b]/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {SCENES.map((s, idx) => {
            const isActive = sceneIndex === idx;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setSceneIndex(idx);
                  setT(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#15221e] text-[#a7f3d0] border border-[#a7f3d0]/30 shadow-sm"
                    : "text-[#6e807d] hover:text-[#d6dedc] border border-transparent"
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full ${
                    isActive ? "bg-[#34d399]" : "bg-[#6e807d]"
                  }`}
                />
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-[#6e807d]">
          Scene {sceneIndex + 1} / {SCENES.length}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// SCENE 1: AI SPATIAL SYNTHESIZER
// ----------------------------------------------------------------------------
function SynthesisScene({ t }: { t: number }) {
  const typedCount = Math.min(
    Math.max(Math.floor((t - TYPE_START) / TYPE_MS_PER_CHAR), 0),
    PROMPT.length
  );
  const typedText = PROMPT.slice(0, typedCount);
  const isTyping = t < TYPED_AT;
  const isSynthesizing = t >= SYNTHESIZE_AT && t < ENTITIES_AT;
  const isEntitiesReady = t >= ENTITIES_AT;

  const progressFraction = Math.min(
    Math.max((t - SYNTHESIZE_AT) / PROGRESS_MS, 0),
    1
  );
  const percent = Math.round(easeOutCubic(progressFraction) * 94);

  return (
    <div className="space-y-2.5">
      {/* Prompt Composer Box */}
      <div className="p-3.5 rounded-xl bg-[#101918] border border-[#202e2b] shadow-inner space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#6e807d]">
          <span className="flex items-center gap-1.5 text-[#a7f3d0]">
            <Sparkles className="h-3 w-3" />
            AI Spatial Prompt
          </span>
          <span>OpenRouter Nemotron</span>
        </div>
        <div className="min-h-[42px] font-mono text-xs text-[#f1f5f4] leading-relaxed">
          {typedText}
          {isTyping && <span className="inline-block w-1.5 h-3.5 bg-[#a7f3d0] ml-0.5 animate-pulse" />}
        </div>
      </div>

      {/* Progress / Status banner */}
      {isSynthesizing && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-[#15221e] border border-[#202e2b] space-y-1.5"
        >
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#a7f3d0] flex items-center gap-1.5">
              <RefreshCw className="h-3 w-3 animate-spin text-[#34d399]" />
              Synthesizing Spatial Entities...
            </span>
            <span className="text-[#f1f5f4]">{percent}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#0b1312] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#059669] via-[#34d399] to-[#a7f3d0] transition-all duration-75"
              style={{ width: `${percent}%` }}
            />
          </div>
        </motion.div>
      )}

      {/* Generated Entities Stack */}
      {isEntitiesReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-2.5 rounded-lg bg-[#15221e]/80 border border-[#202e2b] flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a7f3d0]" />
              <span className="text-xs font-medium text-[#f1f5f4]">Quantum Neural Engine</span>
            </div>
            <span className="text-[10px] font-mono text-[#a7f3d0] px-1.5 py-0.5 rounded bg-[#101918] border border-[#202e2b]">
              Z: +420
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-2.5 rounded-lg bg-[#15221e]/80 border border-[#202e2b] flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
              <span className="text-xs font-medium text-[#f1f5f4]">Orbital Spatial Canvas</span>
            </div>
            <span className="text-[10px] font-mono text-[#38bdf8] px-1.5 py-0.5 rounded bg-[#101918] border border-[#202e2b]">
              Shaders 92%
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-2.5 rounded-lg bg-[#15221e]/80 border border-[#202e2b] flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
              <span className="text-xs font-medium text-[#f1f5f4]">Cosmic Telemetry Node</span>
            </div>
            <span className="text-[10px] font-mono text-[#fbbf24] px-1.5 py-0.5 rounded bg-[#101918] border border-[#202e2b]">
              0.4ms
            </span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// SCENE 2: INTERACTIVE BI-DIRECTIONAL GRAPH PREVIEW
// ----------------------------------------------------------------------------
function GraphScene({ t }: { t: number }) {
  const pulse = Math.sin(t / 400) * 0.15 + 0.85;

  return (
    <div className="p-4 rounded-2xl bg-[#101918] border border-[#202e2b] space-y-3">
      {/* Top Coordinate Bar */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#9aaba8] flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-[#a7f3d0]" />
          Knowledge Topology
        </span>
        <span className="text-[10px] font-mono text-[#a7f3d0] bg-[#15221e] px-2 py-0.5 rounded border border-[#202e2b]">
          [X: +420, Y: -180, Z: 60FPS]
        </span>
      </div>

      {/* SVG Canvas Simulation */}
      <div className="relative h-44 w-full rounded-xl bg-[#080d10] border border-[#202e2b] overflow-hidden flex items-center justify-center">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#202e2b 1px, transparent 1px), linear-gradient(90deg, #202e2b 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Animated Connecting Edges with dashed particle flow */}
          <line
            x1="200"
            y1="88"
            x2="80"
            y2="45"
            stroke="#202e2b"
            strokeWidth="2"
          />
          <line
            x1="200"
            y1="88"
            x2="320"
            y2="50"
            stroke="#34d399"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
          <line
            x1="200"
            y1="88"
            x2="100"
            y2="135"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <line
            x1="200"
            y1="88"
            x2="300"
            y2="130"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Center Root Node */}
        <div
          className="absolute z-20 flex flex-col items-center cursor-pointer transition-transform duration-100"
          style={{ transform: `scale(${pulse})` }}
        >
          <div className="w-8 h-8 rounded-full bg-[#15221e] border-2 border-[#a7f3d0] flex items-center justify-center shadow-lg shadow-[#a7f3d0]/20">
            <Compass className="h-4 w-4 text-[#a7f3d0]" />
          </div>
          <span className="text-[9px] font-mono text-[#f1f5f4] mt-1 bg-[#101918]/80 px-1.5 rounded">
            Cosmos Prime
          </span>
        </div>

        {/* Satellite Nodes */}
        <div className="absolute left-10 top-5 z-10 flex items-center gap-1 bg-[#15221e] px-2 py-0.5 rounded-full border border-[#202e2b] text-[9px] font-mono text-[#9aaba8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a7f3d0]" />
          Neural Engine
        </div>

        <div className="absolute right-8 top-6 z-10 flex items-center gap-1 bg-[#15221e] px-2 py-0.5 rounded-full border border-[#202e2b] text-[9px] font-mono text-[#34d399]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
          Spatial Canvas
        </div>

        <div className="absolute left-12 bottom-6 z-10 flex items-center gap-1 bg-[#15221e] px-2 py-0.5 rounded-full border border-[#202e2b] text-[9px] font-mono text-[#38bdf8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
          Synapse Protocol
        </div>

        <div className="absolute right-10 bottom-7 z-10 flex items-center gap-1 bg-[#15221e] px-2 py-0.5 rounded-full border border-[#202e2b] text-[9px] font-mono text-[#fbbf24]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
          Telemetry
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-1.5 rounded-lg bg-[#15221e] border border-[#202e2b]">
          <div className="text-[10px] font-mono text-[#6e807d]">NODES</div>
          <div className="text-xs font-semibold text-[#f1f5f4]">25 Active</div>
        </div>
        <div className="p-1.5 rounded-lg bg-[#15221e] border border-[#202e2b]">
          <div className="text-[10px] font-mono text-[#6e807d]">EDGES</div>
          <div className="text-xs font-semibold text-[#a7f3d0]">24 Mapped</div>
        </div>
        <div className="p-1.5 rounded-lg bg-[#15221e] border border-[#202e2b]">
          <div className="text-[10px] font-mono text-[#6e807d]">LATENCY</div>
          <div className="text-xs font-semibold text-[#34d399]">0.4 ms</div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// SCENE 3: CRYPTOGRAPHIC JWT SECURITY
// ----------------------------------------------------------------------------
function SecurityScene({ t }: { t: number }) {
  const isRotating = t > 3200 && t < 4600;
  const isVerified = t >= 4600;

  return (
    <div className="p-4 rounded-2xl bg-[#101918] border border-[#202e2b] space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#9aaba8] flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#34d399]" />
          Enterprise JWT Security
        </span>
        <span className="text-[10px] font-mono text-[#34d399] bg-[#15221e] px-2 py-0.5 rounded border border-[#202e2b]">
          HMAC-SHA256
        </span>
      </div>

      {/* Token Cards */}
      <div className="space-y-2">
        <div className="p-2.5 rounded-xl bg-[#0b1312] border border-[#202e2b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-3.5 w-3.5 text-[#a7f3d0]" />
            <div>
              <div className="text-xs font-medium text-[#f1f5f4]">Access Token (7 Days)</div>
              <div className="text-[10px] font-mono text-[#6e807d]">Bearer eyJhbGciOiJIUzI1Ni...</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#a7f3d0] bg-[#101918] px-2 py-0.5 rounded border border-[#202e2b]">
            Valid
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#0b1312] border border-[#202e2b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className={`h-3.5 w-3.5 ${isRotating ? "animate-spin text-[#34d399]" : "text-[#fbbf24]"}`} />
            <div>
              <div className="text-xs font-medium text-[#f1f5f4]">Refresh Token Rotation</div>
              <div className="text-[10px] font-mono text-[#6e807d]">
                {isRotating ? "Cryptographic renewal in progress..." : "30-Day Rolling Invalidation"}
              </div>
            </div>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              isRotating
                ? "bg-[#34d399]/15 text-[#34d399] border-[#34d399]/30"
                : "bg-[#101918] text-[#fbbf24] border-[#202e2b]"
            }`}
          >
            {isRotating ? "Rotating" : "Active"}
          </span>
        </div>
      </div>

      {/* Verification footer */}
      <div className="p-2.5 rounded-xl bg-[#15221e]/80 border border-[#202e2b] flex items-center gap-2 text-xs font-mono">
        <CheckCircle2 className="h-4 w-4 text-[#34d399] shrink-0" />
        <span className="text-[#a7f3d0] text-[11px]">
          {isVerified
            ? "Session Verified: Neon PostgreSQL Auth Active"
            : "Handshake verified with 0ms downtime"}
        </span>
      </div>
    </div>
  );
}
