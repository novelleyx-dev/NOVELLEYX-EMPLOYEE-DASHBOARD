"use client";

import React from "react";
import { Users, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

const performanceData = [
  { name: "Mon", tasks: 12, completed: 10 },
  { name: "Tue", tasks: 19, completed: 15 },
  { name: "Wed", tasks: 15, completed: 14 },
  { name: "Thu", tasks: 22, completed: 20 },
  { name: "Fri", tasks: 18, completed: 17 },
];

const attendanceData = [
  { name: "Week 1", rate: 95 },
  { name: "Week 2", rate: 98 },
  { name: "Week 3", rate: 92 },
  { name: "Week 4", rate: 99 },
];

export default function AdminDashboardHome() {
  return (
    <div>
      <h2 className="mb-8" style={{ fontSize: "1.75rem", fontWeight: "700" }}>Admin Overview</h2>
      
      <div className="grid grid-cols-4 mb-8">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary-color)" }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>24</h3>
            <p>Total Employees</p>
          </div>
        </div>
        
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "rgba(16,185,129,0.1)", color: "var(--success-color)" }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>482</h3>
            <p>Tasks Completed</p>
          </div>
        </div>
        
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "rgba(245,158,11,0.1)", color: "var(--warning-color)" }}>
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>96%</h3>
            <p>Avg. Attendance</p>
          </div>
        </div>
        
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "rgba(59,130,246,0.1)", color: "var(--info-color)" }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>+15%</h3>
            <p>Performance Growth</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 className="mb-4" style={{ fontWeight: 600 }}>Task Completion Stats</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} />
                <Bar dataKey="tasks" fill="var(--border-color)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4" style={{ fontWeight: 600 }}>Attendance Heatmap (Trend)</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} />
                <Line type="monotone" dataKey="rate" stroke="var(--success-color)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
