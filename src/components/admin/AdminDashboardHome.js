"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Users, CheckCircle, Clock, TrendingUp } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function AdminDashboardHome() {
  const { employees } = useAuth();

  // Real stats from persisted employees
  const totalEmployees = employees.length;

  // All attendance records across all employees
  const allAttendance = employees.flatMap(emp => (emp.attendance || []));
  const totalLogins = allAttendance.length;

  // Build last-7-days attendance data
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-IN", { weekday: "short" });
    const dateStr = d.toISOString().split("T")[0];
    const count = allAttendance.filter(a => a.loginTime?.startsWith(dateStr)).length;
    last7.push({ name: label, logins: count });
  }

  // Avg attendance %
  const avgAttendance = totalEmployees > 0
    ? Math.round((totalLogins / (totalEmployees * 7)) * 100)
    : 0;

  return (
    <div>
      <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "2rem" }}>Admin Overview</h2>

      {/* Stat cards – all real data */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Employees", value: totalEmployees, icon: <Users size={22} />, color: "#d4af37", bg: "rgba(212,175,55,0.1)" },
          { label: "Total Logins", value: totalLogins, icon: <CheckCircle size={22} />, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
          { label: "Active Today", value: allAttendance.filter(a => a.loginTime?.startsWith(new Date().toISOString().split("T")[0])).length, icon: <Clock size={22} />, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
          { label: "Avg Attendance", value: `${avgAttendance}%`, icon: <TrendingUp size={22} />, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: "800", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Attendance by day chart */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Daily Attendance (Last 7 Days)</h3>
          <div style={{ height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(212,175,55,0.05)" }} contentStyle={{ borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-color)" }} />
                <Bar dataKey="logins" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent logins table */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Recent Attendance Logs</h3>
          <div style={{ overflowY: "auto", maxHeight: "260px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "0.5rem 0", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600 }}>Employee</th>
                  <th style={{ padding: "0.5rem 0", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600 }}>Punch In</th>
                  <th style={{ padding: "0.5rem 0", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600 }}>Punch Out</th>
                </tr>
              </thead>
              <tbody>
                {employees.flatMap(emp =>
                  (emp.attendance || []).map((a, i) => ({ emp, a, i }))
                ).sort((x, y) => new Date(y.a.loginTime) - new Date(x.a.loginTime)).slice(0, 10).map(({ emp, a, i }) => (
                  <tr key={`${emp.id}-${i}`} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "0.5rem 0", fontWeight: 600 }}>{emp.name}</td>
                    <td style={{ padding: "0.5rem 0", color: "#10b981" }}>
                      {new Date(a.loginTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ padding: "0.5rem 0", color: a.logoutTime ? "#ef4444" : "#f59e0b" }}>
                      {a.logoutTime ? new Date(a.logoutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Active"}
                    </td>
                  </tr>
                ))}
                {allAttendance.length === 0 && (
                  <tr><td colSpan={3} style={{ padding: "1.5rem 0", textAlign: "center", color: "var(--text-secondary)" }}>No attendance yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
