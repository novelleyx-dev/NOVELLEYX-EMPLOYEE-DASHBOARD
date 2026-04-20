"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, Target, Award, Clock, Sun, Sunset, Coffee, Bell } from "lucide-react";

export default function EmployeeDashboardHome() {
  const { user, employees, setEmployees, addNotification } = useAuth();
  const [lunchSent, setLunchSent] = useState(() => {
    if (typeof window !== "undefined") {
      const todayStr = new Date().toISOString().split("T")[0];
      return !!localStorage.getItem(`novelleyx_lunch_notif_${todayStr}`);
    }
    return false;
  });
  const [showWelcome, setShowWelcome] = useState(true);

  // Real data from attendance logs
  const attendance = user?.attendance || [];
  const recentLogins = attendance.slice(-3).reverse();

  // Real task count (new employee → 0)
  const taskCount = 0;
  const completedCount = 0;

  // Determine today's attendance state
  const todayStr = new Date().toISOString().split("T")[0];
  const todayRecords = attendance.filter(a => a.loginTime?.startsWith(todayStr));
  const morningPunched = todayRecords.some(a => a.session === "morning");
  const eveningPunched = todayRecords.some(a => a.session === "evening");

  // Lunch break notification at 1pm (auto once per day)
  useEffect(() => {
    const check = () => {
      const now = new Date();
      if (now.getHours() === 13 && now.getMinutes() === 0 && !lunchSent) {
        addNotification("🍽️ Lunch Break! Please log out now. Bon appétit!", "Lunch Break");
        const email = user?.email;
        if (email) {
          const a = document.createElement("a");
          a.href = `mailto:${email}?subject=Lunch+Break+Reminder&body=Hi+${encodeURIComponent(user?.name || "")},+It's+1PM+—+time+for+lunch!+Please+log+out+of+the+Novelleyx+dashboard+for+your+break.`;
          a.click();
        }
        const todayKey = new Date().toISOString().split("T")[0];
        localStorage.setItem(`novelleyx_lunch_notif_${todayKey}`, "1");
        setLunchSent(true);
      }
    };
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, [addNotification, lunchSent, user?.email, user?.name]);

  const handlePunch = (session) => {
    const now = new Date().toISOString();
    const record = { loginTime: now, session, date: todayStr };
    const updatedAtt = [...attendance, record];
    const updatedUser = { ...user, attendance: updatedAtt };
    setEmployees(prev => prev.map(e => (e.id === user?.id || e.email === user?.email) ? { ...e, attendance: updatedAtt } : e));
    try { localStorage.setItem("novelleyx_user", JSON.stringify(updatedUser)); } catch {}
    addNotification(`${session === "morning" ? "🌅 Morning" : "🌆 Evening"} punch recorded at ${new Date().toLocaleTimeString()}.`, "Attendance");
  };

  const punchCard = (session, label, icon, punched) => (
    <div key={session} style={{ padding: "1.25rem", borderRadius: "12px", border: `1px solid ${punched ? "var(--border-color)" : "#d4af37"}`, background: punched ? "var(--bg-main)" : "rgba(212,175,55,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: punched ? "rgba(16,185,129,0.1)" : "rgba(212,175,55,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: punched ? "#10b981" : "#d4af37" }}>
          {icon}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{label} Punch</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{punched ? "✅ Already punched in" : "Not yet punched"}</div>
        </div>
      </div>
      {!punched && (
        <button onClick={() => handlePunch(session)}
          style={{ padding: "8px 18px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.85rem" }}>
          Punch In
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Welcome Banner */}
      {showWelcome && (
        <div style={{ marginBottom: "1.5rem", padding: "1.25rem 1.5rem", borderRadius: "16px", background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(170,124,17,0.08))", border: "1px solid rgba(212,175,55,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "4px" }}>
              🎉 Welcome back, {user?.name}!
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} · Have a great day!
            </div>
          </div>
          <button onClick={() => setShowWelcome(false)} style={{ color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>×</button>
        </div>
      )}

      {/* Stats */}
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
        {/* Dual Attendance Punch */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
            <Bell size={18} color="#d4af37" />
            <h3 style={{ fontWeight: 700, margin: 0 }}>Today&apos;s Attendance</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {punchCard("morning", "Morning", <Sun size={20} />, morningPunched)}
            {punchCard("evening", "Evening", <Sunset size={20} />, eveningPunched)}
          </div>
          {lunchSent && (
            <div style={{ marginTop: "0.75rem", padding: "8px 12px", borderRadius: "8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", fontSize: "0.8rem", color: "#f59e0b", display: "flex", alignItems: "center", gap: "6px" }}>
              <Coffee size={14} /> Lunch break notification sent at 1:00 PM.
            </div>
          )}
        </div>

        {/* Recent Attendance Log */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Recent Attendance Logs</h3>
          {recentLogins.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "0.5rem 0", textAlign: "left", fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>Date</th>
                  <th style={{ padding: "0.5rem 0", textAlign: "left", fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>Session</th>
                  <th style={{ padding: "0.5rem 0", textAlign: "left", fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentLogins.map((log, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "0.75rem 0", fontSize: "0.875rem" }}>{new Date(log.loginTime).toLocaleDateString()}</td>
                    <td style={{ padding: "0.75rem 0", fontSize: "0.875rem", textTransform: "capitalize" }}>{log.session || "login"}</td>
                    <td style={{ padding: "0.75rem 0", color: "#10b981", fontWeight: 600, fontSize: "0.875rem" }}>
                      {new Date(log.loginTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
              <Clock size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
              <p style={{ fontSize: "0.875rem" }}>No attendance records yet.</p>
              <p style={{ fontSize: "0.8rem", marginTop: "4px" }}>Use the Morning/Evening punch above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

