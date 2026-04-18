"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Mock predefined employee access codes
export const VALID_ACCESS_CODES = [
  "839201746512",
  "572903184620",
  "910284756193",
  "648291037564",
  "731920485617"
];

// Initial mock data for employees
const MOCK_EMPLOYEES = VALID_ACCESS_CODES.map((code, index) => ({
  id: index + 1,
  name: `Employee ${index + 1}`,
  email: `employee${index + 1}@novelleyx.com`,
  accessCode: code,
  role: "employee",
  approved: true,
  attendance: [],
  skills: { "React": 70, "Node.js": 50, "Design": 80 },
  avatar: "/next.svg"
}));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null if not logged in
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);

  // Load state from local storage on init (for mock persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem("novelleyx_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginGoogle = () => {
    // Mock Admin Login behavior or Employee initial phase
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  const loginGithub = () => {
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  const loginAdmin = async (email, password) => {
    if (email === "novelleyx@gmail.com" && password === "Abhi@123") {
      const adminUser = {
        name: "Admin",
        email: "novelleyx@gmail.com",
        role: "admin",
        avatar: "/vercel.svg"
      };
      setUser(adminUser);
      localStorage.setItem("novelleyx_user", JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const loginEmployeeCode = async (code) => {
    const employee = employees.find(emp => emp.accessCode === code && emp.approved);
    if (employee) {
      // Log attendance
      const now = new Date().toISOString();
      const updatedEmp = { ...employee, attendance: [...employee.attendance, { loginTime: now }] };
      const newEmployees = employees.map(e => e.id === employee.id ? updatedEmp : e);
      setEmployees(newEmployees);
      
      setUser(updatedEmp);
      localStorage.setItem("novelleyx_user", JSON.stringify(updatedEmp));
      return true;
    }
    return false;
  };

  const logout = () => {
    if (user && user.role === 'employee') {
      // log logout time
      const now = new Date().toISOString();
      const updatedEmp = employees.find(e => e.id === user.id);
      if (updatedEmp && updatedEmp.attendance.length > 0) {
        updatedEmp.attendance[updatedEmp.attendance.length - 1].logoutTime = now;
        const newEmployees = employees.map(e => e.id === user.id ? updatedEmp : e);
        setEmployees(newEmployees);
      }
    }
    setUser(null);
    localStorage.removeItem("novelleyx_user");
  };

  return (
    <AuthContext.Provider value={{
      user, employees, setEmployees,
      loginGoogle, loginGithub, loginAdmin, loginEmployeeCode, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
