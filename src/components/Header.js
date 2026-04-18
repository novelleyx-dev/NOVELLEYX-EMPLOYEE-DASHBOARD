"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Bell, LogOut, Search } from "lucide-react";
// image import removed

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showNotifs, setShowNotifs] = React.useState(false);

  return (
    <header className="top-header">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
        <div style={{ position: "relative", width: "300px" }}>
          <Search size={18} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ paddingLeft: "35px", borderRadius: "999px", background: "var(--bg-main)", border: "none" }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", position: "relative" }}>
        <button onClick={toggleTheme} style={{ color: "var(--text-secondary)" }}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowNotifs(!showNotifs)} style={{ color: "var(--text-secondary)", position: "relative" }}>
            <Bell size={20} />
            <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "8px", height: "8px", backgroundColor: "var(--danger-color)", borderRadius: "50%" }}></span>
          </button>
          
          {showNotifs && (
            <div className="card" style={{ position: "absolute", top: "100%", right: "0", width: "250px", padding: "1rem", zIndex: 50, marginTop: "0.5rem", boxShadow: "var(--shadow-lg)" }}>
              <h4 style={{ fontWeight: 600, borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>Notifications</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}>
                <p><strong>System:</strong> Welcome to Novelleyx!</p>
                <p><strong>Admin:</strong> New task assigned.</p>
                <p><strong>HR:</strong> Check your attendance logs.</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderLeft: "1px solid var(--border-color)", paddingLeft: "1.5rem" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: "600", fontSize: "0.875rem" }}>{user?.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>{user?.role}</div>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--border-color)", background: "var(--bg-main)", display: "flex", alignItems: "center", justifyContent: "center" }}>
             {user?.name?.charAt(0) || "U"}
          </div>
          <button onClick={logout} title="Logout" style={{ color: "var(--danger-color)", marginLeft: "0.5rem" }}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
