"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseReady } from "@/lib/supabase";

const AuthContext = createContext();
const ADMIN_PASSWORD = "Abhi@123";

// ─── localStorage helpers (fallback when Supabase not configured) ───────────
function ls(key, fb) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; } catch { return fb; } }
function lsSet(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [employees, setEmployeesState] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to Novelleyx!", type: "System", time: new Date().toISOString() }
  ]);
  const [sickLeaves, setSickLeavesState] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // ── Persist employees ──────────────────────────────────────────────────────
  const setEmployees = useCallback((updater) => {
    setEmployeesState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      lsSet("novelleyx_employees", next);

      // Sync to Supabase asynchronously
      if (isSupabaseReady) {
        const prevIds = new Set(prev.map(e => String(e.id)));
        const nextIds = new Set(next.map(e => String(e.id)));

        // 1. Deletions
        prev.forEach(emp => {
          if (!nextIds.has(String(emp.id))) {
            supabase.from("employees").delete().eq("id", emp.id).then(({ error }) => {
              if (error) console.error("Supabase delete error:", error);
            });
          }
        });

        // 2. Insertions & Updates
        next.forEach(emp => {
          const old = prev.find(e => String(e.id) === String(emp.id));
          if (!old) {
            const { id, ...dataToInsert } = emp;
            // Map camelCase to snake_case for Supabase
            const dbData = {
              name: emp.name, email: emp.email, role: emp.role, approved: emp.approved,
              access_code: emp.accessCode || emp.access_code,
              attendance: emp.attendance || [], skills: emp.skills || {},
              age: emp.age || null, dob: emp.dob || null, address: emp.address || "",
              phone: emp.phone || "", bio: emp.bio || ""
            };
            supabase.from("employees").insert([dbData]).then(({ error }) => {
              if (error) console.error("Supabase insert error:", error);
            });
          } else if (JSON.stringify(old) !== JSON.stringify(emp)) {
            // Update
            const dbData = {
              name: emp.name, email: emp.email, role: emp.role, approved: emp.approved,
              access_code: emp.accessCode || emp.access_code,
              attendance: emp.attendance || [], skills: emp.skills || {},
              age: emp.age || null, dob: emp.dob || null, address: emp.address || "",
              phone: emp.phone || "", bio: emp.bio || ""
            };
            supabase.from("employees").update(dbData).eq("id", emp.id).then(({ error }) => {
              if (error) console.error("Supabase update error:", error);
            });
          }
        });
      }
      return next;
    });
  }, []);

  // ── Persist sick leaves ───────────────────────────────────────────────────
  const setSickLeaves = useCallback((updater) => {
    setSickLeavesState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      lsSet("novelleyx_sick_leaves", next);
      return next;
    });
  }, []);

  // ── Load from Supabase or localStorage ────────────────────────────────────
  useEffect(() => {
    async function init() {
      const storedUser = ls("novelleyx_user", null);
      if (storedUser) setUser(storedUser);

      if (isSupabaseReady) {
        const { data } = await supabase.from("employees").select("*").order("id");
        if (data) {
          setEmployeesState(data);
          lsSet("novelleyx_employees", data);
        }
      } else {
        setEmployeesState(ls("novelleyx_employees", []));
      }
      setSickLeavesState(ls("novelleyx_sick_leaves", []));
      setHydrated(true);
    }
    init();
  }, []);

  const addNotification = (message, type = "System") => {
    setNotifications(prev => [{ id: Date.now(), message, type, time: new Date().toISOString() }, ...prev]);
  };

  const updateProfile = async (profileData) => {
    if (!user) return;
    const updated = { ...user, ...profileData };
    setUser(updated);
    lsSet("novelleyx_user", updated);
    if (user.role === "employee") {
      if (isSupabaseReady) {
        await supabase.from("employees").update(profileData).eq("id", user.id);
      }
      setEmployees(prev => prev.map(e => e.id === user.id ? { ...e, ...profileData } : e));
    }
  };

  // ── Admin Login ────────────────────────────────────────────────────────────
  const loginAdmin = async (email, password) => {
    if (password !== ADMIN_PASSWORD) return false;
    const adminUser = { name: "Admin", email, role: "admin" };
    setUser(adminUser);
    lsSet("novelleyx_user", adminUser);
    return true;
  };

  // ── Employee Code Login ────────────────────────────────────────────────────
  const loginEmployeeCode = async (code) => {
    let employee = null;
    if (isSupabaseReady) {
      const { data } = await supabase
        .from("employees")
        .select("*")
        .eq("access_code", code)
        .eq("approved", true)
        .single();
      employee = data;
    } else {
      const list = ls("novelleyx_employees", []);
      employee = list.find(e => e.accessCode === code && e.approved) || null;
    }

    if (!employee) return false;

    const now = new Date().toISOString();
    // Normalize field name (Supabase uses snake_case)
    const attendance = employee.attendance || [];
    const updatedAttendance = [...attendance, { loginTime: now }];

    if (isSupabaseReady) {
      await supabase.from("employees").update({ attendance: updatedAttendance }).eq("id", employee.id);
    }

    const updatedEmp = { ...employee, attendance: updatedAttendance };
    // Keep accessCode field consistent
    if (!updatedEmp.accessCode) updatedEmp.accessCode = updatedEmp.access_code;

    setEmployees(prev => prev.map(e => e.id === employee.id ? updatedEmp : e));
    setUser(updatedEmp);
    lsSet("novelleyx_user", updatedEmp);
    addNotification(`🎉 Welcome back, ${employee.name}! You're logged in at ${new Date().toLocaleTimeString()}.`, "Welcome");
    addNotification(`🕐 Punched in at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}.`, "Attendance");
    return true;
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    if (user && user.role === "employee") {
      const now = new Date().toISOString();
      let emp = null;
      if (isSupabaseReady) {
        const { data } = await supabase.from("employees").select("attendance").eq("id", user.id).single();
        emp = data;
      } else {
        const list = ls("novelleyx_employees", []);
        emp = list.find(e => e.id === user.id);
      }
      if (emp && emp.attendance && emp.attendance.length > 0) {
        const att = [...emp.attendance];
        att[att.length - 1] = { ...att[att.length - 1], logoutTime: now };
        if (isSupabaseReady) {
          await supabase.from("employees").update({ attendance: att }).eq("id", user.id);
        }
        setEmployees(prev => prev.map(e => e.id === user.id ? { ...e, attendance: att } : e));
      }
    }
    setUser(null);
    localStorage.removeItem("novelleyx_user");
  };

  // ── Sign Up ────────────────────────────────────────────────────────────────
  const signupEmployee = async (formData) => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const code = `${String(d.getFullYear()).slice(-2)}${pad(d.getMonth()+1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

    const newEmployee = {
      name: formData.name,
      email: formData.email,
      age: formData.age,
      dob: formData.dob,
      address: formData.address,
      phone: formData.phone || "",
      bio: "",
      access_code: code,
      accessCode: code,
      role: "employee",
      approved: true,
      attendance: [],
      skills: {},
    };

    if (isSupabaseReady) {
      const { data, error } = await supabase
        .from("employees")
        .insert([{
          name: newEmployee.name, email: newEmployee.email,
          age: newEmployee.age, dob: newEmployee.dob,
          address: newEmployee.address, phone: newEmployee.phone,
          bio: "", access_code: code, role: "employee",
          approved: true, attendance: [], skills: {},
        }])
        .select()
        .single();
      if (!error && data) {
        const emp = { ...data, accessCode: data.access_code };
        setEmployees(prev => [...prev, emp]);
        return code;
      }
    }

    // Fallback to localStorage
    const list = ls("novelleyx_employees", []);
    const newId = list.length > 0 ? Math.max(...list.map(e => e.id || 0)) + 1 : 1;
    const emp = { ...newEmployee, id: newId };
    const newList = [...list, emp];
    setEmployeesState(newList);
    lsSet("novelleyx_employees", newList);
    return code;
  };

  return (
    <AuthContext.Provider value={{
      user, employees, setEmployees,
      notifications, addNotification, updateProfile,
      loginAdmin, loginEmployeeCode, logout, signupEmployee,
      sickLeaves, setSickLeaves,
      isSupabaseReady,
      hydrated // Export this so components know if data is ready
    }}>
      {hydrated ? children : (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617", color: "#3b82f6", fontFamily: "Outfit, sans-serif" }}>
          <div style={{ textAlign: "center" }}>
            <div className="animate-spin" style={{ width: "40px", height: "40px", border: "3px solid rgba(59, 130, 246, 0.2)", borderTopColor: "#3b82f6", borderRadius: "50%", margin: "0 auto 1rem" }} />
            <p style={{ fontWeight: 600, letterSpacing: "1px" }}>INITIALIZING NOVELLEYX...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
