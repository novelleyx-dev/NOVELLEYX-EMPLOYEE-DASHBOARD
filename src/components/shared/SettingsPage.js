"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "I am a member of Novelleyx."
  });
  const [message, setMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    // In a real app, you would update the backend here
    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Settings</h2>
        <p>Update your profile and account settings.</p>
      </div>

      <div className="card">
        {message && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
            {message}
          </div>
        )}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-4">
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#111", fontSize: "2rem", fontWeight: "bold" }}>
              {profile.name.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="font-bold text-xl">{profile.name}</h3>
              <p className="text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'Employee'}</p>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Full Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded" 
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Email Address</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded" 
              value={profile.email}
              onChange={e => setProfile({...profile, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Bio</label>
            <textarea 
              className="w-full p-2 border rounded h-24" 
              value={profile.bio}
              onChange={e => setProfile({...profile, bio: e.target.value})}
            />
          </div>

          <button type="submit" className="btn-primary mt-4 flex items-center justify-center gap-2">
            <Save size={18} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
