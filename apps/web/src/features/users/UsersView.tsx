"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Shield,
  Key,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Search,
  Filter,
  Trash2,
  Lock,
  Mail,
  UserCheck,
  UserX,
  Clock,
  Sparkles,
  ChevronDown,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { MetricCard } from "@/components/ui/MetricCard";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

interface UserItem {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function UsersView() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Token inspector state
  const [tokens, setTokens] = useState<{ accessToken: string | null; refreshToken: string | null }>({
    accessToken: null,
    refreshToken: null,
  });
  const [decodedClaims, setDecodedClaims] = useState<any>(null);
  const [showAccessToken, setShowAccessToken] = useState<boolean>(false);
  const [showRefreshToken, setShowRefreshToken] = useState<boolean>(false);
  const [copiedAccess, setCopiedAccess] = useState<boolean>(false);
  const [copiedRefresh, setCopiedRefresh] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [rotationMessage, setRotationMessage] = useState<string | null>(null);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState({
    display_name: "",
    email: "",
    password: "",
    role: "member",
    status: "active",
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSubmitting, setCreateSubmitting] = useState<boolean>(false);

  // Load session tokens & users list
  useEffect(() => {
    loadSession();
    fetchUsers();
  }, []);

  const loadSession = () => {
    const currentTokens = api.getTokens();
    setTokens(currentTokens);
    if (currentTokens.accessToken) {
      const claims = api.decodeJwt(currentTokens.accessToken);
      setDecodedClaims(claims);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.listUsers({
        q: searchQuery,
        role: roleFilter,
        status: statusFilter,
      });
      if (res && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRotateTokens = async () => {
    setIsRotating(true);
    setRotationMessage(null);
    try {
      const refreshed = await api.refreshSession();
      loadSession();
      setRotationMessage("Tokens successfully rotated with cryptographic signature verification!");
      setTimeout(() => setRotationMessage(null), 4000);
    } catch (err: any) {
      setRotationMessage(`Rotation failed: ${err.message || "Invalid refresh token"}`);
      setTimeout(() => setRotationMessage(null), 4000);
    } finally {
      setIsRotating(false);
    }
  };

  const copyToClipboard = (text: string, type: "access" | "refresh") => {
    navigator.clipboard.writeText(text);
    if (type === "access") {
      setCopiedAccess(true);
      setTimeout(() => setCopiedAccess(false), 2000);
    } else {
      setCopiedRefresh(true);
      setTimeout(() => setCopiedRefresh(false), 2000);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.email || !createForm.password || !createForm.display_name) {
      setCreateError("Please complete all required fields.");
      return;
    }

    setCreateSubmitting(true);
    setCreateError(null);
    try {
      await api.createUser(createForm);
      setIsCreateModalOpen(false);
      setCreateForm({
        display_name: "",
        email: "",
        password: "",
        role: "member",
        status: "active",
      });
      fetchUsers();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create user");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    try {
      await api.updateUser(user.id, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error("Failed to update user status:", err);
    }
  };

  const handleChangeRole = async (user: UserItem, newRole: string) => {
    try {
      await api.updateUser(user.id, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Failed to update user role:", err);
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`Are you sure you want to remove user "${user.display_name}" (${user.email})?`)) {
      return;
    }
    try {
      await api.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    }
  };

  // Metrics
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin" || u.role === "owner").length;
  const activeCount = users.filter((u) => u.status === "active").length;

  if (decodedClaims && decodedClaims.role !== "admin" && decodedClaims.role !== "owner") {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <GlassPanel elevation="standard" className="p-8 max-w-md space-y-4 bg-[#101918] border border-[#202e2b] rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Shield className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-medium text-[#f1f5f4]">Access Restricted</h2>
            <p className="text-xs text-[#9aaba8] leading-relaxed">
              Users & Access management requires Administrator or Owner privileges. Standard members cannot view or manage workspace members or system tokens.
            </p>
          </div>
          <div className="pt-2">
            <GlassButton
              variant="primary"
              size="sm"
              className="w-full justify-center"
              onClick={() => {
                if (typeof window !== "undefined") window.location.href = "/";
              }}
            >
              Return to Overview
            </GlassButton>
          </div>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-medium tracking-tight text-[#f1f5f4] flex items-center gap-2">
              <Users className="h-5 w-5 text-[#a7f3d0]" />
              Users & Access Control
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101918] border border-[#202e2b] text-[#a7f3d0]">
              RBAC + JWT
            </span>
          </div>
          <p className="text-xs text-[#9aaba8] mt-1">
            Manage organization members, workspace roles, and cryptographically verified JWT access tokens.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <GlassButton
            variant="subtle"
            size="sm"
            icon={<RefreshCw className={`h-3.5 w-3.5 ${isRotating ? "animate-spin text-[#a7f3d0]" : ""}`} />}
            onClick={handleRotateTokens}
            disabled={isRotating}
          >
            Rotate Tokens
          </GlassButton>
          <GlassButton
            variant="primary"
            size="sm"
            icon={<UserPlus className="h-3.5 w-3.5" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Invite User
          </GlassButton>
        </div>
      </div>

      {rotationMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3 rounded-xl bg-[#101918] border border-[#202e2b] text-xs font-mono text-[#a7f3d0] flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4 text-[#34d399]" />
          <span>{rotationMessage}</span>
        </motion.div>
      )}

      {/* 2. KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={totalUsers}
          subtitle={`${activeCount} active in universe`}
          icon={<Users className="h-4 w-4 text-[#a7f3d0]" />}
          accentColor="mint"
        />
        <MetricCard
          title="Administrators"
          value={adminCount}
          subtitle="Full RBAC access"
          icon={<Shield className="h-4 w-4 text-[#34d399]" />}
          accentColor="emerald"
        />
        <MetricCard
          title="JWT Access Token"
          value={tokens.accessToken ? "Active (HS256)" : "Unauthenticated"}
          subtitle={
            decodedClaims?.exp
              ? `Expires in ${Math.max(0, Math.round((decodedClaims.exp - Date.now() / 1000) / 3600))}h`
              : "7-day rolling duration"
          }
          icon={<Key className="h-4 w-4 text-[#38bdf8]" />}
          accentColor="cyan"
        />
        <MetricCard
          title="Refresh Rotation"
          value={tokens.refreshToken ? "30-Day Auto" : "None"}
          subtitle="One-click session renewal"
          icon={<RefreshCw className="h-4 w-4 text-[#fbbf24]" />}
          accentColor="amber"
        />
      </div>

      {/* 3. ACTIVE JWT SESSION & TOKEN INSPECTOR */}
      <GlassPanel elevation="standard" className="p-5 space-y-4 bg-[#101918]">
        <div className="flex items-center justify-between border-b border-[#202e2b] pb-3">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-[#a7f3d0]" />
            <h2 className="text-sm font-medium text-[#f1f5f4]">Active Session & JWT Token Inspector</h2>
            <span className="text-[10px] font-mono text-[#6e807d] px-2 py-0.5 rounded bg-[#0b1312] border border-[#202e2b]">
              Bearer Auth
            </span>
          </div>
          <button
            onClick={handleRotateTokens}
            disabled={isRotating}
            className="flex items-center gap-1.5 text-xs text-[#a7f3d0] hover:text-[#f1f5f4] transition-colors font-mono"
          >
            <RefreshCw className={`h-3 w-3 ${isRotating ? "animate-spin" : ""}`} />
            Refresh Token Session
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Access Token Card */}
          <div className="p-3.5 rounded-xl bg-[#0b1312] border border-[#202e2b] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9aaba8] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                Access Token (JWT)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowAccessToken(!showAccessToken)}
                  className="p-1 text-[#6e807d] hover:text-[#f1f5f4] rounded"
                  title={showAccessToken ? "Hide Token" : "Show Token"}
                >
                  {showAccessToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => copyToClipboard(tokens.accessToken || "", "access")}
                  className="p-1 text-[#6e807d] hover:text-[#f1f5f4] rounded"
                  title="Copy Token"
                >
                  {copiedAccess ? <Check className="h-3.5 w-3.5 text-[#34d399]" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#15221e]/40 border border-[#202e2b] font-mono text-[11px] text-[#d6dedc] break-all select-all">
              {tokens.accessToken
                ? showAccessToken
                  ? tokens.accessToken
                  : `${tokens.accessToken.slice(0, 32)}••••••••••••••••••••••••${tokens.accessToken.slice(-16)}`
                : "No active access token"}
            </div>
            {decodedClaims && (
              <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-[#101918] border border-[#202e2b] text-[#9aaba8]">
                  sub: <strong className="text-[#f1f5f4]">{decodedClaims.sub}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#101918] border border-[#202e2b] text-[#9aaba8]">
                  role: <strong className="text-[#a7f3d0]">{decodedClaims.role || "member"}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#101918] border border-[#202e2b] text-[#9aaba8]">
                  type: <strong className="text-[#38bdf8]">{decodedClaims.type || "access"}</strong>
                </span>
                {decodedClaims.exp && (
                  <span className="px-2 py-0.5 rounded bg-[#101918] border border-[#202e2b] text-[#9aaba8]">
                    exp: <strong className="text-[#d6dedc]">{new Date(decodedClaims.exp * 1000).toLocaleTimeString()}</strong>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Refresh Token Card */}
          <div className="p-3.5 rounded-xl bg-[#0b1312] border border-[#202e2b] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9aaba8] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                Refresh Token
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowRefreshToken(!showRefreshToken)}
                  className="p-1 text-[#6e807d] hover:text-[#f1f5f4] rounded"
                  title={showRefreshToken ? "Hide Token" : "Show Token"}
                >
                  {showRefreshToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => copyToClipboard(tokens.refreshToken || "", "refresh")}
                  className="p-1 text-[#6e807d] hover:text-[#f1f5f4] rounded"
                  title="Copy Token"
                >
                  {copiedRefresh ? <Check className="h-3.5 w-3.5 text-[#34d399]" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#15221e]/40 border border-[#202e2b] font-mono text-[11px] text-[#d6dedc] break-all select-all">
              {tokens.refreshToken
                ? showRefreshToken
                  ? tokens.refreshToken
                  : `${tokens.refreshToken.slice(0, 32)}••••••••••••••••••••••••${tokens.refreshToken.slice(-16)}`
                : "No active refresh token"}
            </div>
            <div className="pt-2 flex items-center justify-between text-[11px] text-[#9aaba8]">
              <span>Auto-rotates silently on 401 token expiry</span>
              <span className="font-mono text-[#a7f3d0] text-[10px]">Endpoint: /api/v1/auth/refresh</span>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* 4. USERS DIRECTORY TABLE & FILTERS */}
      <GlassPanel elevation="standard" className="p-5 space-y-4 bg-[#101918] flex-1 flex flex-col">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6e807d]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                placeholder="Search user by display name or email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs text-[#f1f5f4] placeholder-[#6e807d] focus:outline-none focus:border-[#a7f3d0]"
              />
            </div>
            <GlassButton size="sm" variant="subtle" onClick={fetchUsers}>
              Search
            </GlassButton>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#6e807d]">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setTimeout(fetchUsers, 0);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs text-[#d6dedc] focus:outline-none focus:border-[#a7f3d0] cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#6e807d]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setTimeout(fetchUsers, 0);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs text-[#d6dedc] focus:outline-none focus:border-[#a7f3d0] cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202e2b]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202e2b] bg-[#0b1312]/60 text-[#9aaba8] font-mono text-[11px]">
                <th className="py-3 px-4 font-medium">User Profile</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Identifier</th>
                <th className="py-3 px-4 font-medium">Joined</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202e2b]/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-[#a7f3d0] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#34d399] animate-ping" />
                        <span>Buffering user directory from Neon PostgreSQL...</span>
                      </div>
                      <SkeletonLoader className="h-8 w-64 bg-[#15221e]/40 mt-2" />
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#6e807d] font-mono">
                    No users matching the current filter query
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSuspended = u.status === "suspended";
                  return (
                    <tr key={u.id} className="hover:bg-[#15221e]/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#15221e] border border-[#202e2b] flex items-center justify-center font-mono text-xs text-[#a7f3d0] font-bold shrink-0">
                            {u.display_name?.slice(0, 2).toUpperCase() || "OR"}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-[#f1f5f4]">{u.display_name}</div>
                            <div className="text-[11px] text-[#6e807d] font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u, e.target.value)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono border cursor-pointer ${
                            u.role === "admin" || u.role === "owner"
                              ? "bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30"
                              : "bg-[#15221e] text-[#d6dedc] border-[#202e2b]"
                          }`}
                        >
                          <option value="member">member</option>
                          <option value="admin">admin</option>
                          <option value="owner">owner</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                            isSuspended
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSuspended ? "bg-rose-400" : "bg-emerald-400 animate-pulse"
                            }`}
                          />
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-[#6e807d]">
                        {u.id.slice(0, 13)}...
                      </td>
                      <td className="py-3 px-4 text-[#9aaba8] text-[11px]">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1.5 rounded hover:bg-[#15221e] transition-colors ${
                              isSuspended ? "text-[#34d399]" : "text-[#fbbf24]"
                            }`}
                            title={isSuspended ? "Activate User" : "Suspend User"}
                          >
                            {isSuspended ? <UserCheck className="h-3.5 w-3.5" /> : <UserX className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded hover:bg-rose-500/20 text-[#6e807d] hover:text-rose-400 transition-colors"
                            title="Remove User"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {/* 5. CREATE / INVITE USER MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl glass-elevated border border-[#202e2b] bg-[#101918] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#202e2b] pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-[#a7f3d0]" />
                  <h3 className="text-sm font-medium text-[#f1f5f4]">Invite / Create New User</h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded text-[#6e807d] hover:text-[#f1f5f4]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {createError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono text-[#9aaba8] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.display_name}
                    onChange={(e) => setCreateForm({ ...createForm, display_name: e.target.value })}
                    placeholder="e.g. Commander Sarah Chen"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs text-[#f1f5f4] focus:outline-none focus:border-[#a7f3d0]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#9aaba8] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="sarah@orbit.internal"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs text-[#f1f5f4] focus:outline-none focus:border-[#a7f3d0]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#9aaba8] mb-1">
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    required
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs text-[#f1f5f4] focus:outline-none focus:border-[#a7f3d0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#9aaba8] mb-1">
                      Assigned Role
                    </label>
                    <select
                      value={createForm.role}
                      onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs text-[#d6dedc] focus:outline-none focus:border-[#a7f3d0]"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#9aaba8] mb-1">
                      Initial Status
                    </label>
                    <select
                      value={createForm.status}
                      onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0b1312] border border-[#202e2b] text-xs text-[#d6dedc] focus:outline-none focus:border-[#a7f3d0]"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <GlassButton
                    type="button"
                    variant="subtle"
                    size="sm"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </GlassButton>
                  <GlassButton
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={createSubmitting}
                  >
                    {createSubmitting ? "Creating..." : "Confirm Invitation"}
                  </GlassButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
