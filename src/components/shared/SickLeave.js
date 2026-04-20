"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Thermometer, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const REASONS = ["Fever / Flu", "Injury", "Medical Appointment", "Family Emergency", "Mental Health Day", "Other"];

const STATUS_STYLES = {
  pending:  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: <AlertCircle size={14} />, label: "Pending" },
  approved: { color: "#10b981", bg: "rgba(16,185,129,0.1)", icon: <CheckCircle size={14} />, label: "Approved" },
  rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.1)",  icon: <XCircle size={14} />,    label: "Rejected" },
};

export default function SickLeave() {
  const { user, sickLeaves, setSickLeaves, addNotification } = useAuth();
  const userId = user?.id || user?.email;

  const myLeaves = (sickLeaves || []).filter(l => l.employeeId === userId)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: REASONS[0],
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) return;
    const days = Math.max(1, Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1);
    const leave = {
      id: Date.now(),
      employeeId: userId,
      employeeName: user?.name || "Employee",
      employeeEmail: user?.email || "",
      startDate: form.startDate,
      endDate: form.endDate,
      days,
      reason: form.reason,
      notes: form.notes,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    setSickLeaves(prev => [leave, ...(prev || [])]);
    addNotification(`🤒 Sick leave request submitted for ${form.startDate}${form.startDate !== form.endDate ? ` – ${form.endDate}` : ""} (${days} day${days > 1 ? "s" : ""}).`, "Leave");
    setForm({ startDate: new Date().toISOString().split("T")[0], endDate: new Date().toISOString().split("T")[0], reason: REASONS[0], notes: "" });
    setShowForm(false);
  };

  const pending = myLeaves.filter(l => l.status === "pending").length;
  const approved = myLeaves.filter(l => l.status === "approved").length;
  const totalDays = myLeaves.filter(l => l.status === "approved").reduce((s, l) => s + (l.days || 1), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Sick Leave</h2>
          <p style={{ color: "var(--text-secondary)" }}>Submit and track your sick leave requests.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.9rem" }}>
          <Plus size={18} /> Request Leave
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Pending Requests", value: pending, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
          { label: "Approved Leaves", value: approved, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
          { label: "Total Days Taken", value: totalDays, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Request Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem", border: "1px solid #d4af37" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
            <Thermometer size={20} color="#d4af37" />
            <h3 style={{ fontWeight: 700, margin: 0 }}>New Sick Leave Request</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Start Date *</label>
                <input type="date" value={form.startDate} min={new Date().toISOString().split("T")[0]}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>End Date *</label>
                <input type="date" value={form.endDate} min={form.startDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Reason *</label>
                <select value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" }}>
                  {REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Additional Notes (optional)</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any additional information for the admin..."
                  rows={3}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", resize: "vertical", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="submit" style={{ padding: "10px 24px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer" }}>
                Submit Request
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 24px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", cursor: "pointer", color: "var(--text-secondary)" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave History */}
      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>My Leave History</h3>
        {myLeaves.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
            <Thermometer size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
            <p style={{ fontSize: "0.875rem" }}>No leave requests yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {myLeaves.map(leave => {
              const s = STATUS_STYLES[leave.status] || STATUS_STYLES.pending;
              return (
                <div key={leave.id} style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-main)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <Thermometer size={15} color="#d4af37" />
                      <span style={{ fontWeight: 700 }}>{leave.reason}</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>· {leave.days} day{leave.days > 1 ? "s" : ""}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clock size={12} />
                      {leave.startDate}{leave.startDate !== leave.endDate ? ` → ${leave.endDate}` : ""}
                      <span style={{ marginLeft: "8px", opacity: 0.6 }}>Submitted: {new Date(leave.submittedAt).toLocaleDateString()}</span>
                    </div>
                    {leave.notes && <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "6px", fontStyle: "italic" }}>{leave.notes}</p>}
                    {leave.adminNote && (
                      <div style={{ marginTop: "6px", padding: "6px 10px", borderRadius: "6px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", fontSize: "0.8rem" }}>
                        <strong>Admin:</strong> {leave.adminNote}
                      </div>
                    )}
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 12px", borderRadius: "20px", background: s.bg, color: s.color, fontWeight: 700, fontSize: "0.78rem", flexShrink: 0 }}>
                    {s.icon} {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
