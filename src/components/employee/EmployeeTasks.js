"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, MessageSquare } from "lucide-react";

function loadTasks() {
  try { return JSON.parse(localStorage.getItem("novelleyx_tasks") || "[]"); } catch { return []; }
}
function saveTasks(tasks) {
  try { localStorage.setItem("novelleyx_tasks", JSON.stringify(tasks)); } catch {}
}

export default function EmployeeTasks() {
  const { user } = useAuth();
  const [tasks, setTasksState] = useState([]);
  const [reviewText, setReviewText] = useState({});

  useEffect(() => {
    setTasksState(loadTasks());
  }, []);

  const setTasks = (updater) => {
    const resolved = typeof updater === "function" ? updater(tasks) : updater;
    setTasksState(resolved);
    saveTasks(resolved);
  };

  // Only show tasks assigned to this employee
  const myTasks = tasks.filter(t => t.assignee === user?.name);

  const handleStatusChange = (id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleAddReview = (id) => {
    const text = (reviewText[id] || "").trim();
    if (!text) return;
    const review = {
      author: user?.name || "Employee",
      text,
      time: new Date().toISOString(),
    };
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, reviews: [...(t.reviews || []), review] } : t
    ));
    setReviewText(prev => ({ ...prev, [id]: "" }));
  };

  const statusColor = (s) => s === "Completed" ? "#10b981" : s === "In Progress" ? "#d4af37" : "#6b7280";

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>My Tasks</h2>
        <p style={{ color: "var(--text-secondary)" }}>Tasks assigned to you by the admin. Submit reviews and mark completion.</p>
      </div>

      {myTasks.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-secondary)" }}>
          <CheckCircle size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
          <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>No Tasks Yet</h3>
          <p style={{ fontSize: "0.875rem" }}>Your admin hasn't assigned any tasks to you yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {myTasks.map(task => (
            <div key={task.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "4px" }}>{task.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{task.description}</p>
                </div>
                <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700, background: `${statusColor(task.status)}20`, color: statusColor(task.status), flexShrink: 0 }}>
                  {task.status}
                </span>
              </div>

              {/* Previous reviews */}
              {(task.reviews || []).length > 0 && (
                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", marginBottom: "0.75rem" }}>
                  <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <MessageSquare size={14} /> Your Reviews
                  </h4>
                  {task.reviews.filter(r => r.author === user?.name).map((r, i) => (
                    <div key={i} style={{ padding: "0.625rem 0.875rem", borderRadius: "8px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", marginBottom: "6px" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "2px" }}>{new Date(r.time).toLocaleString()}</div>
                      <p style={{ fontSize: "0.875rem", margin: 0 }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Review form */}
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.875rem" }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: "6px" }}>
                  Add Review / Comment
                </label>
                <textarea
                  rows={2}
                  value={reviewText[task.id] || ""}
                  onChange={e => setReviewText(prev => ({ ...prev, [task.id]: e.target.value }))}
                  placeholder="Describe your progress, questions, or updates..."
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", resize: "vertical", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.625rem" }}>
                  <button
                    onClick={() => handleAddReview(task.id)}
                    disabled={!(reviewText[task.id] || "").trim()}
                    style={{ padding: "8px 18px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.85rem", opacity: (reviewText[task.id] || "").trim() ? 1 : 0.5 }}
                  >
                    Submit Review
                  </button>
                  {task.status !== "Completed" && (
                    <button
                      onClick={() => handleStatusChange(task.id, "Completed")}
                      style={{ padding: "8px 18px", borderRadius: "8px", background: "rgba(16,185,129,0.12)", color: "#10b981", fontWeight: 700, border: "1px solid #10b981", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      <CheckCircle size={15} /> Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
