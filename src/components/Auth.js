"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogIn, Code } from "lucide-react";

export default function Auth() {
  const { loginGoogle, loginGithub, loginAdmin, loginEmployeeCode, VALID_ACCESS_CODES, signupEmployee } = useAuth();
  
  const [authStep, setAuthStep] = useState(0); // 0: Select Login, 1: Admin Creds, 2: Employee Code, 3: Sign Up, 4: Show Code
  
  // States for forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  // Sign up states
  const [signUpData, setSignUpData] = useState({
    name: "", age: "", dob: "", address: "", email: "", password: "", confirmPassword: ""
  });
  const [generatedCode, setGeneratedCode] = useState("");

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
    // Show mocked interaction error to force sign up
    setError(`${provider} login failed or account not found. Please Sign Up.`);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");
    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    const code = signupEmployee(signUpData);
    setGeneratedCode(code);
    setAuthStep(4); // Show the generated code
  };

  return (
    <div className="auth-container">
      <div className="auth-box card animate-fade-in" style={{ maxWidth: authStep === 3 ? "500px" : "400px" }}>
        <div className="text-center mb-8">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <div style={{ 
              width: "60px", height: "60px", 
              background: "linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)", 
              borderRadius: "12px", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              color: "#111", fontWeight: "bold", fontSize: "2.5rem",
              boxShadow: "0 4px 15px rgba(212, 175, 55, 0.4)"
            }}>
              N
            </div>
          </div>
          <h1 style={{ fontWeight: 700, fontSize: "2rem", letterSpacing: "2px" }}>NOVELLEYX</h1>
          <p>Secure Employee Portal</p>
        </div>

        {error && (
          <div className="mb-4 p-2 rounded" style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--danger-color)", textAlign: "center", fontSize: "0.875rem", border: "1px solid var(--danger-color)" }}>
            {error}
          </div>
        )}

        {authStep === 0 && (
          <div className="flex-col gap-4">
            <button className="login-btn" onClick={() => mockOAuth('Google')}>
              <LogIn size={20} /> Login with Google
            </button>
            <button className="login-btn" onClick={() => mockOAuth('GitHub')}>
              <Code size={20} /> Login with GitHub
            </button>
            <button className="btn-primary w-full mt-2" onClick={() => setAuthStep(3)}>
              Sign Up (New Employee)
            </button>
            
            <div style={{ textAlign: "center", margin: "1rem 0", color: "var(--text-secondary)" }}>
              OR
            </div>
            
            <button className="btn-outline w-full" onClick={() => setAuthStep(2)}>
              Login with 12-Digit Code
            </button>
            <button className="btn-outline w-full mt-2" onClick={() => setAuthStep(1)}>
              Admin Login
            </button>
          </div>
        )}

        {authStep === 1 && (
          <form onSubmit={handleAdminLogin} className="flex-col gap-4">
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "0.9rem" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", marginTop: "1rem", fontWeight: 600, fontSize: "0.875rem" }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "0.9rem", letterSpacing: value => value ? "2px" : "0" }}
              />
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
              <h3 style={{ fontSize: "1.25rem" }}>Employee Login (Attendance)</h3>
              <p style={{ fontSize: "0.875rem" }}>Entering your 12-digit code will punch you in.</p>
            </div>
            <div>
              <input 
                type="text" 
                required 
                maxLength={12} 
                value={accessCode} 
                onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, ''))} 
                placeholder="000000000000" 
                className="w-full border rounded"
                style={{ textAlign: "center", letterSpacing: "2px", fontSize: "1.25rem", fontWeight: "600", padding: "0.75rem" }}
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-8">
              Punch In & Enter Dashboard
            </button>
            <button type="button" className="btn-outline w-full mt-4" onClick={() => setAuthStep(0)}>
              Back
            </button>
          </form>
        )}

        {authStep === 3 && (
          <form onSubmit={handleSignUp} className="flex-col gap-4">
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Employee Sign Up</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Create your account to generate your permanent code.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm mb-1">Full Name</label>
                <input type="text" required value={signUpData.name} onChange={e => setSignUpData({...signUpData, name: e.target.value})} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-sm mb-1">Age</label>
                <input type="number" required value={signUpData.age} onChange={e => setSignUpData({...signUpData, age: e.target.value})} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-sm mb-1">Date of Birth</label>
                <input type="date" required value={signUpData.dob} onChange={e => setSignUpData({...signUpData, dob: e.target.value})} className="w-full p-2 border rounded text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Address</label>
                <input type="text" required value={signUpData.address} onChange={e => setSignUpData({...signUpData, address: e.target.value})} className="w-full p-2 border rounded text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Email</label>
                <input type="email" required value={signUpData.email} onChange={e => setSignUpData({...signUpData, email: e.target.value})} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-sm mb-1">Password</label>
                <input type="password" required value={signUpData.password} onChange={e => setSignUpData({...signUpData, password: e.target.value})} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-sm mb-1">Confirm Password</label>
                <input type="password" required value={signUpData.confirmPassword} onChange={e => setSignUpData({...signUpData, confirmPassword: e.target.value})} className="w-full p-2 border rounded text-sm" />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full mt-6">
              Create Account & Generate Code
            </button>
            <button type="button" className="btn-outline w-full mt-2" onClick={() => setAuthStep(0)}>
              Cancel
            </button>
          </form>
        )}

        {authStep === 4 && (
          <div className="text-center">
            <div className="mb-6 p-6 rounded-lg" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--success-color)" }}>
              <h3 style={{ color: "var(--success-color)", fontWeight: "bold", fontSize: "1.25rem", marginBottom: "0.5rem" }}>Account Created!</h3>
              <p className="text-sm mb-4">This is your permanent 12-digit attendance code based on your registration date, time, and location data. <strong style={{color:"var(--danger-color)"}}>DO NOT LOSE THIS!</strong></p>
              <div style={{ fontSize: "2rem", letterSpacing: "4px", fontWeight: "800", color: "#111", background: "linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)", padding: "1rem", borderRadius: "8px" }}>
                {generatedCode}
              </div>
            </div>
            <button className="btn-primary w-full" onClick={() => { setAccessCode(generatedCode); setAuthStep(2); }}>
              Proceed to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
