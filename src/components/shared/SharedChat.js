"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Send, Hash, MoreVertical, Image as ImageIcon, Paperclip } from "lucide-react";

export default function SharedChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, sender: "System", text: "Welcome to the team chat! Please maintain professional decorum.", time: "09:00 AM", isSelf: false, avatar: "/vercel.svg" },
    { id: 2, sender: "Alice (Admin)", text: "Good morning team! Please check the new task assignments on the dashboard.", time: "09:15 AM", isSelf: false, avatar: "/next.svg" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: user.name,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      avatar: user.avatar || "/next.svg"
    };

    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 140px)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", overflow: "hidden", background: "var(--bg-card)" }}>
      
      {/* Channels Sidebar */}
      <div style={{ width: "240px", borderRight: "1px solid var(--border-color)", display: "flex", flexDirection: "column", background: "var(--bg-main)" }}>
        <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-color)", fontWeight: "600" }}>
          Channels
        </div>
        <div style={{ flex: 1, padding: "0.5rem" }}>
          <div style={{ padding: "0.5rem", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(99,102,241,0.1)", color: "var(--primary-color)", fontWeight: "500", cursor: "pointer" }}>
            <Hash size={18} /> general
          </div>
          <div style={{ padding: "0.5rem", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s" }} className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <Hash size={18} /> announcements
          </div>
          {user?.role === "admin" && (
            <div style={{ padding: "0.5rem", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s" }} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <Hash size={18} /> admin-only
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Chat Header */}
        <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600" }}>
            <Hash size={20} color="var(--text-secondary)" /> #general
          </div>
          <button style={{ color: "var(--text-secondary)" }}><MoreVertical size={20} /></button>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", gap: "1rem", flexDirection: msg.isSelf ? "row-reverse" : "row" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--border-color)", flexShrink: 0, overflow: "hidden" }}>
                <img src={msg.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: msg.isSelf ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem", flexDirection: msg.isSelf ? "row-reverse" : "row" }}>
                  <span style={{ fontWeight: "600", fontSize: "0.875rem" }}>{msg.sender}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{msg.time}</span>
                </div>
                <div style={{ 
                  padding: "0.75rem 1rem", 
                  borderRadius: "var(--radius-lg)", 
                  background: msg.isSelf ? "var(--primary-color)" : "var(--bg-main)", 
                  color: msg.isSelf ? "white" : "var(--text-primary)",
                  borderTopLeftRadius: msg.isSelf ? "var(--radius-lg)" : "0",
                  borderTopRightRadius: msg.isSelf ? "0" : "var(--radius-lg)",
                }}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div style={{ padding: "1rem", borderTop: "1px solid var(--border-color)" }}>
          <form onSubmit={handleSend} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-main)", padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <button type="button" style={{ padding: "0.5rem", color: "var(--text-secondary)" }}><Paperclip size={20} /></button>
            <button type="button" style={{ padding: "0.5rem", color: "var(--text-secondary)" }}><ImageIcon size={20} /></button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message #general..." 
              style={{ flex: 1, border: "none", background: "transparent", padding: "0.5rem", outline: "none" }}
            />
            <button type="submit" disabled={!input.trim()} style={{ padding: "0.5rem 1rem", background: "var(--primary-color)", color: "white", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem", opacity: input.trim() ? 1 : 0.5 }}>
              <Send size={16} /> Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
