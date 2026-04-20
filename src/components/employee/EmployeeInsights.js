"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Camera, Video, Plus, Trash2, TrendingUp, Eye, Heart, MessageCircle, Users } from "lucide-react";

const INSIGHTS_KEY = "novelleyx_insights";

function loadInsights(userId) {
  try {
    const raw = localStorage.getItem(INSIGHTS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[userId] || { instagram: null, youtube: null, entries: [] };
  } catch { return { instagram: null, youtube: null, entries: [] }; }
}

function saveInsights(userId, data) {
  try {
    const raw = localStorage.getItem(INSIGHTS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[userId] = data;
    localStorage.setItem(INSIGHTS_KEY, JSON.stringify(all));
  } catch {}
}

const EMPTY_ENTRY = { date: "", platform: "Instagram", followers: "", views: "", likes: "", comments: "", notes: "" };

export default function EmployeeInsights() {
  const { user } = useAuth();
  const userId = user?.id || user?.email || "unknown";
  const [data, setDataRaw] = useState(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(INSIGHTS_KEY);
      const all = raw ? JSON.parse(raw) : {};
      const uId = user?.id || user?.email || "unknown";
      return all[uId] || { instagram: null, youtube: null, entries: [] };
    }
    return { instagram: null, youtube: null, entries: [] };
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_ENTRY, date: new Date().toISOString().split("T")[0] });
  const [editHandles, setEditHandles] = useState(false);
  const [handles, setHandles] = useState(() => ({
    instagram: data?.instagram || "",
    youtube: data?.youtube || ""
  }));

  useEffect(() => {
    // This will run when userId changes (e.g. account switch)
    // The initial mount is already covered by the lazy state initializer.
    const d = loadInsights(userId);
    setDataRaw(d);
    setHandles({ instagram: d.instagram || "", youtube: d.youtube || "" });
  }, [userId]);

  const save = (next) => {
    setDataRaw(next);
    saveInsights(userId, next);
  };

  const handleSaveHandles = (e) => {
    e.preventDefault();
    const next = { ...data, instagram: handles.instagram || null, youtube: handles.youtube || null };
    save(next);
    setEditHandles(false);
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!form.date || !form.platform) return;
    const entry = {
      ...form,
      id: Date.now(),
      followers: Number(form.followers) || 0,
      views: Number(form.views) || 0,
      likes: Number(form.likes) || 0,
      comments: Number(form.comments) || 0,
    };
    const next = { ...data, entries: [entry, ...data.entries] };
    save(next);
    setForm({ ...EMPTY_ENTRY, date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const next = { ...data, entries: data.entries.filter(e => e.id !== id) };
    save(next);
  };

  const latest = (platform, field) => {
    const entries = data.entries.filter(e => e.platform === platform).sort((a, b) => new Date(b.date) - new Date(a.date));
    return entries.length > 0 ? entries[0][field] || 0 : "—";
  };

  const platformColor = (p) => p === "Instagram" ? "#e1306c" : "#ff0000";
  const platformBg = (p) => p === "Instagram" ? "rgba(225,48,108,0.1)" : "rgba(255,0,0,0.1)";
  const PlatformIcon = (p) => p === "Instagram" ? Camera : Video;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Social Insights</h2>
          <p style={{ color: "var(--text-secondary)" }}>Track your Instagram & YouTube performance manually.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => setEditHandles(!editHandles)}
            style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-secondary)", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>
            {editHandles ? "Cancel" : "⚙ Set Accounts"}
          </button>
          <button onClick={() => setShowForm(!showForm)}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.875rem" }}>
            <Plus size={16} /> Log Metrics
          </button>
        </div>
      </div>

      {/* Account handles setup */}
      {editHandles && (
        <div className="card" style={{ marginBottom: "1.5rem", border: "1px solid #d4af37" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Your Social Accounts</h3>
          <form onSubmit={handleSaveHandles}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>
                  <Camera size={14} color="#e1306c" /> Instagram Handle
                </label>
                <input type="text" value={handles.instagram} onChange={e => setHandles(h => ({ ...h, instagram: e.target.value }))}
                  placeholder="@yourhandle"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>
                  <Video size={14} color="#ff0000" /> YouTube Channel
                </label>
                <input type="text" value={handles.youtube} onChange={e => setHandles(h => ({ ...h, youtube: e.target.value }))}
                  placeholder="@yourchannel"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" }} />
              </div>
            </div>
            <button type="submit" style={{ padding: "10px 24px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer" }}>
              Save Accounts
            </button>
          </form>
        </div>
      )}

      {/* Platform Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {["Instagram", "YouTube"].map(platform => {
          const handle = platform === "Instagram" ? data.instagram : data.youtube;
          const Icon = PlatformIcon(platform);
          return (
            <div key={platform} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: platformBg(platform), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={22} color={platformColor(platform)} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>{platform}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{handle || <em>Not configured</em>}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {[
                  { label: "Followers", value: latest(platform, "followers"), icon: <Users size={14} /> },
                  { label: "Views", value: latest(platform, "views"), icon: <Eye size={14} /> },
                  { label: "Likes", value: latest(platform, "likes"), icon: <Heart size={14} /> },
                  { label: "Comments", value: latest(platform, "comments"), icon: <MessageCircle size={14} /> },
                ].map((stat, i) => (
                  <div key={i} style={{ padding: "0.75rem", borderRadius: "10px", background: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.78rem", marginBottom: "4px" }}>
                      {stat.icon} {stat.label}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: "1.25rem", color: platformColor(platform) }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Log metrics form */}
      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem", border: "1px solid #d4af37" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Log New Metrics</h3>
          <form onSubmit={handleAddEntry}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Date *</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Platform *</label>
                <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" }}>
                  <option>Instagram</option>
                  <option>YouTube</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Followers</label>
                <input type="number" min="0" value={form.followers} onChange={e => setForm(f => ({ ...f, followers: e.target.value }))}
                  placeholder="0" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Views</label>
                <input type="number" min="0" value={form.views} onChange={e => setForm(f => ({ ...f, views: e.target.value }))}
                  placeholder="0" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Likes</label>
                <input type="number" min="0" value={form.likes} onChange={e => setForm(f => ({ ...f, likes: e.target.value }))}
                  placeholder="0" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Comments</label>
                <input type="number" min="0" value={form.comments} onChange={e => setForm(f => ({ ...f, comments: e.target.value }))}
                  placeholder="0" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Notes (optional)</label>
                <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="e.g. Reel went viral" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="submit" style={{ padding: "10px 24px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer" }}>Save Entry</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 24px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", cursor: "pointer", color: "var(--text-secondary)" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* History table */}
      {data.entries.length > 0 && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Metrics History</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  {["Date", "Platform", "Followers", "Views", "Likes", "Comments", "Notes", ""].map((h, i) => (
                    <th key={i} style={{ padding: "0.75rem 0.5rem", textAlign: "left", color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.8rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.entries.map(entry => (
                  <tr key={entry.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "0.75rem 0.5rem", fontSize: "0.875rem" }}>{entry.date}</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 10px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600, background: platformBg(entry.platform), color: platformColor(entry.platform) }}>
                        {entry.platform === "Instagram" ? <Camera size={11} /> : <Video size={11} />} {entry.platform}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>{entry.followers?.toLocaleString()}</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>{entry.views?.toLocaleString()}</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>{entry.likes?.toLocaleString()}</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>{entry.comments?.toLocaleString()}</td>
                    <td style={{ padding: "0.75rem 0.5rem", fontSize: "0.8rem", color: "var(--text-secondary)", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.notes}</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>
                      <button onClick={() => handleDelete(entry.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.entries.length === 0 && !showForm && (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <TrendingUp size={40} style={{ margin: "0 auto 1rem", opacity: 0.2 }} />
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>No metrics logged yet.</p>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "4px" }}>Click &quot;Log Metrics&quot; to add your first entry.</p>
        </div>
      )}
    </div>
  );
}
