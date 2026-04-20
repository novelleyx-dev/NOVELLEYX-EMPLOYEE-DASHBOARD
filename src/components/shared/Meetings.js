"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Calendar, Clock, Link, Trash2, Video, ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MEETINGS_KEY = "novelleyx_meetings";

function loadMeetings() {
  try {
    const raw = localStorage.getItem(MEETINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveMeetings(m) {
  try { localStorage.setItem(MEETINGS_KEY, JSON.stringify(m)); } catch {}
}

export default function Meetings() {
  const { user, addNotification } = useAuth();
  const isAdmin = user?.role === "admin";

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [meetings, setMeetingsRaw] = useState(loadMeetings);

  useEffect(() => {
    const t = setInterval(() => {
      const fresh = loadMeetings();
      setMeetingsRaw(fresh);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const setMeetings = (updater) => {
    setMeetingsRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveMeetings(next);
      return next;
    });
  };

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", link: "", description: "" });
  const [formError, setFormError] = useState("");

  // Calendar logic
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); };

  const getMeetingsForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return meetings.filter(m => m.date === dateStr);
  };

  const handleAddMeeting = (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.title || !form.date || !form.time) {
      setFormError("Title, date, and time are required.");
      return;
    }
    const newMeeting = {
      id: Date.now(),
      ...form,
      host: user?.name || "Admin",
    };
    setMeetings(prev => [...prev, newMeeting]);
    addNotification(`📅 New meeting scheduled: "${form.title}" on ${form.date} at ${form.time}`, "Meeting");
    setForm({ title: "", date: "", time: "", link: "", description: "" });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
  };

  // Meetings for selected date or upcoming
  const todayStr = today.toISOString().split("T")[0];
  const displayedMeetings = selectedDate
    ? getMeetingsForDate(selectedDate)
    : meetings
        .filter(m => m.date >= todayStr)
        .sort((a, b) => new Date(a.date + "T" + (a.time || "00:00")) - new Date(b.date + "T" + (b.time || "00:00")));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Meetings</h2>
          <p style={{ color: "var(--text-secondary)" }}>{isAdmin ? "Schedule and manage team meetings." : "View your upcoming meetings."}</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.9rem" }}
          >
            <Plus size={18} /> Schedule Meeting
          </button>
        )}
      </div>

      {/* Schedule Form (Admin only) */}
      {showForm && isAdmin && (
        <div className="card" style={{ marginBottom: "1.5rem", border: "1px solid #d4af37" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>New Meeting</h3>
          {formError && (
            <div style={{ padding: "0.75rem", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", color: "#ef4444", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {formError}
            </div>
          )}
          <form onSubmit={handleAddMeeting}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Meeting Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Weekly Sync"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem" }}
                />
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>
                  <Calendar size={14} /> Date *
                </label>
                <input
                  type="date"
                  value={form.date}
                  min={today.toISOString().split("T")[0]}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem" }}
                />
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>
                  <Clock size={14} /> Time *
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem" }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>
                  <Link size={14} /> Meeting Link (Google Meet / Zoom)
                </label>
                <input
                  type="url"
                  value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem" }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="What is this meeting about?"
                  rows={2}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", resize: "vertical" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="submit" style={{ padding: "10px 24px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer" }}>
                Create Meeting
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 24px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", cursor: "pointer", color: "var(--text-secondary)" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "1.5rem" }}>
        {/* Calendar */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <button onClick={prevMonth} style={{ padding: "6px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", cursor: "pointer", color: "var(--text-secondary)" }}><ChevronLeft size={16} /></button>
            <span style={{ fontWeight: 700, fontSize: "1rem" }}>{MONTHS[currentMonth]} {currentYear}</span>
            <button onClick={nextMonth} style={{ padding: "6px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", cursor: "pointer", color: "var(--text-secondary)" }}><ChevronRight size={16} /></button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "8px" }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", padding: "4px" }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
            {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const hasMeeting = meetings.some(m => m.date === dateStr);
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              const isSelected = selectedDate === day;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : day)}
                  style={{
                    padding: "8px 4px", borderRadius: "8px", border: "none", cursor: "pointer", textAlign: "center",
                    background: isSelected ? "linear-gradient(135deg, #d4af37, #aa7c11)" : isToday ? "rgba(212,175,55,0.15)" : "transparent",
                    color: isSelected ? "#111" : isToday ? "#aa7c11" : "var(--text-primary)",
                    fontWeight: isToday || isSelected ? 700 : 400,
                    fontSize: "0.85rem", position: "relative",
                  }}
                >
                  {day}
                  {hasMeeting && !isSelected && (
                    <span style={{ position: "absolute", bottom: "3px", left: "50%", transform: "translateX(-50%)", width: "5px", height: "5px", borderRadius: "50%", background: "#d4af37", display: "block" }} />
                  )}
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div style={{ marginTop: "1rem", padding: "8px 12px", borderRadius: "8px", background: "rgba(212,175,55,0.1)", fontSize: "0.8rem", color: "#aa7c11", fontWeight: 600 }}>
              Showing meetings for {MONTHS[currentMonth]} {selectedDate}
              <button onClick={() => setSelectedDate(null)} style={{ marginLeft: "8px", color: "var(--text-secondary)", fontWeight: 400 }}>✕ Clear</button>
            </div>
          )}
        </div>

        {/* Meetings List */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>
            {selectedDate ? `Meetings on ${MONTHS[currentMonth]} ${selectedDate}` : "Upcoming Meetings"}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {displayedMeetings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-secondary)" }}>
                <Calendar size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
                <p style={{ fontSize: "0.875rem" }}>No meetings {selectedDate ? "on this day" : "scheduled"}.</p>
                {isAdmin && <p style={{ fontSize: "0.8rem", marginTop: "4px" }}>Click &quot;Schedule Meeting&quot; to create one.</p>}
              </div>
            ) : (
              displayedMeetings.map(meeting => (
                <div key={meeting.id} style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-main)", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "linear-gradient(135deg, #d4af37, #aa7c11)", flexShrink: 0 }} />
                        <h4 style={{ fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>{meeting.title}</h4>
                      </div>
                      <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Calendar size={12} />{meeting.date}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={12} />{meeting.time}</span>
                      </div>
                      {meeting.description && (
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "4px 0 8px" }}>{meeting.description}</p>
                      )}
                      {meeting.link && (
                        <a
                          href={meeting.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "20px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, fontSize: "0.8rem", textDecoration: "none" }}
                        >
                          <Video size={13} /> Join Meeting
                        </a>
                      )}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(meeting.id)}
                        style={{ color: "#ef4444", padding: "4px", borderRadius: "6px", border: "none", cursor: "pointer", background: "transparent", flexShrink: 0 }}
                        title="Delete meeting"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
