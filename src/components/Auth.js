"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogIn, KeyRound, UserPlus, ShieldCheck } from "lucide-react";

export default function Auth() {
  const { loginAdmin, loginEmployeeCode, signupEmployee } = useAuth();

  // Steps: "home" | "admin" | "code" | "signup" | "success"
  const [step, setStep] = useState("home");

  // Admin form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Employee code
  const [accessCode, setAccessCode] = useState("");

  // Sign up form
  const [form, setForm] = useState({
    name: "", age: "", dob: "", address: "", email: "", password: "", confirmPassword: ""
  });
  const [generatedCode, setGeneratedCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const ok = await loginAdmin(email, password);
    setLoading(false);
    if (!ok) setError("Wrong password. Hint: Abhi@123");
  };

  const handleCodeLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const ok = await loginEmployeeCode(accessCode.trim());
    setLoading(false);
    if (!ok) setError("Code not found. Make sure you signed up first and entered the exact 12 digits shown.");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Name, email and password are required."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords don't match."); return; }
    const code = signupEmployee(form);
    setGeneratedCode(code);
    setStep("success");
  };

  /* ---------- Shared styles ---------- */
  const cardStyle = {
    width: "100%", maxWidth: step === "signup" ? "480px" : "400px",
    background: "var(--bg-card)", borderRadius: "20px",
    padding: "2rem", boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
    border: "1px solid var(--border-color)"
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: "10px",
    border: "1px solid var(--border-color)", background: "var(--bg-main)",
    color: "var(--text-primary)", fontSize: "0.9rem", outline: "none",
    marginTop: "6px", boxSizing: "border-box"
  };

  const primaryBtn = {
    width: "100%", padding: "12px", borderRadius: "10px",
    background: "linear-gradient(135deg, #d4af37, #aa7c11)",
    color: "#111", fontWeight: 700, fontSize: "0.95rem",
    border: "none", cursor: "pointer", marginTop: "1rem"
  };

  const outlineBtn = {
    width: "100%", padding: "12px", borderRadius: "10px",
    background: "transparent", color: "var(--text-secondary)",
    fontWeight: 600, fontSize: "0.9rem",
    border: "1px solid var(--border-color)", cursor: "pointer", marginTop: "0.5rem"
  };

  /* ---------- Logo ---------- */
  const Logo = () => (
    <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
      <div style={{
        width: "60px", height: "60px", borderRadius: "14px",
        background: "linear-gradient(135deg, #d4af37, #aa7c11)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#111", fontWeight: 900, fontSize: "2rem",
        margin: "0 auto 0.875rem",
        boxShadow: "0 6px 20px rgba(212,175,55,0.4)"
      }}>N</div>
      <h1 style={{ fontWeight: 800, fontSize: "1.75rem", letterSpacing: "3px", margin: 0 }}>NOVELLEYX</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "4px" }}>Secure Employee Portal</p>
    </div>
  );

  /* ---------- Error box ---------- */
  const ErrorBox = () => error ? (
    <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem", lineHeight: 1.5 }}>
      {error}
    </div>
  ) : null;

  /* ========== HOME ========== */
  if (step === "home") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "var(--bg-main)" }}>
      <div style={cardStyle}>
        <Logo />
        <ErrorBox />

        {/* Employee paths */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button onClick={() => { setError(""); setStep("code"); }} style={{ ...primaryBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: 0 }}>
            <KeyRound size={18} /> Login with 12-Digit Code
          </button>

          <button onClick={() => { setError(""); setStep("signup"); }} style={{ ...outlineBtn, marginTop: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "1px solid #d4af37", color: "#aa7c11" }}>
            <UserPlus size={18} /> New Employee? Sign Up
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.5rem 0" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
          </div>

          <button onClick={() => { setError(""); setStep("admin"); }} style={{ ...outlineBtn, marginTop: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <ShieldCheck size={18} /> Admin Login
          </button>
        </div>
      </div>
    </div>
  );

  /* ========== CODE LOGIN ========== */
  if (step === "code") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "var(--bg-main)" }}>
      <div style={cardStyle}>
        <Logo />
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.2rem" }}>Employee Login</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>
            Enter your permanent 12-digit access code.<br />
            This also records your attendance punch-in.
          </p>
        </div>
        <ErrorBox />
        <form onSubmit={handleCodeLogin}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={12}
            value={accessCode}
            onChange={e => setAccessCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000000000"
            style={{ ...inputStyle, textAlign: "center", fontSize: "1.75rem", fontWeight: 800, letterSpacing: "6px", padding: "14px" }}
            autoFocus
          />
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center", marginTop: "8px" }}>
            {accessCode.length}/12 digits
          </p>
          <button
            type="submit"
            disabled={accessCode.length !== 12 || loading}
            style={{ ...primaryBtn, opacity: accessCode.length === 12 ? 1 : 0.5, cursor: accessCode.length === 12 ? "pointer" : "not-allowed" }}
          >
            {loading ? "Checking..." : "Punch In & Enter Dashboard"}
          </button>
        </form>
        <button onClick={() => { setError(""); setStep("home"); }} style={outlineBtn}>← Back</button>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Don't have a code? </span>
          <button onClick={() => { setError(""); setStep("signup"); }} style={{ background: "none", border: "none", color: "#aa7c11", fontWeight: 700, cursor: "pointer", fontSize: "0.8rem" }}>Sign Up →</button>
        </div>
      </div>
    </div>
  );

  /* ========== ADMIN LOGIN ========== */
  if (step === "admin") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "var(--bg-main)" }}>
      <div style={cardStyle}>
        <Logo />
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.2rem" }}>Admin Login</h2>
        </div>
        <ErrorBox />
        <form onSubmit={handleAdminLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem" }}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com" style={inputStyle} autoFocus />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem" }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="" style={inputStyle} />
          </div>
          <button type="submit" style={primaryBtn} disabled={loading}>
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
        <button onClick={() => { setError(""); setStep("home"); }} style={outlineBtn}>← Back</button>
      </div>
    </div>
  );

  /* ========== SIGN UP ========== */
  if (step === "signup") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "var(--bg-main)" }}>
      <div style={cardStyle}>
        <Logo />
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.2rem" }}>New Employee Sign Up</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "4px" }}>
            You only need to sign up once. After signing up, use your 12-digit code every time you log in.
          </p>
        </div>
        <ErrorBox />
        <form onSubmit={handleSignup}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Full Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your full name" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Age</label>
              <input type="number" min="16" max="100" value={form.age} onChange={e => setForm({...form, age: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Date of Birth</label>
              <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Address</label>
              <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="City, State" style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Password *</label>
              <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Confirm Password *</label>
              <input type="password" required value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} style={inputStyle} />
            </div>
          </div>
          <button type="submit" style={primaryBtn}>Create Account & Get My Code</button>
        </form>
        <button onClick={() => { setError(""); setStep("home"); }} style={outlineBtn}>← Back</button>
      </div>
    </div>
  );

  /* ========== SUCCESS ========== */
  if (step === "success") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "var(--bg-main)" }}>
      <div style={{ ...cardStyle, textAlign: "center" }}>
        <Logo />
        <div style={{ padding: "1.5rem", borderRadius: "14px", background: "rgba(16,185,129,0.08)", border: "1px solid #10b981", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎉</div>
          <h3 style={{ fontWeight: 800, color: "#10b981", marginBottom: "0.5rem" }}>Account Created!</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
            This is your <strong>permanent 12-digit access code</strong>.<br />
            Save it somewhere safe — you'll use it every time you log in.<br />
            <span style={{ color: "#ef4444", fontWeight: 700 }}>Do NOT share or lose this code.</span>
          </p>
          <div style={{
            fontSize: "2rem", letterSpacing: "6px", fontWeight: 900,
            background: "linear-gradient(135deg, #d4af37, #aa7c11)",
            color: "#111", padding: "1rem 1.5rem", borderRadius: "12px",
            fontFamily: "monospace"
          }}>
            {generatedCode}
          </div>
        </div>
        <button
          onClick={() => { setAccessCode(generatedCode); setStep("code"); }}
          style={primaryBtn}
        >
          Use This Code to Login Now →
        </button>
        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "1rem" }}>
          Next time: choose "Login with 12-Digit Code" from the home screen and enter this code.
        </p>
      </div>
    </div>
  );

  return null;
}
