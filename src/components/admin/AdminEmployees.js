"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Check, X, Edit, Trash2 } from "lucide-react";

export default function AdminEmployees() {
  const { employees, setEmployees } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editCode, setEditCode] = useState("");

  const handleApprove = (id) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, approved: true } : emp));
  };

  const handleReject = (id) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, approved: false } : emp));
  };

  const handleEditSave = (id) => {
    if (editCode.length === 12) {
      setEmployees(employees.map(emp => emp.id === id ? { ...emp, accessCode: editCode } : emp));
      setEditingId(null);
    } else {
      alert("Access code must be exactly 12 digits.");
    }
  };

  const handleDelete = (id) => {
    // In demo mode, we just remove them from array
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Employee Management</h2>
          <p>Approve registrations and manage 12-digit access codes.</p>
        </div>
        <button className="btn-primary">Add Employee</button>
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
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--bg-main)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                  <td style={{ padding: "1rem", fontFamily: "monospace", letterSpacing: "1px" }}>
                    {editingId === emp.id ? (
                      <input 
                        type="text" 
                        value={editCode} 
                        onChange={(e) => setEditCode(e.target.value.replace(/\D/g, ''))} 
                        maxLength={12} 
                        style={{ padding: "0.25rem 0.5rem", width: "140px" }}
                        autoFocus
                      />
                    ) : (
                      emp.accessCode
                    )}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <div className="flex justify-end gap-2">
                      {editingId === emp.id ? (
                        <>
                          <button onClick={() => handleEditSave(emp.id)} className="btn-primary" style={{ padding: "0.25rem 0.5rem" }}><Check size={16} /></button>
                          <button onClick={() => setEditingId(null)} className="btn-outline" style={{ padding: "0.25rem 0.5rem" }}><X size={16} /></button>
                        </>
                      ) : (
                        <>
                          {!emp.approved ? (
                            <button onClick={() => handleApprove(emp.id)} title="Approve" style={{ color: "var(--success-color)", padding: "0.25rem" }}><Check size={18} /></button>
                          ) : (
                            <button onClick={() => handleReject(emp.id)} title="Revoke access" style={{ color: "var(--warning-color)", padding: "0.25rem" }}><X size={18} /></button>
                          )}
                          <button onClick={() => { setEditingId(emp.id); setEditCode(emp.accessCode); }} title="Edit Code" style={{ color: "var(--info-color)", padding: "0.25rem" }}><Edit size={18} /></button>
                          <button onClick={() => handleDelete(emp.id)} title="Remove" style={{ color: "var(--danger-color)", padding: "0.25rem" }}><Trash2 size={18} /></button>
                        </>
                      )}
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
