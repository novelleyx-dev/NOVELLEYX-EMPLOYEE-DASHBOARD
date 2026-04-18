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

  const [channels, setChannels] = useState(["general", "announcements", "admin-only"]);
  const [activeChannel, setActiveChannel] = useState("general");
  const [newChannelName, setNewChannelName] = useState("");
  const [showNewChannel, setShowNewChannel] = useState(false);

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if(newChannelName.trim() && !channels.includes(newChannelName)) {
      setChannels([...channels, newChannelName.toLowerCase().replace(/\s+/g, '-')]);
      setNewChannelName("");
      setShowNewChannel(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: user?.name || "User",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      avatar: user?.avatar || "/next.svg",
      channel: activeChannel
    };

    setMessages([...messages, newMsg]);
    setInput("");
  };

  const activeMessages = messages.filter(m => !m.channel || m.channel === activeChannel);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 140px)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", overflow: "hidden", background: "var(--bg-card)" }}>
      
      {/* Channels Sidebar */}
      <div style={{ width: "240px", borderRight: "1px solid var(--border-color)", display: "flex", flexDirection: "column", background: "var(--bg-main)" }}>
        <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-color)", fontWeight: "600", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Channels
          {user?.role === "admin" && (
            <button onClick={() => setShowNewChannel(!showNewChannel)} className="text-gray-500 hover:text-black dark:hover:text-white">+</button>
          )}
        </div>
        <div style={{ flex: 1, padding: "0.5rem", overflowY: "auto" }}>
          {showNewChannel && (
            <form onSubmit={handleCreateChannel} className="mb-2 p-2">
              <input 
                type="text" 
                placeholder="channel-name" 
                className="w-full p-1 text-sm border rounded"
                value={newChannelName}
                onChange={e => setNewChannelName(e.target.value)}
                autoFocus
              />
            </form>
          )}
          {channels.map(ch => (
            <div 
              key={ch}
              onClick={() => setActiveChannel(ch)}
              style={{ 
                padding: "0.5rem", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem", 
                background: activeChannel === ch ? "rgba(212, 175, 55, 0.2)" : "transparent", 
                color: activeChannel === ch ? "#aa7c11" : "var(--text-secondary)", 
                fontWeight: activeChannel === ch ? "600" : "500", 
                cursor: "pointer", transition: "all 0.2s" 
              }} 
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Hash size={18} /> {ch}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Chat Header */}
        <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600", color: "#aa7c11" }}>
            <Hash size={20} /> #{activeChannel}
          </div>
          <button style={{ color: "var(--text-secondary)" }}><MoreVertical size={20} /></button>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {activeMessages.map(msg => (
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
                  background: msg.isSelf ? "linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)" : "var(--bg-main)", 
                  color: msg.isSelf ? "#111" : "var(--text-primary)",
                  borderTopLeftRadius: msg.isSelf ? "var(--radius-lg)" : "0",
                  borderTopRightRadius: msg.isSelf ? "0" : "var(--radius-lg)",
                  boxShadow: msg.isSelf ? "0 4px 10px rgba(212, 175, 55, 0.2)" : "none"
                }}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {activeMessages.length === 0 && <p className="text-center text-gray-500 my-auto">No messages in #{activeChannel} yet.</p>}
        </div>

        {/* Chat Input */}
        <div style={{ padding: "1rem", borderTop: "1px solid var(--border-color)" }}>
          <form onSubmit={handleSend} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-main)", padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <label style={{ padding: "0.5rem", color: "var(--text-secondary)", cursor: "pointer" }}>
              <Paperclip size={20} />
              <input type="file" className="hidden" onChange={() => alert("Document mock uploaded!")} />
            </label>
            <label style={{ padding: "0.5rem", color: "var(--text-secondary)", cursor: "pointer" }}>
              <ImageIcon size={20} />
              <input type="file" accept="image/*" className="hidden" onChange={() => alert("Image mock uploaded!")} />
            </label>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message #${activeChannel}...`} 
              style={{ flex: 1, border: "none", background: "transparent", padding: "0.5rem", outline: "none", color: "var(--text-primary)" }}
            />
            <button type="submit" disabled={!input.trim()} style={{ padding: "0.5rem 1rem", background: "linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)", color: "#111", fontWeight: "600", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem", opacity: input.trim() ? 1 : 0.5 }}>
              <Send size={16} /> Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
