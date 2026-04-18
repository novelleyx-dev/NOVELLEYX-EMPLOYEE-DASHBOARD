"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, Target, Award, Calendar as CalendarIcon } from "lucide-react";

export default function EmployeeDashboardHome() {
  const { user } = useAuth();
  
  // Parse attendance securely
  const recentLogins = user?.attendance?.slice(-3).reverse() || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Welcome back, {user?.name}!</h2>
          <p>Here is what's happening with your projects today.</p>
        </div>
        <img 
          src={user?.avatar || "/next.svg"} 
          alt="Profile" 
          style={{ width: "60px", height: "60px", borderRadius: "50%", border: "3px solid var(--primary-color)", objectFit: "cover" }} 
        />
      </div>

      <div className="grid grid-cols-4 mb-8">
        <div className="card stat-card w-full">
          <div className="stat-icon" style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary-color)" }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-content">
            <h3>12</h3>
            <p>Active Tasks</p>
          </div>
        </div>
        
        <div className="card stat-card w-full">
          <div className="stat-icon" style={{ background: "rgba(16,185,129,0.1)", color: "var(--success-color)" }}>
            <Target size={24} />
          </div>
          <div className="stat-content">
            <h3>4</h3>
            <p>Completed This Week</p>
          </div>
        </div>
        
        <div className="card stat-card w-full">
          <div className="stat-icon" style={{ background: "rgba(245,158,11,0.1)", color: "var(--warning-color)" }}>
            <Award size={24} />
          </div>
          <div className="stat-content">
            <h3>Top 5%</h3>
            <p>Skill Ranking</p>
          </div>
        </div>

        <div className="card stat-card w-full">
          <div className="stat-icon" style={{ background: "rgba(59,130,246,0.1)", color: "var(--info-color)" }}>
            <CalendarIcon size={24} />
          </div>
          <div className="stat-content">
            <h3 style={{ fontSize: "1.1rem" }}>{recentLogins.length > 0 ? new Date(recentLogins[0].loginTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}</h3>
            <p>Last Login</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 className="mb-4" style={{ fontWeight: 600 }}>Skill Recommendations (AI Suggested)</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <li style={{ padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: 0 }}>Advanced React Patterns</h4>
                <p style={{ margin: 0, fontSize: "0.85rem" }}>Boost your UI component engineering</p>
              </div>
              <button className="btn-outline">Start</button>
            </li>
            <li style={{ padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: 0 }}>TypeScript Basics</h4>
                <p style={{ margin: 0, fontSize: "0.85rem" }}>Recommended based on your recent projects</p>
              </div>
              <button className="btn-outline">Start</button>
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="mb-4" style={{ fontWeight: 600 }}>Recent Attendance Logs</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 0", color: "var(--text-secondary)", fontWeight: 500 }}>Date</th>
                <th style={{ padding: "0.75rem 0", color: "var(--text-secondary)", fontWeight: 500 }}>Login</th>
                <th style={{ padding: "0.75rem 0", color: "var(--text-secondary)", fontWeight: 500 }}>Logout</th>
              </tr>
            </thead>
            <tbody>
              {recentLogins.length > 0 ? recentLogins.map((log, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem 0" }}>{new Date(log.loginTime).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem 0" }}>{new Date(log.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td style={{ padding: "1rem 0" }}>{log.logoutTime ? new Date(log.logoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} style={{ padding: "1rem 0", textAlign: "center", color: "var(--text-secondary)" }}>No recent logs</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
