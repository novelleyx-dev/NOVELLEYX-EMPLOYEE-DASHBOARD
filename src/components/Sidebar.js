"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, Users, FileText, CheckSquare, 
  BarChart, MessageSquare, Calendar, Settings,
  Thermometer, TrendingUp, ClipboardList
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const adminNav = [
    { id: "dashboard",  label: "Dashboard",         icon: <LayoutDashboard size={20} /> },
    { id: "employees",  label: "Employees & Access", icon: <Users size={20} /> },
    { id: "tasks",      label: "Task Management",    icon: <CheckSquare size={20} /> },
    { id: "attendance", label: "Attendance Logs",    icon: <Calendar size={20} /> },
    { id: "analytics",  label: "Analytics",          icon: <BarChart size={20} /> },
    { id: "meetings",   label: "Meetings",           icon: <Calendar size={20} /> },
    { id: "chat",       label: "Team Chat",          icon: <MessageSquare size={20} /> },
    { id: "leaves",     label: "Leave Requests",     icon: <Thermometer size={20} /> },
  ];

  const employeeNav = [
    { id: "dashboard", label: "Dashboard",        icon: <LayoutDashboard size={20} /> },
    { id: "tasks",     label: "My Tasks",          icon: <CheckSquare size={20} /> },
    { id: "skills",    label: "Skill Progression", icon: <BarChart size={20} /> },
    { id: "meetings",  label: "Meetings",          icon: <Calendar size={20} /> },
    { id: "chat",      label: "Group Chat",        icon: <MessageSquare size={20} /> },
    { id: "insights",  label: "Social Insights",   icon: <TrendingUp size={20} /> },
    { id: "leave",     label: "Sick Leave",        icon: <Thermometer size={20} /> },
  ];

  const navItems = isAdmin ? adminNav : employeeNav;

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "1.5rem 1rem" }}>
        <div style={{ 
          width: "40px", height: "40px", 
          background: "linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)", 
          borderRadius: "8px", 
          display: "flex", alignItems: "center", justifyContent: "center", 
          color: "#111", fontWeight: "bold", fontSize: "1.5rem",
          boxShadow: "0 4px 10px rgba(212, 175, 55, 0.3)"
        }}>
          N
        </div>
        <h2 style={{ fontSize: "1.5rem", margin: 0, fontWeight: "700", letterSpacing: "2px", color: "var(--text-primary)" }}>NOVELLEYX</h2>
      </div>
      
      <nav className="sidebar-nav">
        <div style={{ marginBottom: "1rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "1px", fontWeight: "600", paddingLeft: "1rem" }}>
          Menu
        </div>
        {navItems.map((item) => (
          <button 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
            style={{ width: "100%", justifyContent: "flex-start", textAlign: "left" }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "1rem", borderTop: "1px solid var(--border-color)" }}>
        <button className={`nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")} style={{ width: "100%", justifyContent: "flex-start", textAlign: "left" }}>
          <Settings size={20} />
          Settings
        </button>
      </div>
    </aside>
  );
}
