"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { BarChart2 } from "lucide-react";

export default function EmployeeSkills() {
  const { user } = useAuth();
  const skills = user?.skills || {};
  const hasSkills = Object.keys(skills).length > 0;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Skill Progression</h2>
        <p style={{ color: "var(--text-secondary)" }}>Your skills will be tracked and updated here by the admin.</p>
      </div>

      {hasSkills ? (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1.5rem" }}>Your Skills</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {Object.entries(skills).map(([skill, level]) => (
              <div key={skill}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{skill}</span>
                  <span style={{ fontSize: "0.875rem", color: "#aa7c11", fontWeight: 700 }}>{level}%</span>
                </div>
                <div style={{ height: "8px", borderRadius: "4px", background: "var(--border-color)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${level}%`, background: "linear-gradient(90deg, #d4af37, #aa7c11)", borderRadius: "4px", transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <BarChart2 size={48} style={{ margin: "0 auto 1rem", opacity: 0.3, color: "var(--text-secondary)" }} />
          <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>No Skills Tracked Yet</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "360px", margin: "0 auto" }}>
            Your skill scores will appear here once your admin updates your profile. Complete your assigned tasks to demonstrate your abilities!
          </p>
        </div>
      )}
    </div>
  );
}
