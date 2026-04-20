"use client";

import React, { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#d4af37", "#aa7c11", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function AdminAnalytics() {
  const { employees } = useAuth();

  // ── Live: attendance per day (last 7 days) ────────────────────────────────
  const attendanceChart = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-IN", { weekday: "short" });
      const dateStr = d.toISOString().split("T")[0];
      const count = employees.flatMap(e => e.attendance || [])
        .filter(a => a.loginTime?.startsWith(dateStr)).length;
      days.push({ name: label, logins: count });
    }
    return days;
  }, [employees]);

  // ── Live: role / department distribution ──────────────────────────────────
  const roleChart = useMemo(() => {
    const counts = {};
    employees.forEach(e => {
      const key = e.department || e.role || "Employee";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [employees]);

  // ── Live: total attendance sessions per employee (top 8) ──────────────────
  const perEmployeeChart = useMemo(() =>
    employees
      .map(e => ({ name: e.name?.split(" ")[0] || "?", sessions: (e.attendance || []).length }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 8),
    [employees]
  );

  // ── Live: avg hours worked per employee ───────────────────────────────────
  const hoursChart = useMemo(() =>
    employees.map(e => {
      const att = e.attendance || [];
      let total = 0;
      att.forEach(a => {
        if (a.loginTime && a.logoutTime) {
          total += (new Date(a.logoutTime) - new Date(a.loginTime)) / 3600000;
        }
      });
      return { name: e.name?.split(" ")[0] || "?", hours: parseFloat(total.toFixed(1)) };
    }).filter(e => e.hours > 0),
    [employees]
  );

  const noData = (
    <div style={{ height: "220px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: "0.875rem", flexDirection: "column", gap: "8px" }}>
      <span style={{ fontSize: "2rem", opacity: 0.3 }}>📊</span>
      No data yet - will populate as employees log in.
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Analytics</h2>
        <p style={{ color: "var(--text-secondary)" }}>Live data from {employees.length} employee{employees.length !== 1 ? "s" : ""}.</p>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Employees", value: employees.length, color: "#d4af37", bg: "rgba(212,175,55,0.1)" },
          { label: "Approved", value: employees.filter(e => e.approved).length, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
          { label: "Total Attendance Sessions", value: employees.flatMap(e => e.attendance || []).length, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
          { label: "Active Today", value: employees.flatMap(e => e.attendance || []).filter(a => a.loginTime?.startsWith(new Date().toISOString().split("T")[0])).length, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Attendance per day */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Daily Logins (Last 7 Days)</h3>
          {attendanceChart.every(d => d.logins === 0) ? noData : (
            <div style={{ height: "220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-color)" }} />
                  <Bar dataKey="logins" fill="#d4af37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Role / Department pie */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Employee Distribution</h3>
          {roleChart.length === 0 ? noData : (
            <div style={{ height: "220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roleChart} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={5} dataKey="value">
                    {roleChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-color)" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Sessions per employee */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Attendance Sessions per Employee</h3>
          {perEmployeeChart.length === 0 ? noData : (
            <div style={{ height: "220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perEmployeeChart} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                  <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={70} />
                  <Tooltip contentStyle={{ borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-color)" }} />
                  <Bar dataKey="sessions" fill="#aa7c11" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Hours worked */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Total Hours Worked</h3>
          {hoursChart.length === 0 ? noData : (
            <div style={{ height: "220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hoursChart}>
                  <defs>
                    <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-color)" }} />
                  <Area type="monotone" dataKey="hours" stroke="#d4af37" fill="url(#hoursGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

