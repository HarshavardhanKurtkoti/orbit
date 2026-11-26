"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Compass,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";
import { GlassButton } from "@/components/ui/GlassButton";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.login({ email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.demoLogin();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AmbientBackground>
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)] relative z-10">
        {/* LEFT COLUMN: AUTH FORM */}
        <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16 max-w-xl mx-auto w-full">
          {/* Brand header */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#15221e] border border-[#202e2b] flex items-center justify-center text-[#a7f3d0]">
              <Compass className="h-4 w-4" />
            </div>
            <span className="font-mono text-sm tracking-wider uppercase text-[#f1f5f4] font-semibold">
              ORBIT SPATIAL OS
            </span>
          </div>

          {/* Center Form */}
          <div className="my-10 space-y-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-medium tracking-tight text-[#f1f5f4]">
                Sign in to your Universe
              </h1>
              <p className="text-xs text-[#9aaba8]">
                Authenticate with enterprise JWT tokens or launch instant Demo Commander session.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#9aaba8]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6e807d]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="commander@orbit.internal"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101918] border border-[#202e2b] text-xs text-[#f1f5f4] placeholder-[#6e807d] focus:outline-none focus:border-[#a7f3d0] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-[#9aaba8]">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6e807d]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101918] border border-[#202e2b] text-xs text-[#f1f5f4] placeholder-[#6e807d] focus:outline-none focus:border-[#a7f3d0] transition-colors"
                  />
                </div>
              </div>

              <GlassButton
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center text-xs py-2.5"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign In with Credentials"}
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </GlassButton>
            </form>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#202e2b] w-full" />
              <span className="bg-[#080d10] px-3 text-[10px] font-mono text-[#6e807d] uppercase tracking-wider relative">
                or instant access
              </span>
            </div>

            <GlassButton
              type="button"
              variant="subtle"
              size="md"
              className="w-full justify-center text-xs py-2.5 border-[#a7f3d0]/30 hover:border-[#a7f3d0]"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              <Sparkles className="h-3.5 w-3.5 mr-2 text-[#a7f3d0]" />
              Launch Demo Commander Session
            </GlassButton>

            <div className="text-center text-xs text-[#9aaba8]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#a7f3d0] hover:underline font-medium">
                Create an Orbit account
              </Link>
            </div>
          </div>

          {/* Footer legal */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#6e807d] border-t border-[#202e2b] pt-4">
            <span>© 2026 Orbit Systems</span>
            <div className="flex items-center gap-3">
              <span className="hover:text-[#9aaba8] cursor-pointer">Terms</span>
              <span className="hover:text-[#9aaba8] cursor-pointer">Privacy</span>
              <span className="hover:text-[#9aaba8] cursor-pointer">Security</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORBIT SPATIAL SHOWCASE PANEL */}
        <div className="hidden lg:flex p-10 flex-col justify-center items-center relative overflow-hidden border-l border-[#202e2b]/60">
          <div className="w-full max-w-lg space-y-6">
            {/* Liquid-glass coordinate preview badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#101918] border border-[#202e2b] text-[11px] font-mono text-[#a7f3d0]">
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-ping" />
              <span>SPATIAL CANVAS ACTIVE [X: +420, Y: -180, 60FPS]</span>
            </div>

            {/* Showcase title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-medium tracking-tight text-[#f1f5f4]">
                Next-Generation Spatial Operating System
              </h2>
              <p className="text-sm text-[#9aaba8] leading-relaxed">
                Seamless bi-directional knowledge graphs, autonomous AI workspace synthesis, and enterprise JWT token rotation backed by Neon Serverless PostgreSQL.
              </p>
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-[#101918]/80 border border-[#202e2b] backdrop-blur-xl flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#15221e] border border-[#202e2b] text-[#a7f3d0]">
                  <Globe2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-[#f1f5f4]">Infinite Reactive Canvas</h3>
                  <p className="text-[11px] text-[#9aaba8] mt-0.5">
                    Explore nodes, milestones, and entity dependencies with sub-millisecond hardware acceleration.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#101918]/80 border border-[#202e2b] backdrop-blur-xl flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#15221e] border border-[#202e2b] text-[#34d399]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-[#f1f5f4]">Cryptographic JWT Security</h3>
                  <p className="text-[11px] text-[#9aaba8] mt-0.5">
                    HMAC-SHA256 signature verification, rolling refresh tokens, and granular workspace RBAC.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#101918]/80 border border-[#202e2b] backdrop-blur-xl flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#15221e] border border-[#202e2b] text-[#38bdf8]">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-[#f1f5f4]">Prometheus & Grafana Telemetry</h3>
                  <p className="text-[11px] text-[#9aaba8] mt-0.5">
                    Real-time operational metrics provisioned under Master Grafana with automated health checks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AmbientBackground>
  );
}
