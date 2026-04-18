"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const performanceData = [
  { name: "Jan", score: 65, efficiency: 70 },
  { name: "Feb", score: 72, efficiency: 75 },
  { name: "Mar", score: 85, efficiency: 82 },
  { name: "Apr", score: 90, efficiency: 88 }
];

const distributionData = [
  { name: "Engineering", value: 400 },
  { name: "Design", value: 300 },
  { name: "Marketing", value: 300 },
  { name: "HR", value: 200 }
];

const COLORS = ['#d4af37', '#aa7c11', '#111111', '#666666'];

export default function AdminAnalytics() {
  const { employees } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Advanced Analytics</h2>
        <p>Insights into employee performance and company distribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="mb-4 text-lg font-bold">Company Growth & Performance</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#d4af37" fillOpacity={1} fill="url(#colorScore)" />
                <Area type="monotone" dataKey="efficiency" stroke="#111111" fillOpacity={1} fill="url(#colorEff)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 text-lg font-bold">Department Distribution</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="mb-4 text-lg font-bold">Employee Skill Matrix</h3>
        <div style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { skill: "React", avg: 85 },
              { skill: "Node.js", avg: 72 },
              { skill: "Design", avg: 90 },
              { skill: "Marketing", avg: 60 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="skill" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="avg" fill="#d4af37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
