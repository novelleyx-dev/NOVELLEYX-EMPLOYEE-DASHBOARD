"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Send, Hash, Plus, Paperclip, Image as ImageIcon, X, Megaphone, RefreshCw } from "lucide-react";

const EXPIRY_MS = 72 * 60 * 60 * 1000; // 72 hours
const CHAT_KEY = "novelleyx_chat";
const CHANNELS_KEY = "novelleyx_channels";

// ── localStorage helpers ────────────────────────────────────────────────────
function loadMessages() {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const cutoff = Date.now() - EXPIRY_MS;
    const cleaned = {};
    for (const [ch, msgs] of Object.entries(parsed)) {
      cleaned[ch] = msgs.filter(m => new Date(m._ts || m.time).getTime() > cutoff);
    }
    return cleaned;
  } catch { return {}; }
}

function saveMessages(msgs) {
  try { localStorage.setItem(CHAT_KEY, JSON.stringify(msgs)); } catch {}
}

function loadChannels() {
  try {
    const raw = localStorage.getItem(CHANNELS_KEY);
    if (!raw) return ["general", "announcements"];
    const parsed = JSON.parse(raw);
    return parsed.filter(ch => ch !== "admin-only");
  } catch { return ["general", "announcements"]; }
}

function saveChannels(channels) {
  try { localStorage.setItem(CHANNELS_KEY, JSON.stringify(channels)); } catch {}
}

