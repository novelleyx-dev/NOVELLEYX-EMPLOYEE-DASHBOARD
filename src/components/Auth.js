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
    width: "100%", 
    maxWidth: step === "signup" ? "480px" : "420px",
    background: "var(--bg-card)", 
    borderRadius: "24px",
    padding: "2.5rem", 
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "1px solid var(--border-color)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    position: "relative",
    zIndex: 10
  };

  const inputStyle = {
    width: "100%", 
    padding: "12px 16px", 
    borderRadius: "12px",
    border: "1px solid var(--border-color)", 
    background: "rgba(255, 255, 255, 0.03)",
    color: "var(--text-primary)", 
    fontSize: "0.95rem", 
    outline: "none",
    marginTop: "8px", 
    boxSizing: "border-box",
    transition: "all 0.2s"
  };

  const primaryBtn = {
    width: "100%", 
    padding: "14px", 
    borderRadius: "12px",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white", 
    fontWeight: 700, 
    fontSize: "1rem",
    border: "none", 
    cursor: "pointer", 
    marginTop: "1.5rem",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    transition: "all 0.2s"
  };

  const outlineBtn = {
    width: "100%", 
    padding: "12px", 
    borderRadius: "12px",
    background: "transparent", 
    color: "var(--text-secondary)",
    fontWeight: 600, 
    fontSize: "0.9rem",
    border: "1px solid var(--border-color)", 
    cursor: "pointer", 
    marginTop: "0.75rem",
    transition: "all 0.2s"
  };

  /* ---------- Logo ---------- */
  const Logo = () => (
    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      <div style={{
        width: "56px", height: "56px", borderRadius: "16px",
        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", fontWeight: 900, fontSize: "1.8rem",
        margin: "0 auto 1rem",
        boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)"
      }}>X</div>
      <h1 style={{ fontWeight: 800, fontSize: "1.8rem", letterSpacing: "2px", margin: 0, color: "var(--text-primary)" }}>NOVELLEYX</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "6px", fontWeight: 500 }}>Secure Management Portal</p>
    </div>
  );

  /* ---------- Background Glows ---------- */
  const BackgroundGlows = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "10%", right: "10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "10%", width: "35vw", height: "35vw", background: "radial-gradient(circle, rgba(99, 102, 241, 0.12), transparent 70%)", borderRadius: "50%" }} />
    </div>
  );

  /* ---------- Error box ---------- */
  const ErrorBox = () => error ? (
    <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", fontSize: "0.85rem", marginBottom: "1.5rem", lineHeight: 1.5, fontWeight: 500 }}>
      {error}
    </div>
  ) : null;

  /* ========== SHARED CONTAINER ========== */
  const Container = ({ children }) => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", background: "var(--bg-main)", position: "relative" }}>
      <BackgroundGlows />
      <div style={cardStyle}>
        <Logo />
        {children}
      </div>
    </div>
  );

  /* ========== HOME ========== */
  if (step === "home") return (
    <Container>
      <ErrorBox />
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button onClick={() => { setError(""); setStep("code"); }} 
          style={{ ...primaryBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: 0 }}
          onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
          <KeyRound size={20} /> Login with Access Code
        </button>

        <button onClick={() => { setError(""); setStep("signup"); }} 
          style={{ ...outlineBtn, marginTop: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", border: "1px solid rgba(59, 130, 246, 0.5)", color: "#60a5fa" }}
          onMouseOver={(e) => e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)"}
          onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
          <UserPlus size={20} /> New Employee? Sign Up
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0.5rem 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
        </div>

        <button onClick={() => { setError(""); setStep("admin"); }} 
          style={{ ...outlineBtn, marginTop: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
          onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
          onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
          <ShieldCheck size={20} /> Admin Login
        </button>
      </div>
    </Container>
  );

  /* ========== CODE LOGIN ========== */
  if (step === "code") return (
    <Container>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--text-primary)" }}>Employee Login</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "6px", lineHeight: 1.5 }}>
          Enter your 12-digit permanent code.<br />
          Attendance is recorded on entry.
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
          placeholder="0000 0000 0000"
          style={{ 
            ...inputStyle, 
            textAlign: "center", 
            fontSize: "1.6rem", 
            fontWeight: 800, 
            letterSpacing: "4px", 
            padding: "16px",
            background: "rgba(0,0,0,0.2)",
            border: "1px solid rgba(59, 130, 246, 0.3)"
          }}
          autoFocus
        />
        <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginTop: "8px" }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{ width: "8px", height: "3px", borderRadius: "2px", background: i < accessCode.length ? "#3b82f6" : "var(--border-color)" }} />
          ))}
        </div>
        <button
          type="submit"
          disabled={accessCode.length !== 12 || loading}
          style={{ 
            ...primaryBtn, 
            opacity: accessCode.length === 12 ? 1 : 0.4, 
            cursor: accessCode.length === 12 ? "pointer" : "not-allowed",
            background: accessCode.length === 12 ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "var(--text-secondary)"
          }}
        >
          {loading ? "Verifying..." : "Punch In & Enter"}
        </button>
      </form>
      <button onClick={() => { setError(""); setStep("home"); }} style={outlineBtn}>← Go Back</button>
    </Container>
  );

  /* ========== ADMIN LOGIN ========== */
  if (step === "admin") return (
    <Container>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--text-primary)" }}>Admin Access</h2>
      </div>
      <ErrorBox />
      <form onSubmit={handleAdminLogin}>
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@novelleyx.com" style={inputStyle} autoFocus />
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Secret Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
        </div>
        <button type="submit" style={primaryBtn} disabled={loading}>
          {loading ? "Authenticating..." : "Sign In to Admin Panel"}
        </button>
      </form>
      <button onClick={() => { setError(""); setStep("home"); }} style={outlineBtn}>← Go Back</button>
    </Container>
  );

  /* ========== SIGN UP ========== */
  if (step === "signup") return (
    <Container>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--text-primary)" }}>Employee Registration</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "6px", lineHeight: 1.5 }}>
          Fill in your details to generate your unique access code.
        </p>
      </div>
      <ErrorBox />
      <form onSubmit={handleSignup}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--text-secondary)" }}>FULL NAME *</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Abhinav..." style={inputStyle} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--text-secondary)" }}>EMAIL ADDRESS *</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--text-secondary)" }}>AGE</label>
            <input type="number" min="16" max="100" value={form.age} onChange={e => setForm({...form, age: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--text-secondary)" }}>BIRTH DATE</label>
            <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} style={inputStyle} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--text-secondary)" }}>PASSWORD *</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--text-secondary)" }}>CONFIRM PASSWORD *</label>
            <input type="password" required value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} style={inputStyle} />
          </div>
        </div>
        <button type="submit" style={primaryBtn}>Create Account & Get Code</button>
      </form>
      <button onClick={() => { setError(""); setStep("home"); }} style={outlineBtn}>← Back</button>
    </Container>
  );

  /* ========== SUCCESS ========== */
  if (step === "success") return (
    <Container>
      <div style={{ textAlign: "center" }}>
        <div style={{ padding: "2rem", borderRadius: "20px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
          <h3 style={{ fontWeight: 800, color: "#34d399", fontSize: "1.4rem", marginBottom: "0.5rem" }}>Welcome to the Team!</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Below is your <strong>permanent access code</strong>.<br />
            You will need this to log in every day.
          </p>
          <div style={{
            fontSize: "1.8rem", letterSpacing: "4px", fontWeight: 900,
            background: "rgba(0,0,0,0.3)",
            color: "#60a5fa", padding: "1.25rem", borderRadius: "14px",
            fontFamily: "monospace", border: "1px dashed rgba(59, 130, 246, 0.5)",
            textAlign: "center"
          }}>
            {generatedCode}
          </div>
          <p style={{ color: "#f87171", fontSize: "0.75rem", fontWeight: 700, marginTop: "1rem", textTransform: "uppercase" }}>⚠️ Do not lose or share this code</p>
        </div>
        <button
          onClick={() => { setAccessCode(generatedCode); setStep("code"); }}
          style={primaryBtn}
        >
          Login with My Code Now →
        </button>
      </div>
    </Container>
  );

  return null;
}
