"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from "recharts";

const progressionData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 75 },
  { month: "Apr", score: 82 },
  { month: "May", score: 86 },
  { month: "Jun", score: 92 },
];

export default function EmployeeSkills() {
  const { user } = useAuth();
  
  // Format skills for Radar Chart
  const radarData = user?.skills 
    ? Object.entries(user.skills).map(([subject, A]) => ({ subject, A, fullMark: 100 }))
    : [
        { subject: 'React', A: 80, fullMark: 100 },
        { subject: 'Node.js', A: 65, fullMark: 100 },
        { subject: 'Design', A: 90, fullMark: 100 },
        { subject: 'DevOps', A: 40, fullMark: 100 },
        { subject: 'Testing', A: 70, fullMark: 100 },
      ];

  return (
    <div>
      <div className="mb-8">
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Skill Progression & Analytics</h2>
        <p>Track your learning journey and view AI-driven recommendations.</p>
      </div>

      <div className="grid grid-cols-2 mb-8">
        <div className="card">
          <h3 className="mb-4" style={{ fontWeight: 600 }}>Overall Growth Trajectory</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} />
                <Line type="monotone" dataKey="score" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "var(--bg-card)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4" style={{ fontWeight: 600 }}>Skill Distribution Matrix</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skill Level" dataKey="A" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.5} />
                <Tooltip contentStyle={{ borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4" style={{ fontWeight: 600 }}>AI Personalized Roadmap</h3>
        <div className="grid grid-cols-3 gap-4">
          <div style={{ padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-main)" }}>
            <div style={{ padding: "0.25rem 0.75rem", background: "rgba(99,102,241,0.1)", color: "var(--primary-color)", borderRadius: "999px", display: "inline-block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "1rem" }}>Priority 1</div>
            <h4 style={{ marginBottom: "0.5rem" }}>Advanced State Management</h4>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>Master Redux Toolkit and Zustand for complex applications.</p>
            <div style={{ width: "100%", background: "var(--border-color)", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: "40%", background: "var(--primary-color)", height: "100%" }}></div>
            </div>
            <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", textAlign: "right", color: "var(--text-secondary)" }}>40% Complete</p>
          </div>

          <div style={{ padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-main)" }}>
            <div style={{ padding: "0.25rem 0.75rem", background: "rgba(245,158,11,0.1)", color: "var(--warning-color)", borderRadius: "999px", display: "inline-block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "1rem" }}>Priority 2</div>
            <h4 style={{ marginBottom: "0.5rem" }}>Cloud Deployment Concepts</h4>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>Learn to deploy full-stack apps on AWS and Vercel.</p>
            <div style={{ width: "100%", background: "var(--border-color)", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: "10%", background: "var(--warning-color)", height: "100%" }}></div>
            </div>
            <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", textAlign: "right", color: "var(--text-secondary)" }}>10% Complete</p>
          </div>

          <div style={{ padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-main)", opacity: 0.7 }}>
            <div style={{ padding: "0.25rem 0.75rem", background: "rgba(100,116,139,0.1)", color: "var(--text-secondary)", borderRadius: "999px", display: "inline-block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "1rem" }}>Locked</div>
            <h4 style={{ marginBottom: "0.5rem" }}>System Architecture Design</h4>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>Microservices, message queues, and database design.</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Complete Priority 1 & 2 to unlock</p>
          </div>
        </div>
      </div>
    </div>
  );
}
