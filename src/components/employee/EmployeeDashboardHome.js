"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, Target, Award, Clock } from "lucide-react";

export default function EmployeeDashboardHome() {
  const { user } = useAuth();

  // Real data from attendance logs
  const attendance = user?.attendance || [];
  const recentLogins = attendance.slice(-3).reverse();
  const lastLogin = recentLogins[0];

  // Real task count (new employee → 0)
  const taskCount = 0;
  const completedCount = 0;

  return (
    <div>
      {/* Welcome */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "4px" }}>
            Welcome back, {user?.name}! 👋
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#111", fontSize: "1.5rem", fontWeight: "800",
          boxShadow: "0 4px 12px rgba(212,175,55,0.3)"
        }}>
          {user?.name?.charAt(0)?.toUpperCase() || "E"}
        </div>
      </div>

      {/* Stats — all zero for new employee */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Active Tasks", value: taskCount, icon: <Briefcase size={22} />, color: "#d4af37", bg: "rgba(212,175,55,0.1)" },
          { label: "Completed This Week", value: completedCount, icon: <Target size={22} />, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
          { label: "Attendance Days", value: attendance.length, icon: <Clock size={22} />, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
          { label: "Skill Score", value: "–", icon: <Award size={22} />, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color, flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: "800", lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Attendance Log */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Recent Attendance Logs</h3>
          {recentLogins.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "0.5rem 0", textAlign: "left", fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>Date</th>
                  <th style={{ padding: "0.5rem 0", textAlign: "left", fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>Punch In</th>
                  <th style={{ padding: "0.5rem 0", textAlign: "left", fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>Punch Out</th>
                </tr>
              </thead>
              <tbody>
                {recentLogins.map((log, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "0.75rem 0", fontSize: "0.875rem" }}>{new Date(log.loginTime).toLocaleDateString()}</td>
                    <td style={{ padding: "0.75rem 0", color: "#10b981", fontWeight: 600, fontSize: "0.875rem" }}>
                      {new Date(log.loginTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ padding: "0.75rem 0", color: log.logoutTime ? "#ef4444" : "#f59e0b", fontWeight: 600, fontSize: "0.875rem" }}>
                      {log.logoutTime ? new Date(log.logoutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
              <Clock size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
              <p style={{ fontSize: "0.875rem" }}>No attendance records yet.</p>
              <p style={{ fontSize: "0.8rem", marginTop: "4px" }}>Punch in via the login screen each day.</p>
            </div>
          )}
        </div>

        {/* Getting Started */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Getting Started</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {[
              { title: "Complete your profile", desc: "Add your bio, phone, and address in Settings.", done: !!(user?.bio || user?.phone) },
              { title: "View assigned tasks", desc: "Check your Tasks tab for work from admin.", done: false },
              { title: "Join the team chat", desc: "Introduce yourself in #general.", done: false },
              { title: "Attend your first meeting", desc: "Check the Meetings tab for scheduled calls.", done: false },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem", borderRadius: "10px", background: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: `2px solid ${item.done ? "#10b981" : "var(--border-color)"}`, background: item.done ? "#10b981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                  {item.done && <span style={{ color: "white", fontSize: "12px" }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{item.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
