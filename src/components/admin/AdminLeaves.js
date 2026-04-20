"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Thermometer, CheckCircle, XCircle, AlertCircle, Clock, MessageSquare } from "lucide-react";

const STATUS_STYLES = {
  pending:  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: <AlertCircle size={14} />, label: "Pending" },
  approved: { color: "#10b981", bg: "rgba(16,185,129,0.1)", icon: <CheckCircle size={14} />, label: "Approved" },
  rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.1)",  icon: <XCircle size={14} />,    label: "Rejected" },
};

export default function AdminLeaves() {
  const { sickLeaves, setSickLeaves } = useAuth();
  const [filter, setFilter] = useState("all");
  const [noteInputs, setNoteInputs] = useState({});

  const leaves = (sickLeaves || []).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  const filtered = filter === "all" ? leaves : leaves.filter(l => l.status === filter);

  const pending = leaves.filter(l => l.status === "pending").length;
  const approved = leaves.filter(l => l.status === "approved").length;
  const rejected = leaves.filter(l => l.status === "rejected").length;

  const updateLeave = (id, update) => {
    setSickLeaves(prev => (prev || []).map(l => l.id === id ? { ...l, ...update } : l));
  };

  const handleApprove = (id) => updateLeave(id, { status: "approved", adminNote: noteInputs[id] || "" });
  const handleReject  = (id) => updateLeave(id, { status: "rejected", adminNote: noteInputs[id] || "" });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Leave Management</h2>
        <p style={{ color: "var(--text-secondary)" }}>Review and action employee sick leave requests.</p>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Requests", value: leaves.length, color: "#d4af37", bg: "rgba(212,175,55,0.1)" },
          { label: "Pending", value: pending, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
          { label: "Approved", value: approved, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
          { label: "Rejected", value: rejected, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {["all", "pending", "approved", "rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "6px 18px", borderRadius: "20px", border: "1px solid var(--border-color)", background: filter === f ? "linear-gradient(135deg, #d4af37, #aa7c11)" : "var(--bg-main)", color: filter === f ? "#111" : "var(--text-secondary)", fontWeight: filter === f ? 700 : 500, cursor: "pointer", fontSize: "0.875rem", textTransform: "capitalize" }}>
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {/* Leaves list */}
      <div className="card">
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
            <Thermometer size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
            <p style={{ fontSize: "0.875rem" }}>No {filter !== "all" ? filter : ""} leave requests found.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map(leave => {
              const s = STATUS_STYLES[leave.status] || STATUS_STYLES.pending;
              return (
                <div key={leave.id} style={{ padding: "1.25rem", borderRadius: "12px", border: `1px solid ${leave.status === "pending" ? "#d4af37" : "var(--border-color)"}`, background: "var(--bg-main)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      {/* Employee + status */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #d4af37, #aa7c11)", display: "flex", alignItems: "center", justifyContent: "center", color: "#111", fontWeight: 700, fontSize: "0.9rem" }}>
                          {leave.employeeName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{leave.employeeName}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{leave.employeeEmail}</div>
                        </div>
                        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 12px", borderRadius: "20px", background: s.bg, color: s.color, fontWeight: 700, fontSize: "0.78rem" }}>
                          {s.icon} {s.label}
                        </span>
                      </div>

                      {/* Details */}
                      <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                        <span><strong>Reason:</strong> {leave.reason}</span>
                        <span><Clock size={12} style={{ display: "inline", verticalAlign: "middle" }} /> {leave.startDate}{leave.startDate !== leave.endDate ? ` → ${leave.endDate}` : ""} ({leave.days} day{leave.days > 1 ? "s" : ""})</span>
                        <span style={{ opacity: 0.6 }}>Submitted: {new Date(leave.submittedAt).toLocaleDateString()}</span>
                      </div>
                      {leave.notes && <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontStyle: "italic", marginBottom: "8px" }}>{leave.notes}</p>}
                      {leave.adminNote && <div style={{ padding: "6px 10px", borderRadius: "6px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", fontSize: "0.8rem", marginBottom: "8px" }}><strong>Note:</strong> {leave.adminNote}</div>}

                      {/* Action area for pending */}
                      {leave.status === "pending" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, minWidth: "200px", padding: "6px 10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-card)" }}>
                            <MessageSquare size={13} color="var(--text-secondary)" />
                            <input
                              type="text"
                              placeholder="Add a note (optional)..."
                              value={noteInputs[leave.id] || ""}
                              onChange={e => setNoteInputs(n => ({ ...n, [leave.id]: e.target.value }))}
                              style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "0.8rem", color: "var(--text-primary)" }}
                            />
                          </div>
                          <button onClick={() => handleApprove(leave.id)}
                            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", background: "#10b981", color: "white", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.8rem" }}>
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button onClick={() => handleReject(leave.id)}
                            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", background: "#ef4444", color: "white", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.8rem" }}>
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
