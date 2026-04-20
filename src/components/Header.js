"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Bell, LogOut, Search, X, User } from "lucide-react";

export default function Header({ setActiveTab }) {
  const { user, logout, notifications } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  const { employees } = useAuth();

  // Close dropdowns on outside click
  useEffect(() => {
    function handle(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchQuery("");
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Search results derived from query
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const tasks = (() => {
      if (typeof window === "undefined") return [];
      try { return JSON.parse(localStorage.getItem("novelleyx_tasks") || "[]"); } catch { return []; }
    })();

    const empResults = employees
      .filter(e => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q))
      .map(e => ({ type: "Employee", label: e.name, sub: e.email, tab: "employees" }));

    const taskResults = tasks
      .filter(t => t.title.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q))
      .map(t => ({ type: "Task", label: t.title, sub: `Assigned to ${t.assignee}`, tab: "tasks" }));

    return [...empResults, ...taskResults].slice(0, 8);
  }, [searchQuery, employees]);

  const unreadCount = notifications?.length || 0;

  return (
    <header className="top-header" style={{ position: "sticky", top: 0, zIndex: 30 }}>
      {/* Search */}
      <div style={{ flex: 1, position: "relative" }} ref={searchRef}>
        <div style={{ position: "relative", width: "300px" }}>
          <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", pointerEvents: "none" }} />
          <input
            type="text"
            placeholder="Search employees, tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "36px", paddingRight: searchQuery ? "32px" : "12px", borderRadius: "999px", background: "var(--bg-main)", border: "1px solid var(--border-color)", height: "38px", fontSize: "0.875rem", width: "100%", color: "var(--text-primary)", outline: "none", boxSizing: "border-box" }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search dropdown */}
        {searchResults.length > 0 && (
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, width: "320px", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", boxShadow: "0 16px 48px rgba(0,0,0,0.15)", zIndex: 200, overflow: "hidden" }}>
            {searchResults.map((r, i) => (
              <button key={i} onClick={() => { if (setActiveTab) setActiveTab(r.tab); setSearchQuery(""); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", borderBottom: i < searchResults.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: r.type === "Employee" ? "rgba(212,175,55,0.15)" : "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={15} color={r.type === "Employee" ? "#aa7c11" : "#3b82f6"} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{r.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.sub}</div>
                </div>
                <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: "10px", background: "var(--bg-main)", color: "var(--text-secondary)", flexShrink: 0 }}>{r.type}</span>
              </button>
            ))}
          </div>
        )}

        {searchQuery && searchResults.length === 0 && (
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, width: "280px", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", boxShadow: "0 16px 48px rgba(0,0,0,0.15)", zIndex: 200, padding: "1rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            No results for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button onClick={toggleTheme} style={{ color: "var(--text-secondary)", padding: "8px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", cursor: "pointer" }}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button onClick={() => setShowNotifs(!showNotifs)}
            style={{ color: "var(--text-secondary)", padding: "8px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", cursor: "pointer", position: "relative" }}>
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "18px", height: "18px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", borderRadius: "50%", fontSize: "10px", fontWeight: "bold", color: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "320px", borderRadius: "12px", background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", zIndex: 100, overflow: "hidden" }}>
              <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ fontWeight: 700, fontSize: "0.9rem" }}>Notifications</h4>
                <button onClick={() => setShowNotifs(false)} style={{ color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer" }}><X size={16} /></button>
              </div>
              <div style={{ maxHeight: "340px", overflowY: "auto" }}>
                {notifications?.length > 0 ? notifications.map(n => (
                  <div key={n.id} style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border-color)", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "linear-gradient(135deg, #d4af37, #aa7c11)", flexShrink: 0, marginTop: "5px" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#aa7c11", marginBottom: "2px" }}>{n.type}</div>
                      <div style={{ fontSize: "0.85rem" }}>{n.message}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "3px" }}>{new Date(n.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingLeft: "0.75rem", borderLeft: "1px solid var(--border-color)" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{user?.name || "User"}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>{user?.role}</div>
          </div>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#111", fontWeight: "700", fontSize: "1rem", border: "2px solid var(--border-color)" }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <button onClick={logout} title="Logout" style={{ color: "#ef4444", padding: "8px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", cursor: "pointer" }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
