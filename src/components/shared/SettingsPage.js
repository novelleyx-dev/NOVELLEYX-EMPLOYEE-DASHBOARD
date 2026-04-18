"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Save, User, Phone, MapPin, Calendar, Mail } from "lucide-react";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    address: user?.address || "",
    dob: user?.dob || "",
  });
  const [message, setMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(profile);
    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const initial = profile.name.charAt(0)?.toUpperCase() || "U";

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="mb-6">
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Settings</h2>
        <p style={{ color: "var(--text-secondary)" }}>Update your profile details and bio.</p>
      </div>

      {message && (
        <div style={{ padding: "0.75rem 1rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.12)", border: "1px solid #10b981", color: "#059669", marginBottom: "1.5rem", fontWeight: 600, fontSize: "0.875rem" }}>
          ✓ {message}
        </div>
      )}

      <div className="card">
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", padding: "1.5rem", borderBottom: "1px solid var(--border-color)", marginBottom: "1.5rem" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#111", fontSize: "2rem", fontWeight: "800",
            boxShadow: "0 8px 24px rgba(212,175,55,0.3)"
          }}>
            {initial}
          </div>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: "1.25rem" }}>{profile.name}</h3>
            <span style={{
              padding: "3px 10px", borderRadius: "20px",
              background: "rgba(212,175,55,0.15)", color: "#aa7c11",
              fontWeight: 600, fontSize: "0.75rem", textTransform: "capitalize"
            }}>
              {user?.role}
            </span>
            {user?.accessCode && (
              <div style={{ marginTop: "6px", fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-secondary)", letterSpacing: "1px" }}>
                Code: <strong>{user.accessCode}</strong>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", fontWeight: 600, fontSize: "0.875rem" }}>
                <User size={14} /> Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem" }}
              />
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", fontWeight: 600, fontSize: "0.875rem" }}>
                <Phone size={14} /> Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 00000 00000"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", fontWeight: 600, fontSize: "0.875rem" }}>
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", fontWeight: 600, fontSize: "0.875rem" }}>
                <Calendar size={14} /> Date of Birth
              </label>
              <input
                type="date"
                value={profile.dob}
                onChange={e => setProfile({ ...profile, dob: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem" }}
              />
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", fontWeight: 600, fontSize: "0.875rem" }}>
                <MapPin size={14} /> Address
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                placeholder="City, State"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.875rem" }}>Bio</label>
            <textarea
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell the team a bit about yourself..."
              rows={3}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", fontSize: "0.875rem", resize: "vertical" }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px" }}>
            <Save size={18} /> Save Changes
          </button>
        </form>
      </div>

      {/* Phone / Security section */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>🔒 Security & Devices</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>
          Link your phone number above to enable future 2-factor security notifications.
          Your 12-digit access code acts as your unique security key — never share it.
        </p>
        {user?.accessCode && (
          <div style={{ padding: "1rem", borderRadius: "10px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.3)", fontFamily: "monospace", fontSize: "1.25rem", letterSpacing: "3px", fontWeight: 800, textAlign: "center", color: "#aa7c11" }}>
            {user.accessCode}
          </div>
        )}
        {user?.role === "admin" && (
          <p style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Admin accounts use email/password credentials. Employee IDs are managed under <strong>Employees & Access</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
