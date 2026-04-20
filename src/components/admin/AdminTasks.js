"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseReady } from "@/lib/supabase";

function lsLoad() { try { return JSON.parse(localStorage.getItem("novelleyx_tasks") || "[]"); } catch { return []; } }
function lsSave(t) { try { localStorage.setItem("novelleyx_tasks", JSON.stringify(t)); } catch {} }

export default function AdminTasks() {
  const { employees } = useAuth();
  const [tasks, setTasksState] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", assignee: "", description: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [expanded, setExpanded] = useState({});

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

    // Real-time subscription
    if (isSupabaseReady) {
      const sub = supabase.channel("tasks_channel")
        .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => {
          supabase.from("tasks").select("*").order("created_at").then(({ data }) => {
            if (data) { setTasksState(data); lsSave(data); }
          });
        }).subscribe();
      return () => sub.unsubscribe();
    }
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignee) return;
    const task = { title: newTask.title, assignee: newTask.assignee, description: newTask.description, status: "Pending", reviews: [] };
    if (isSupabaseReady) {
      const { data } = await supabase.from("tasks").insert([task]).select().single();
      if (data) setTasks(prev => [...prev, data]);
    } else {
      setTasks(prev => [...prev, { ...task, id: Date.now(), created_at: new Date().toISOString() }]);
    }
    setNewTask({ title: "", assignee: "", description: "" });
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    if (isSupabaseReady) await supabase.from("tasks").delete().eq("id", id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const statusColor = (s) => s === "Completed" ? "#10b981" : s === "In Progress" ? "#d4af37" : "#6b7280";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Task Management</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Assign tasks and view employee reviews.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "10px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer" }}>
          <Plus size={18} /> Assign New Task
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: "1.5rem", border: "1px solid #d4af37" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Create New Task</h3>
          <form onSubmit={handleAddTask}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Task Title *</label>
                <input type="text" required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Assign To *</label>
                <select required value={newTask.assignee} onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)" }}>
                  <option value="">Select Employee...</option>
                  {employees.filter(e => e.approved).map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Description</label>
                <textarea value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} rows={3}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="submit" style={{ padding: "10px 24px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer" }}>Create Task</button>
              <button type="button" onClick={() => setShowAdd(false)} style={{ padding: "10px 24px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", cursor: "pointer", color: "var(--text-secondary)" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {tasks.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
            No tasks assigned yet. Click &quot;Assign New Task&quot; to create one.
          </div>
        )}
        {tasks.map(task => (
          <div key={task.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{task.title}</h3>
                  <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600, background: `${statusColor(task.status)}20`, color: statusColor(task.status) }}>{task.status}</span>
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{task.description}</p>
                <p style={{ fontSize: "0.8rem", color: "#aa7c11", marginTop: "6px", fontWeight: 600 }}>Assigned to: {task.assignee}</p>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button onClick={() => setExpanded(p => ({ ...p, [task.id]: !p[task.id] }))}
                  style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", cursor: "pointer", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <MessageSquare size={14} /> {(task.reviews || []).length} Review{(task.reviews || []).length !== 1 ? "s" : ""}
                  {expanded[task.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button onClick={() => handleDelete(task.id)} style={{ color: "#ef4444", padding: "6px", borderRadius: "6px", border: "none", cursor: "pointer", background: "transparent" }}><Trash2 size={16} /></button>
              </div>
            </div>
            {expanded[task.id] && (
              <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                <h4 style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.75rem", color: "var(--text-secondary)" }}>Employee Reviews & Comments</h4>
                {(task.reviews || []).length === 0 ? (
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic" }}>No reviews submitted yet.</p>
                ) : (task.reviews || []).map((r, i) => (
                  <div key={i} style={{ padding: "0.875rem 1rem", borderRadius: "10px", background: "var(--bg-main)", border: "1px solid var(--border-color)", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#aa7c11" }}>{r.author}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{new Date(r.time).toLocaleString()}</span>
                    </div>
                    <p style={{ fontSize: "0.875rem", margin: 0 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
