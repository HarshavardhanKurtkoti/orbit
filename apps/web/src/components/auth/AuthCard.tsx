"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowRight,
  Lock,
  Mail,
  User,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";
import { GlassButton } from "@/components/ui/GlassButton";

interface AuthCardProps {
  initialMode?: "login" | "signup";
}

export function AuthCard({ initialMode = "login" }: AuthCardProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (api.getToken()) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all required credentials.");
      return;
    }

    if (mode === "signup" && !displayName) {
      setError("Please provide a display name.");
      return;
    }

    if (mode === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await api.login({ email, password });
      } else {
        await api.register({
          email,
          password,
          display_name: displayName,
          role: "member",
        });
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || (mode === "login" ? "Invalid email or password." : "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      await api.demoLogin();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Demo session initialization failed.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 max-w-xl mx-auto w-full min-h-screen">
      {/* Brand Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-[#15221e] border border-[#202e2b] flex items-center justify-center text-[#a7f3d0] shadow-md shadow-[#a7f3d0]/10">
          <Compass className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm tracking-wider uppercase text-[#f1f5f4] font-semibold">
            ORBIT SPATIAL OS
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#15221e] border border-[#202e2b] text-[#a7f3d0]">
            v0.1.0
          </span>
        </div>
      </div>

      {/* Main Glass Authentication Box */}
      <div className="my-8 space-y-6">
        {/* Animated Segmented Tabs */}
        <div className="flex rounded-xl bg-[#101918] border border-[#202e2b] p-1 relative">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-all relative z-10 flex items-center justify-center gap-1.5 ${
              mode === "login" ? "text-[#f1f5f4] font-medium" : "text-[#6e807d] hover:text-[#d6dedc]"
            }`}
          >
            <span>Sign In</span>
            {mode === "login" && (
              <motion.div
                layoutId="active-auth-pill"
                className="absolute inset-0 rounded-lg bg-[#15221e] border border-[#a7f3d0]/30 -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-all relative z-10 flex items-center justify-center gap-1.5 ${
              mode === "signup" ? "text-[#f1f5f4] font-medium" : "text-[#6e807d] hover:text-[#d6dedc]"
            }`}
          >
            <span>Create Account</span>
            {mode === "signup" && (
              <motion.div
                layoutId="active-auth-pill"
                className="absolute inset-0 rounded-lg bg-[#15221e] border border-[#a7f3d0]/30 -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#f1f5f4]">
            {mode === "login" ? "Sign in to your Universe" : "Initialize Spatial Account"}
          </h1>
          <p className="text-xs text-[#9aaba8]">
            {mode === "login"
              ? "Authenticate with enterprise JWT tokens or launch instant Demo Commander session."
              : "Provision your personal isolated spatial universe with 3D coordinate graphs."}
          </p>
        </div>

        {/* Error Callout */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2 font-mono"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <AnimatePresence initial={false}>
            {mode === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                <label className="text-[11px] font-mono text-[#9aaba8]">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6e807d]" />
                  <input
                    type="text"
                    required={mode === "signup"}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Commander Alex Mercer"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#101918] border border-[#202e2b] text-xs text-[#f1f5f4] placeholder-[#6e807d] focus:outline-none focus:border-[#a7f3d0] focus:ring-1 focus:ring-[#a7f3d0]/30 transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#9aaba8]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6e807d]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@orbit.internal"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#101918] border border-[#202e2b] text-xs text-[#f1f5f4] placeholder-[#6e807d] focus:outline-none focus:border-[#a7f3d0] focus:ring-1 focus:ring-[#a7f3d0]/30 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-[#9aaba8]">
                Password
              </label>
              {mode === "login" && (
                <span className="text-[10px] font-mono text-[#6e807d] hover:text-[#a7f3d0] cursor-pointer">
                  Forgot?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6e807d]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#101918] border border-[#202e2b] text-xs text-[#f1f5f4] placeholder-[#6e807d] focus:outline-none focus:border-[#a7f3d0] focus:ring-1 focus:ring-[#a7f3d0]/30 transition-all"
              />
            </div>
          </div>

          <GlassButton
            type="submit"
            variant="primary"
            size="md"
            className="w-full justify-center text-xs py-2.5 font-medium shadow-md shadow-[#34d399]/10"
            disabled={loading || demoLoading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                {mode === "login" ? "Authenticating..." : "Creating Account..."}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                {mode === "login" ? "Sign In with Credentials" : "Initialize Orbit Account"}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            )}
          </GlassButton>
        </form>

        {/* Instant Access Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#202e2b] w-full" />
          <span className="bg-[#080d10] px-3 text-[10px] font-mono text-[#6e807d] uppercase tracking-wider relative">
            or instant evaluation
          </span>
        </div>

        {/* 1-Click Demo Commander Launcher */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading || demoLoading}
          className="group w-full p-3 rounded-xl bg-[#101918] border border-[#202e2b] hover:border-[#a7f3d0]/50 text-xs font-mono text-[#d6dedc] hover:text-[#f1f5f4] flex items-center justify-between transition-all duration-200 shadow-sm hover:shadow-[#a7f3d0]/10"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#15221e] border border-[#202e2b] flex items-center justify-center text-[#a7f3d0] group-hover:bg-[#a7f3d0]/10 transition-colors">
              <Sparkles className="h-3.5 w-3.5 text-[#a7f3d0]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-[#f1f5f4] group-hover:text-[#a7f3d0] transition-colors">
                Launch Demo Commander Session
              </div>
              <div className="text-[10px] text-[#6e807d]">
                1-click auto-provisioned admin account
              </div>
            </div>
          </div>
          {demoLoading ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#a7f3d0]" />
          ) : (
            <span className="text-[10px] text-[#a7f3d0] opacity-80 group-hover:opacity-100 flex items-center gap-1">
              Connect <ArrowRight className="h-3 w-3" />
            </span>
          )}
        </button>

        {/* Switch Mode Prompt */}
        <div className="text-center text-xs text-[#9aaba8]">
          {mode === "login" ? (
            <span>
              Don&apos;t have an account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className="text-[#a7f3d0] hover:underline font-medium"
              >
                Create an Orbit account
              </button>
            </span>
          ) : (
            <span>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="text-[#a7f3d0] hover:underline font-medium"
              >
                Sign in to your account
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Footer Legal */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#6e807d] border-t border-[#202e2b] pt-4">
        <span>© 2026 Orbit Systems</span>
        <div className="flex items-center gap-4">
          <span className="hover:text-[#9aaba8] cursor-pointer">Terms</span>
          <span className="hover:text-[#9aaba8] cursor-pointer">Privacy</span>
          <span className="hover:text-[#9aaba8] cursor-pointer">Security</span>
        </div>
      </div>
    </div>
  );
}