export default function SharedChat() {
  const { user, addNotification } = useAuth();
  const [channels, setChannelsState] = useState(loadChannels);
  const [messages, setMessagesState] = useState(loadMessages);
  const [activeChannelId, setActiveChannelId] = useState("general");
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showNewChannel, setShowNewChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(() => Date.now());
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // ── Sync messages from localStorage (called on storage events & manual refresh) ──
  const syncFromStorage = useCallback(() => {
    const fresh = loadMessages();
    const freshChannels = loadChannels();
    setMessagesState(fresh);
    setChannelsState(freshChannels);
    setLastSyncTime(Date.now());
  }, []);

  // ── Cross-tab sync: listen for storage writes from OTHER tabs/browsers ──────
  useEffect(() => {
    const handleStorageEvent = (e) => {
      if (e.key === CHAT_KEY || e.key === CHANNELS_KEY) {
        syncFromStorage();
      }
    };
    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [syncFromStorage]);

  // ── Polling fallback: sync every 3 seconds (catches same-browser multi-tab) ─
  useEffect(() => {
    const interval = setInterval(() => {
      syncFromStorage();
    }, 3000);
    return () => clearInterval(interval);
  }, [syncFromStorage]);

  // ── Persist helpers ──────────────────────────────────────────────────────────
  const setChannels = (val) => {
    const resolved = typeof val === "function" ? val(channels) : val;
    setChannelsState(resolved);
    saveChannels(resolved);
  };

  const setMessages = (updater) => {
    // Always read freshest data before updating to avoid overwriting concurrent writes
    const current = loadMessages();
    const resolved = typeof updater === "function" ? updater(current) : updater;
    setMessagesState(resolved);
    saveMessages(resolved);
  };

  const activeMessages = messages[activeChannelId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length, activeChannelId]);

  const buildMsg = (text, extra = {}) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    sender: user?.name || "User",
    senderId: user?.id || user?.email || "unknown",
    text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    _ts: new Date().toISOString(),
    isSelf: true,
    ...extra,
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() && attachments.length === 0) return;
    const msg = buildMsg(input, { attachments });
    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), msg],
    }));
    setInput("");
    setAttachments([]);
  };

  const handleAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    const msg = buildMsg(`📢 ANNOUNCEMENT: ${announcementText}`, { isAnnouncement: true });
    setMessages(prev => ({
      ...prev,
      announcements: [...(prev.announcements || []), msg],
    }));
    addNotification(`📢 ${announcementText}`, "Announcement");
    setAnnouncementText("");
    setShowAnnounce(false);
    // Automatically navigate to #announcements so admin can confirm it posted
    setActiveChannelId("announcements");
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(f => ({
      name: f.name,
      type,
      url: URL.createObjectURL(f),
      size: (f.size / 1024).toFixed(1) + " KB",
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = "";
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    const slug = newChannelName.trim().toLowerCase().replace(/\s+/g, "-");
    if (slug && slug !== "admin-only" && !channels.includes(slug)) {
      setChannels(prev => [...prev, slug]);
      setActiveChannelId(slug);
      setNewChannelName("");
      setShowNewChannel(false);
    }
  };

  // Determine isSelf per current viewer
  const currentUserId = user?.id || user?.email || "";
  const renderMessages = activeMessages.map(msg => ({
    ...msg,
    isSelf: msg.senderId
      ? msg.senderId === currentUserId
      : msg.sender === (user?.name || "User"),
  }));

  // Format last sync time
  const syncLabel = new Date(lastSyncTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div style={{ display: "flex", height: "calc(100vh - 140px)", borderRadius: "16px", border: "1px solid var(--border-color)", overflow: "hidden", background: "var(--bg-card)" }}>

      {/* Channels Sidebar */}
      <div style={{ width: "210px", flexShrink: 0, borderRight: "1px solid var(--border-color)", background: "var(--bg-main)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Channels</div>
          {user?.role === "admin" && (
            <button onClick={() => setShowNewChannel(!showNewChannel)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", borderRadius: "8px", background: "rgba(212,175,55,0.1)", color: "#aa7c11", fontSize: "0.8rem", fontWeight: 600, border: "1px dashed #d4af37", cursor: "pointer" }}>
              <Plus size={14} /> New Channel
            </button>
          )}
          {showNewChannel && (
            <form onSubmit={handleCreateChannel} style={{ marginTop: "8px" }}>
              <input autoFocus type="text" placeholder="channel-name" value={newChannelName} onChange={e => setNewChannelName(e.target.value)}
                style={{ width: "100%", padding: "6px 8px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "0.8rem", background: "var(--bg-card)", color: "var(--text-primary)", boxSizing: "border-box" }} />
            </form>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
          {channels.map(ch => (
            <button key={ch} onClick={() => setActiveChannelId(ch)}
              style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "8px", border: "none", cursor: "pointer", background: activeChannelId === ch ? "rgba(212,175,55,0.15)" : "transparent", color: activeChannelId === ch ? "#aa7c11" : "var(--text-secondary)", fontWeight: activeChannelId === ch ? 700 : 500, fontSize: "0.875rem", transition: "all 0.15s" }}>
              <Hash size={14} /> {ch}
              {(messages[ch] || []).length > 0 && (
                <span style={{ marginLeft: "auto", fontSize: "0.7rem", background: "rgba(212,175,55,0.2)", color: "#aa7c11", borderRadius: "10px", padding: "1px 6px" }}>
                  {(messages[ch] || []).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {user?.role === "admin" && (
          <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border-color)" }}>
            <button onClick={() => setShowAnnounce(!showAnnounce)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "6px", padding: "8px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, fontSize: "0.8rem", border: "none", cursor: "pointer" }}>
              <Megaphone size={14} /> Post Announcement
            </button>
          </div>
        )}
      </div>

      {/* Main Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}>
            <Hash size={18} color="#aa7c11" /> <span style={{ color: "#aa7c11" }}>{activeChannelId}</span>
            {activeChannelId === "announcements" && (
              <span style={{ marginLeft: "8px", fontSize: "0.72rem", padding: "2px 8px", borderRadius: "10px", background: "rgba(212,175,55,0.15)", color: "#aa7c11", fontWeight: 600 }}>Admin-only posting</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", opacity: 0.7 }}>
              synced {syncLabel}
            </span>
            <button onClick={syncFromStorage} title="Refresh messages"
              style={{ padding: "4px", borderRadius: "6px", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}>
              <RefreshCw size={14} />
            </button>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{renderMessages.length} message{renderMessages.length !== 1 ? "s" : ""} • 72h history</span>
          </div>
        </div>

        {/* Announcement form */}
        {showAnnounce && user?.role === "admin" && (
          <form onSubmit={handleAnnouncement} style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid var(--border-color)", background: "rgba(212,175,55,0.05)", display: "flex", gap: "0.5rem" }}>
            <input autoFocus type="text" placeholder="Broadcast announcement to all employees..."
              value={announcementText} onChange={e => setAnnouncementText(e.target.value)}
              style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #d4af37", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "0.875rem" }} />
            <button type="submit" style={{ padding: "8px 16px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer" }}>Send</button>
            <button type="button" onClick={() => setShowAnnounce(false)} style={{ padding: "8px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", cursor: "pointer", color: "var(--text-secondary)" }}><X size={16} /></button>
          </form>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {renderMessages.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "4rem" }}>
              <Hash size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.2 }} />
              {activeChannelId === "announcements" && user?.role !== "admin" ? (
                <p>No announcements yet. Check back later!</p>
              ) : (
                <p>No messages yet in #{activeChannelId}</p>
              )}
            </div>
          )}
          {renderMessages.map(msg => (
            <div key={msg.id} style={{ display: "flex", gap: "0.75rem", flexDirection: msg.isSelf ? "row-reverse" : "row", alignItems: "flex-start" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0, background: msg.isSelf ? "linear-gradient(135deg, #d4af37, #aa7c11)" : "var(--bg-main)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: msg.isSelf ? "#111" : "var(--text-secondary)", fontSize: "0.85rem" }}>
                {msg.sender?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ maxWidth: "65%", display: "flex", flexDirection: "column", alignItems: msg.isSelf ? "flex-end" : "flex-start" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px", display: "flex", gap: "6px" }}>
                  <span style={{ fontWeight: 600, color: msg.isSelf ? "#aa7c11" : "var(--text-primary)" }}>{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                {msg.text && (
                  <div style={{ padding: "0.625rem 1rem", borderRadius: msg.isSelf ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: msg.isAnnouncement ? "rgba(212,175,55,0.2)" : msg.isSelf ? "linear-gradient(135deg, #d4af37, #aa7c11)" : "var(--bg-main)", color: msg.isSelf ? "#111" : "var(--text-primary)", fontSize: "0.9rem", border: msg.isAnnouncement ? "1px solid #d4af37" : "1px solid var(--border-color)", boxShadow: msg.isSelf ? "0 4px 12px rgba(212,175,55,0.2)" : "none", fontWeight: msg.isAnnouncement ? 600 : 400 }}>
                    {msg.text}
                  </div>
                )}
                {(msg.attachments || []).map((att, i) => (
                  <div key={i} style={{ marginTop: "4px" }}>
                    {att.type === 'image' ? (
                      <img src={att.url} alt={att.name} style={{ maxWidth: '220px', maxHeight: '160px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                    ) : (
                      <div style={{ padding: "6px 12px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", fontSize: "0.8rem", display: "flex", gap: "8px", alignItems: "center" }}>
                        <Paperclip size={13} color="#aa7c11" />{att.name} <span style={{ color: "var(--text-secondary)" }}>{att.size}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachment preview */}
        {attachments.length > 0 && (
          <div style={{ padding: "0.5rem 1.25rem", borderTop: "1px solid var(--border-color)", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {attachments.map((att, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "20px", background: "rgba(212,175,55,0.1)", border: "1px solid #d4af37", fontSize: "0.8rem" }}>
                {att.type === "image" ? <ImageIcon size={12} color="#aa7c11" /> : <Paperclip size={12} color="#aa7c11" />}
                <span style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.name}</span>
                <button onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><X size={11} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Input — locked for non-admins in #announcements */}
        <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid var(--border-color)" }}>
          {activeChannelId === "announcements" && user?.role !== "admin" ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "12px", background: "rgba(212,175,55,0.06)", border: "1px dashed rgba(212,175,55,0.3)" }}>
              <Megaphone size={16} color="#aa7c11" />
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Only the admin can post in <strong style={{ color: "#aa7c11" }}>#announcements</strong>. You can read but not reply.</span>
            </div>
          ) : (
            <form onSubmit={handleSend} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-main)", padding: "6px 8px 6px 12px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={e => handleFileChange(e, "file")} multiple />
              <input type="file" ref={imageInputRef} accept="image/*" style={{ display: "none" }} onChange={e => handleFileChange(e, "image")} multiple />
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{ color: "var(--text-secondary)", padding: "4px", borderRadius: "6px", border: "none", background: "transparent", cursor: "pointer" }} title="Attach file"><Paperclip size={18} /></button>
              <button type="button" onClick={() => imageInputRef.current?.click()} style={{ color: "var(--text-secondary)", padding: "4px", borderRadius: "6px", border: "none", background: "transparent", cursor: "pointer" }} title="Attach image"><ImageIcon size={18} /></button>
              <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder={`Message #${activeChannelId}...`}
                style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "0.9rem", color: "var(--text-primary)", padding: "4px" }} />
              <button type="submit" disabled={!input.trim() && attachments.length === 0}
                style={{ padding: "8px 16px", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", background: (input.trim() || attachments.length > 0) ? "linear-gradient(135deg, #d4af37, #aa7c11)" : "var(--border-color)", color: (input.trim() || attachments.length > 0) ? "#111" : "var(--text-secondary)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                <Send size={15} /> Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
