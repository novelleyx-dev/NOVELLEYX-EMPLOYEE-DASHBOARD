"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogIn, Code } from "lucide-react";

export default function Auth() {
  const { loginGoogle, loginGithub, loginAdmin, loginEmployeeCode, VALID_ACCESS_CODES } = useAuth();
  
  const [authStep, setAuthStep] = useState(0); // 0: Select Login, 1: Admin Creds, 2: Employee Code
  
  // States for forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    const success = await loginAdmin(email, password);
    if (!success) setError("Invalid admin credentials");
  };

  const handleEmployeeLogin = async (e) => {
    e.preventDefault();
    setError("");
    const success = await loginEmployeeCode(accessCode);
    if (!success) setError("Invalid or unapproved employee access code");
  };

  const mockOAuth = async (provider) => {
    // Show mocked interaction
    if (provider === 'google') await loginGoogle();
    if (provider === 'github') await loginGithub();
    // After OAuth wrapper, redirect employees to enter their 12-digit key.
    setAuthStep(2);
  };

  return (
    <div className="auth-container">
      <div className="auth-box card animate-fade-in">
        <div className="text-center mb-8">
          <h1 style={{ fontWeight: 700, fontSize: "2rem" }}>Novelleyx</h1>
          <p>Secure Dashboard Portal</p>
        </div>

        {error && (
          <div className="mb-4" style={{ color: "var(--danger-color)", textAlign: "center", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        {authStep === 0 && (
          <div className="flex-col gap-4">
            <button className="login-btn" onClick={() => mockOAuth('google')}>
              <LogIn size={20} /> Continue with Google
            </button>
            <button className="login-btn" onClick={() => mockOAuth('github')}>
              <Code size={20} /> Continue with GitHub
            </button>
            <div style={{ textAlign: "center", margin: "1rem 0", color: "var(--text-secondary)" }}>
              OR
            </div>
            <button className="btn-outline w-full" onClick={() => setAuthStep(1)}>
              Admin Login
            </button>
          </div>
        )}

        {authStep === 1 && (
          <form onSubmit={handleAdminLogin} className="flex-col gap-4">
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Admin Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="novelleyx@gmail.com" />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", marginTop: "1rem" }}>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-primary w-full mt-8">
              Login as Admin
            </button>
            <button type="button" className="btn-outline w-full mt-4" onClick={() => setAuthStep(0)}>
              Back
            </button>
          </form>
        )}

        {authStep === 2 && (
          <form onSubmit={handleEmployeeLogin} className="flex-col gap-4">
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.25rem" }}>Employee Verification</h3>
              <p style={{ fontSize: "0.875rem" }}>Enter your 12-digit secure access code</p>
            </div>
            <div>
              <input 
                type="text" 
                required 
                maxLength={12} 
                value={accessCode} 
                onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, ''))} 
                placeholder="000000000000" 
                style={{ textAlign: "center", letterSpacing: "2px", fontSize: "1.25rem", fontWeight: "600" }}
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-8">
              Verify & Enter
            </button>
            <button type="button" className="btn-outline w-full mt-4" onClick={() => setAuthStep(0)}>
              Back
            </button>
            
            {/* Demo Hint */}
            <div style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center" }}>
              <strong>Demo Hint:</strong> Use <br /> {VALID_ACCESS_CODES[0]}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
