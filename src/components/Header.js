"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Bell, LogOut, Search, X } from "lucide-react";

export default function Header() {
  const { user, logout, notifications } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications ? notifications.length : 0;

  return (
    <header className="top-header" style={{ position: "sticky", top: 0, zIndex: 30 }}>
      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
        <div style={{ position: "relative", width: "300px" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
          <input
            type="text"
            placeholder="Search employees, tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "38px", borderRadius: "999px", background: "var(--bg-main)", border: "1px solid var(--border-color)", height: "38px", fontSize: "0.875rem", width: "100%" }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Theme Toggle */}
        <button onClick={toggleTheme} style={{ color: "var(--text-secondary)", padding: "8px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={{ color: "var(--text-secondary)", padding: "8px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", position: "relative" }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: "-4px", right: "-4px",
                width: "18px", height: "18px",
                background: "linear-gradient(135deg, #d4af37, #aa7c11)",
                borderRadius: "50%", fontSize: "10px", fontWeight: "bold",
                color: "#111", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: "320px", borderRadius: "12px",
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)", zIndex: 100,
              overflow: "hidden"
            }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ fontWeight: 700, fontSize: "0.95rem" }}>Notifications</h4>
                <button onClick={() => setShowNotifs(false)} style={{ color: "var(--text-secondary)" }}><X size={16} /></button>
              </div>
              <div style={{ maxHeight: "340px", overflowY: "auto" }}>
                {notifications && notifications.length > 0 ? notifications.map(notif => (
                  <div key={notif.id} style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border-color)", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "linear-gradient(135deg, #d4af37, #aa7c11)", flexShrink: 0, marginTop: "5px" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#aa7c11", marginBottom: "2px" }}>{notif.type}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{notif.message}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {new Date(notif.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                    No notifications yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingLeft: "1rem", borderLeft: "1px solid var(--border-color)" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.5px" }}>{user?.name || "User"}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>{user?.role}</div>
          </div>
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: "linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#111", fontWeight: "700", fontSize: "1rem",
            border: "2px solid var(--border-color)"
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <button onClick={logout} title="Logout" style={{ color: "var(--danger-color)", padding: "8px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
