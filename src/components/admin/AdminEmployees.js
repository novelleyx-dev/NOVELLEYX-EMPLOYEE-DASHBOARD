"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Check, X, Edit, Trash2 } from "lucide-react";

export default function AdminEmployees() {
  const { employees, setEmployees } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editCode, setEditCode] = useState("");

  const generateCode = () => {
    const d = new Date();
    // YYMMDDHHMMSS format (12 digits)
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yy}${mm}${dd}${hh}${min}${ss}`;
  };

  const handleAddEmployee = () => {
    const newCode = generateCode();
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const newEmployee = {
      id: newId,
      name: `New Employee ${newId}`,
      email: `employee${newId}@novelleyx.com`,
      accessCode: newCode,
      role: "employee",
      approved: true,
      attendance: [],
      skills: {},
      avatar: "/next.svg"
    };
    setEmployees([...employees, newEmployee]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Employee Management</h2>
          <p>Approve registrations and view 12-digit permanent access codes.</p>
        </div>
        <button className="btn-primary" onClick={handleAddEmployee}>Add Employee</button>
      </div>

      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 500 }}>Name</th>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 500 }}>Email</th>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 500 }}>Status</th>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 500 }}>Access Code</th>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 500, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "all 0.2s" }} className="hover:bg-gray-50">
                  <td style={{ padding: "1rem", fontWeight: 500 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#111" }}>
                        {emp.name.charAt(0)}
                      </div>
                      {emp.name}
                    </div>
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{emp.email}</td>
                  <td style={{ padding: "1rem" }}>
                    <span className={`badge ${emp.approved ? "badge-success" : "badge-warning"}`}>
                      {emp.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", fontFamily: "monospace", letterSpacing: "1px", fontWeight: "600", color: "var(--text-primary)" }}>
                    {emp.accessCode}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <div className="flex justify-end gap-2">
                      {!emp.approved ? (
                        <button onClick={() => handleApprove(emp.id)} title="Approve" style={{ color: "var(--success-color)", padding: "0.25rem" }}><Check size={18} /></button>
                      ) : (
                        <button onClick={() => handleReject(emp.id)} title="Revoke access" style={{ color: "var(--warning-color)", padding: "0.25rem" }}><X size={18} /></button>
                      )}
                      <button onClick={() => handleDelete(emp.id)} title="Remove" style={{ color: "var(--danger-color)", padding: "0.25rem" }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
