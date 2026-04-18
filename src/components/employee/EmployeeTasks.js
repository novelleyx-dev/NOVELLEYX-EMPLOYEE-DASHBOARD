"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, MessageSquare } from "lucide-react";
import { supabase, isSupabaseReady } from "@/lib/supabase";

function lsLoad() { try { return JSON.parse(localStorage.getItem("novelleyx_tasks") || "[]"); } catch { return []; } }
function lsSave(t) { try { localStorage.setItem("novelleyx_tasks", JSON.stringify(t)); } catch {} }

export default function EmployeeTasks() {
  const { user } = useAuth();
  const [tasks, setTasksState] = useState([]);
  const [reviewText, setReviewText] = useState({});

  const setTasks = useCallback((updater) => {
    setTasksState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      lsSave(next);
      return next;
    });
  }, []);

  useEffect(() => {
    async function load() {
      if (isSupabaseReady) {
        const { data } = await supabase.from("tasks").select("*").order("created_at");
        if (data) { setTasksState(data); lsSave(data); return; }
      }
      setTasksState(lsLoad());
    }
    load();

    if (isSupabaseReady) {
      const sub = supabase.channel("emp_tasks_ch")
        .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => {
          supabase.from("tasks").select("*").order("created_at").then(({ data }) => {
            if (data) { setTasksState(data); lsSave(data); }
          });
        }).subscribe();
      return () => sub.unsubscribe();
    }
  }, []);

  const myTasks = tasks.filter(t => t.assignee === user?.name);

  const handleStatusChange = async (id, status) => {
    if (isSupabaseReady) await supabase.from("tasks").update({ status }).eq("id", id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleAddReview = async (id) => {
    const text = (reviewText[id] || "").trim();
    if (!text) return;
    const review = { author: user?.name || "Employee", text, time: new Date().toISOString() };
    const task = tasks.find(t => t.id === id);
    const updatedReviews = [...(task?.reviews || []), review];
    if (isSupabaseReady) {
      await supabase.from("tasks").update({ reviews: updatedReviews }).eq("id", id);
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, reviews: updatedReviews } : t));
    setReviewText(prev => ({ ...prev, [id]: "" }));
  };

  const statusColor = (s) => s === "Completed" ? "#10b981" : s === "In Progress" ? "#d4af37" : "#6b7280";

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>My Tasks</h2>
        <p style={{ color: "var(--text-secondary)" }}>Tasks assigned to you by the admin.</p>
      </div>
      {myTasks.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-secondary)" }}>
          <CheckCircle size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
          <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>No Tasks Yet</h3>
          <p style={{ fontSize: "0.875rem" }}>Your admin hasn't assigned any tasks to you yet.</p>
        </div>
      ) : myTasks.map(task => (
        <div key={task.id} className="card" style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "4px" }}>{task.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{task.description}</p>
            </div>
            <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700, background: `${statusColor(task.status)}20`, color: statusColor(task.status), flexShrink: 0 }}>{task.status}</span>
          </div>
          {(task.reviews || []).filter(r => r.author === user?.name).length > 0 && (
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", marginBottom: "0.75rem" }}>
              <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <MessageSquare size={14} /> Your Reviews
              </h4>
              {(task.reviews || []).filter(r => r.author === user?.name).map((r, i) => (
                <div key={i} style={{ padding: "0.625rem 0.875rem", borderRadius: "8px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", marginBottom: "6px" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "2px" }}>{new Date(r.time).toLocaleString()}</div>
                  <p style={{ fontSize: "0.875rem", margin: 0 }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.875rem" }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: "6px" }}>Add Review / Comment</label>
            <textarea rows={2} value={reviewText[task.id] || ""} onChange={e => setReviewText(p => ({ ...p, [task.id]: e.target.value }))}
              placeholder="Describe your progress or questions..."
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", resize: "vertical", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.625rem" }}>
              <button onClick={() => handleAddReview(task.id)} disabled={!(reviewText[task.id] || "").trim()}
                style={{ padding: "8px 18px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.85rem", opacity: (reviewText[task.id] || "").trim() ? 1 : 0.5 }}>
                Submit Review
              </button>
              {task.status !== "Completed" && (
                <button onClick={() => handleStatusChange(task.id, "Completed")}
                  style={{ padding: "8px 18px", borderRadius: "8px", background: "rgba(16,185,129,0.12)", color: "#10b981", fontWeight: 700, border: "1px solid #10b981", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle size={15} /> Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
