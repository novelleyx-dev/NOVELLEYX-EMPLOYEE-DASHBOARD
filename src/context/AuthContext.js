"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Hardcoded admin credentials
const ADMIN_PASSWORD = "Abhi@123";

// Default seed employees (only used if localStorage is empty)
const SEED_EMPLOYEES = [];

function loadFromStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [employees, setEmployeesState] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to Novelleyx!", type: "System", time: new Date().toISOString() }
  ]);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    const storedUser = loadFromStorage("novelleyx_user", null);
    const storedEmployees = loadFromStorage("novelleyx_employees", SEED_EMPLOYEES);
    const storedNotifs = loadFromStorage("novelleyx_notifications", [
      { id: 1, message: "Welcome to Novelleyx!", type: "System", time: new Date().toISOString() }
    ]);

    if (storedUser) setUser(storedUser);
    setEmployeesState(storedEmployees);
    setNotifications(storedNotifs);
    setHydrated(true);
  }, []);

  // Wrapper that always persists employees
  const setEmployees = (newEmployees) => {
    const resolved = typeof newEmployees === "function" ? newEmployees(employees) : newEmployees;
    setEmployeesState(resolved);
    saveToStorage("novelleyx_employees", resolved);
  };

  const addNotification = (message, type = "System") => {
    const notif = { id: Date.now(), message, type, time: new Date().toISOString() };
    setNotifications(prev => {
      const updated = [notif, ...prev];
      saveToStorage("novelleyx_notifications", updated);
      return updated;
    });
  };

  const updateProfile = (profileData) => {
    if (!user) return;
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    saveToStorage("novelleyx_user", updatedUser);
    if (user.role === "employee") {
      setEmployees(employees.map(emp => emp.id === user.id ? { ...emp, ...profileData } : emp));
    }
  };

  const loginAdmin = async (email, password) => {
    if (password === ADMIN_PASSWORD) {
      const adminUser = { name: "Admin", email, role: "admin" };
      setUser(adminUser);
      saveToStorage("novelleyx_user", adminUser);
      return true;
    }
    return false;
  };

  const loginEmployeeCode = async (code) => {
    // Always read freshest employees from localStorage
    const freshEmployees = loadFromStorage("novelleyx_employees", []);
    const employee = freshEmployees.find(emp => emp.accessCode === code && emp.approved);
    if (employee) {
      const now = new Date().toISOString();
      const updatedEmp = {
        ...employee,
        attendance: [...(employee.attendance || []), { loginTime: now }]
      };
      const newList = freshEmployees.map(e => e.id === employee.id ? updatedEmp : e);
      setEmployeesState(newList);
      saveToStorage("novelleyx_employees", newList);
      setUser(updatedEmp);
      saveToStorage("novelleyx_user", updatedEmp);
      addNotification(
        `Welcome back, ${employee.name}! Punched in at ${new Date().toLocaleTimeString()}.`,
        "Attendance"
      );
      return true;
    }
    return false;
  };

  const logout = () => {
    if (user && user.role === "employee") {
      const now = new Date().toISOString();
      const freshEmployees = loadFromStorage("novelleyx_employees", []);
      const emp = freshEmployees.find(e => e.id === user.id);
      if (emp && emp.attendance && emp.attendance.length > 0) {
        const updated = { ...emp };
        updated.attendance = [...updated.attendance];
        updated.attendance[updated.attendance.length - 1] = {
          ...updated.attendance[updated.attendance.length - 1],
          logoutTime: now
        };
        const newList = freshEmployees.map(e => e.id === user.id ? updated : e);
        setEmployeesState(newList);
        saveToStorage("novelleyx_employees", newList);
      }
    }
    setUser(null);
    localStorage.removeItem("novelleyx_user");
  };

  const signupEmployee = (employeeData) => {
    const d = new Date();
    const yy  = String(d.getFullYear()).slice(-2);
    const mm  = String(d.getMonth() + 1).padStart(2, "0");
    const dd  = String(d.getDate()).padStart(2, "0");
    const hh  = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const ss  = String(d.getSeconds()).padStart(2, "0");
    const newCode = `${yy}${mm}${dd}${hh}${min}${ss}`;

    const freshEmployees = loadFromStorage("novelleyx_employees", []);
    const newId = freshEmployees.length > 0 ? Math.max(...freshEmployees.map(e => e.id)) + 1 : 1;
    const newEmployee = {
      id: newId,
      name: employeeData.name,
      email: employeeData.email,
      age: employeeData.age,
      dob: employeeData.dob,
      address: employeeData.address,
      phone: employeeData.phone || "",
      bio: "",
      accessCode: newCode,
      role: "employee",
      approved: true,
      attendance: [],
      skills: {},
    };
    const newList = [...freshEmployees, newEmployee];
    setEmployeesState(newList);
    saveToStorage("novelleyx_employees", newList);
    return newCode;
  };

  if (!hydrated) return null; // prevent SSR mismatch

  return (
    <AuthContext.Provider value={{
      user, employees, setEmployees,
      notifications, addNotification, updateProfile,
      loginAdmin, loginEmployeeCode, logout, signupEmployee,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
