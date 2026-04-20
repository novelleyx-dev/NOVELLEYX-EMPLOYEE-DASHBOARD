"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
    <header className="top-header">
      {/* Search area with refined look */}
      <div style={{ flex: 1, position: "relative" }} ref={searchRef}>
        <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
          <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", pointerEvents: "none", opacity: 0.6 }} />
          <input
            type="text"
            placeholder="Search everything..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ 
              paddingLeft: "46px", 
              paddingRight: searchQuery ? "40px" : "16px", 
              borderRadius: "14px", 
              background: "var(--bg-card)", 
              border: "1px solid var(--border-color)", 
              height: "46px", 
              fontSize: "0.95rem", 
              width: "100%", 
              color: "var(--text-primary)", 
              outline: "none", 
              boxSizing: "border-box",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "50%" }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search dropdown with premium look */}
        {searchResults.length > 0 && (
          <div className="glass-panel" style={{ position: "absolute", top: "calc(100% + 10px)", left: 0, width: "100%", maxWidth: "400px", zIndex: 200, padding: "8px" }}>
            {searchResults.map((r, i) => (
              <button key={i} onClick={() => { if (setActiveTab) setActiveTab(r.tab); setSearchQuery(""); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", borderRadius: "10px", transition: "all 0.2s" }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)"}
                onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: r.type === "Employee" ? "rgba(59, 130, 246, 0.15)" : "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={18} color={r.type === "Employee" ? "#3b82f6" : "#10b981"} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{r.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.sub}</div>
                </div>
                <span style={{ fontSize: "0.7rem", padding: "2px 10px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", fontWeight: 700 }}>{r.type.toUpperCase()}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right side tools */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={toggleTheme} className="glass-panel" style={{ padding: "10px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications with glow */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button onClick={() => setShowNotifs(!showNotifs)} className="glass-panel"
            style={{ padding: "10px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", position: "relative" }}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "10px", height: "10px", background: "#ef4444", borderRadius: "50%", border: "2px solid var(--bg-main)", boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)" }} />
            )}
          </button>

          {showNotifs && (
            <div className="glass-panel" style={{ position: "absolute", top: "calc(100% + 12px)", right: 0, width: "320px", zIndex: 100, padding: "12px" }}>
              <div style={{ padding: "8px 4px 12px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h4 style={{ fontWeight: 800, fontSize: "0.95rem", margin: 0 }}>Activity</h4>
                <span style={{ fontSize: "0.75rem", background: "var(--primary-color)", color: "white", padding: "2px 8px", borderRadius: "6px" }}>{unreadCount} New</span>
              </div>
              <div style={{ maxHeight: "360px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
                {notifications?.length > 0 ? notifications.map(n => (
                  <div key={n.id} style={{ padding: "12px", borderRadius: "10px", display: "flex", gap: "12px", alignItems: "flex-start", transition: "all 0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#3b82f6" }}>
                      <Bell size={14} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "2px" }}>{n.message}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{new Date(n.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: "2rem 1rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>All caught up!</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile area - Image 2 style */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "1rem", borderLeft: "1px solid var(--border-color)", marginLeft: "0.5rem" }}>
          <div style={{ textAlign: "right", display: "none", md: "block" } /* Hidden on mobile */}>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-primary)" }}>{user?.name || "Member"}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>{user?.role}</div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ 
              width: "44px", height: "44px", 
              borderRadius: "14px", 
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              color: "#fff", fontWeight: "800", fontSize: "1.1rem", 
              border: "2px solid var(--bg-main)",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "12px", height: "12px", background: "#10b981", borderRadius: "50%", border: "2px solid var(--bg-main)" }} />
          </div>
        </div>
      </div>
    </header>
  );
}
