"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, Users, FileText, CheckSquare, 
  BarChart, MessageSquare, Calendar, Settings,
  Thermometer, TrendingUp, ClipboardList, LogOut
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
      <div className="sidebar-header" style={{ padding: "2.5rem 2rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ 
            width: "36px", height: "36px", 
            background: "linear-gradient(135deg, var(--primary-color) 0%, #1e40af 100%)", 
            borderRadius: "10px", 
            display: "flex", alignItems: "center", justifyContent: "center", 
            color: "#fff", fontWeight: "bold", fontSize: "1.2rem",
            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)"
          }}>
            X
          </div>
          <h2 style={{ fontSize: "1.25rem", margin: 0, fontWeight: "800", letterSpacing: "1px", color: "var(--text-primary)" }}>NOVELLEYX</h2>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
            style={{ width: "100%", justifyContent: "flex-start", textAlign: "left" }}
          >
            {item.icon}
            <span style={{ fontSize: "0.95rem" }}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ padding: "1.5rem 1.25rem", marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <button className={`nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")} style={{ width: "100%" }}>
          <Settings size={20} />
          Settings
        </button>
        <button onClick={logout} className="nav-item" style={{ width: "100%", color: "#ef4444" }}>
          <LogOut size={20} />
          Log out
        </button>
      </div>
    </aside>
  );
}
