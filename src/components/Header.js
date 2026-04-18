"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Bell, LogOut, Search } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

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

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <button onClick={toggleTheme} style={{ color: "var(--text-secondary)" }}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button style={{ color: "var(--text-secondary)", position: "relative" }}>
          <Bell size={20} />
          <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "8px", height: "8px", backgroundColor: "var(--danger-color)", borderRadius: "50%" }}></span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderLeft: "1px solid var(--border-color)", paddingLeft: "1.5rem" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: "600", fontSize: "0.875rem" }}>{user?.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>{user?.role}</div>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--border-color)" }}>
            <Image src={user?.avatar || "/next.svg"} alt="User Avatar" width={40} height={40} style={{ objectFit: "cover" }} />
          </div>
          <button onClick={logout} title="Logout" style={{ color: "var(--danger-color)", marginLeft: "0.5rem" }}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
