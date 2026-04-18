"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Send, Hash, Plus, Paperclip, Image as ImageIcon, X, Megaphone } from "lucide-react";

export default function SharedChat() {
  const { user, notifications, addNotification } = useAuth();

  const [channels, setChannels] = useState([
    { id: "general", label: "general", description: "Open for all team members" },
    { id: "announcements", label: "announcements", description: "Admin announcements" },
    { id: "admin-only", label: "admin-only", description: "Restricted to admin" },
  ]);
  const [activeChannelId, setActiveChannelId] = useState("general");
  const [messages, setMessages] = useState({
    general: [
      { id: 1, sender: "System", text: "Welcome to #general! Keep it professional 🤝", time: "09:00 AM", isSelf: false },
      { id: 2, sender: "Admin", text: "Good morning team! Check task assignments.", time: "09:15 AM", isSelf: false },
    ],
    announcements: [],
    "admin-only": [],
  });
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showNewChannel, setShowNewChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [showAnnounce, setShowAnnounce] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const activeChannel = channels.find(c => c.id === activeChannelId);
  const activeMessages = messages[activeChannelId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() && attachments.length === 0) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.name || "User",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
      attachments: attachments,
    };

    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
    }));
    setInput("");
    setAttachments([]);
  };

  const handleAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: user?.name || "Admin",
      text: `📢 ANNOUNCEMENT: ${announcementText}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
      isAnnouncement: true,
    };
    setMessages(prev => ({
      ...prev,
      announcements: [...(prev.announcements || []), newMsg],
    }));
    addNotification(`📢 New Announcement: ${announcementText}`, "Announcement");
    setAnnouncementText("");
    setShowAnnounce(false);
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      type: type,
      url: URL.createObjectURL(file),
      size: (file.size / 1024).toFixed(1) + " KB",
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = "";
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    const slug = newChannelName.trim().toLowerCase().replace(/\s+/g, "-");
    if (slug && !channels.find(c => c.id === slug)) {
      setChannels(prev => [...prev, { id: slug, label: slug, description: "Custom channel" }]);
      setMessages(prev => ({ ...prev, [slug]: [] }));
      setActiveChannelId(slug);
      setNewChannelName("");
      setShowNewChannel(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 140px)", borderRadius: "16px", border: "1px solid var(--border-color)", overflow: "hidden", background: "var(--bg-card)" }}>

      {/* Channels Sidebar */}
      <div style={{ width: "220px", flexShrink: 0, borderRight: "1px solid var(--border-color)", background: "var(--bg-main)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Channels</div>
          {user?.role === "admin" && (
            <button
              onClick={() => setShowNewChannel(!showNewChannel)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", borderRadius: "8px", background: "rgba(212,175,55,0.1)", color: "#aa7c11", fontSize: "0.8rem", fontWeight: 600, border: "1px dashed #d4af37" }}
            >
              <Plus size={14} /> New Channel
            </button>
          )}
          {showNewChannel && (
            <form onSubmit={handleCreateChannel} className="mt-2">
              <input
                autoFocus
                type="text"
                placeholder="channel-name"
                value={newChannelName}
                onChange={e => setNewChannelName(e.target.value)}
                style={{ width: "100%", padding: "6px 8px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "0.8rem", background: "var(--bg-card)", color: "var(--text-primary)" }}
              />
            </form>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
          {channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannelId(ch.id)}
              style={{
                width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 10px", borderRadius: "8px", border: "none", cursor: "pointer",
                background: activeChannelId === ch.id ? "rgba(212,175,55,0.15)" : "transparent",
                color: activeChannelId === ch.id ? "#aa7c11" : "var(--text-secondary)",
                fontWeight: activeChannelId === ch.id ? 700 : 500,
                fontSize: "0.875rem", transition: "all 0.15s",
              }}
            >
              <Hash size={15} />
              {ch.label}
            </button>
          ))}
        </div>

        {/* Admin Announce */}
        {user?.role === "admin" && (
          <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border-color)" }}>
            <button
              onClick={() => setShowAnnounce(!showAnnounce)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "6px", padding: "8px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, fontSize: "0.8rem", border: "none", cursor: "pointer" }}
            >
              <Megaphone size={14} /> Post Announcement
            </button>
          </div>
        )}
      </div>

      {/* Main Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Channel Header */}
        <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
              <Hash size={18} color="#aa7c11" /> {activeChannel?.label}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{activeChannel?.description}</div>
          </div>
        </div>

        {/* Announcement Form */}
        {showAnnounce && user?.role === "admin" && (
          <form onSubmit={handleAnnouncement} style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid var(--border-color)", background: "rgba(212,175,55,0.05)", display: "flex", gap: "0.5rem" }}>
            <input
              autoFocus
              type="text"
              placeholder="Type announcement to all employees..."
              value={announcementText}
              onChange={e => setAnnouncementText(e.target.value)}
              style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #d4af37", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "0.875rem" }}
            />
            <button type="submit" style={{ padding: "8px 16px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37, #aa7c11)", color: "#111", fontWeight: 700, border: "none", cursor: "pointer" }}>
              Send
            </button>
            <button type="button" onClick={() => setShowAnnounce(false)} style={{ padding: "8px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", cursor: "pointer", color: "var(--text-secondary)" }}>
              <X size={16} />
            </button>
          </form>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {activeMessages.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "4rem", fontSize: "0.9rem" }}>
              <Hash size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
              <p>No messages yet in #{activeChannel?.label}</p>
              <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>Be the first to say something!</p>
            </div>
          )}

          {activeMessages.map(msg => (
            <div key={msg.id} style={{ display: "flex", gap: "0.875rem", flexDirection: msg.isSelf ? "row-reverse" : "row", alignItems: "flex-start" }}>
              {/* Avatar */}
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                background: msg.isSelf ? "linear-gradient(135deg, #d4af37, #aa7c11)" : "var(--bg-main)",
                border: "1px solid var(--border-color)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, color: msg.isSelf ? "#111" : "var(--text-secondary)", fontSize: "0.85rem"
              }}>
                {msg.sender.charAt(0).toUpperCase()}
              </div>

              <div style={{ maxWidth: "68%", display: "flex", flexDirection: "column", alignItems: msg.isSelf ? "flex-end" : "flex-start" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px", display: "flex", gap: "6px" }}>
                  <span style={{ fontWeight: 600, color: msg.isSelf ? "#aa7c11" : "var(--text-primary)" }}>{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>

                {msg.text && (
                  <div style={{
                    padding: "0.625rem 1rem",
                    borderRadius: msg.isSelf ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                    background: msg.isAnnouncement
                      ? "linear-gradient(135deg, rgba(212,175,55,0.3), rgba(170,124,17,0.2))"
                      : msg.isSelf ? "linear-gradient(135deg, #d4af37, #aa7c11)" : "var(--bg-main)",
                    color: msg.isSelf ? "#111" : "var(--text-primary)",
                    fontSize: "0.9rem", lineHeight: 1.5,
                    border: msg.isAnnouncement ? "1px solid #d4af37" : "1px solid var(--border-color)",
                    boxShadow: msg.isSelf ? "0 4px 12px rgba(212,175,55,0.2)" : "none",
                    fontWeight: msg.isAnnouncement ? 600 : 400,
                  }}>
                    {msg.text}
                  </div>
                )}

                {/* Attachments */}
                {msg.attachments && msg.attachments.map((att, i) => (
                  <div key={i} style={{ marginTop: "4px" }}>
                    {att.type === "image" ? (
                      <img src={att.url} alt={att.name} style={{ maxWidth: "240px", maxHeight: "180px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--border-color)" }} />
                    ) : (
                      <div style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--bg-main)", border: "1px solid var(--border-color)", fontSize: "0.8rem", display: "flex", gap: "8px", alignItems: "center" }}>
                        <Paperclip size={14} color="#aa7c11" />
                        <span>{att.name}</span>
                        <span style={{ color: "var(--text-secondary)" }}>{att.size}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachment Preview */}
        {attachments.length > 0 && (
          <div style={{ padding: "0.5rem 1.25rem", borderTop: "1px solid var(--border-color)", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {attachments.map((att, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "20px", background: "rgba(212,175,55,0.1)", border: "1px solid #d4af37", fontSize: "0.8rem" }}>
                {att.type === "image" ? <ImageIcon size={12} color="#aa7c11" /> : <Paperclip size={12} color="#aa7c11" />}
                <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.name}</span>
                <button onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))} style={{ color: "var(--danger-color)" }}><X size={12} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid var(--border-color)" }}>
          <form onSubmit={handleSend} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-main)", padding: "6px 8px 6px 12px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            {/* File Upload */}
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={e => handleFileChange(e, "file")} multiple />
            <input type="file" ref={imageInputRef} accept="image/*" style={{ display: "none" }} onChange={e => handleFileChange(e, "image")} multiple />

            <button type="button" onClick={() => fileInputRef.current?.click()} style={{ color: "var(--text-secondary)", padding: "4px", borderRadius: "6px", flexShrink: 0 }} title="Attach file">
              <Paperclip size={18} />
            </button>
            <button type="button" onClick={() => imageInputRef.current?.click()} style={{ color: "var(--text-secondary)", padding: "4px", borderRadius: "6px", flexShrink: 0 }} title="Attach image">
              <ImageIcon size={18} />
            </button>

            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Message #${activeChannel?.label}...`}
              style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "0.9rem", color: "var(--text-primary)", padding: "4px" }}
            />

            <button
              type="submit"
              disabled={!input.trim() && attachments.length === 0}
              style={{
                padding: "8px 16px", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem",
                background: (input.trim() || attachments.length > 0) ? "linear-gradient(135deg, #d4af37, #aa7c11)" : "var(--border-color)",
                color: (input.trim() || attachments.length > 0) ? "#111" : "var(--text-secondary)",
                border: "none", cursor: (input.trim() || attachments.length > 0) ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, transition: "all 0.2s"
              }}
            >
              <Send size={15} /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
