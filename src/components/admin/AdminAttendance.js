"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminAttendance() {
  const { employees } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Attendance Logs</h2>
        <p>View employee login and logout times.</p>
      </div>

      <div className="card">
        <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              <th className="p-4 text-sm text-gray-500 font-medium">Employee Name</th>
              <th className="p-4 text-sm text-gray-500 font-medium">Date</th>
              <th className="p-4 text-sm text-gray-500 font-medium">Login Time</th>
              <th className="p-4 text-sm text-gray-500 font-medium">Logout Time</th>
            </tr>
          </thead>
          <tbody>
            {employees.flatMap(emp => 
              emp.attendance.map((record, index) => (
                <tr key={`${emp.id}-${index}`} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td className="p-4 font-semibold">{emp.name}</td>
                  <td className="p-4">{new Date(record.loginTime).toLocaleDateString()}</td>
                  <td className="p-4 text-green-600">{new Date(record.loginTime).toLocaleTimeString()}</td>
                  <td className="p-4 text-red-600">{record.logoutTime ? new Date(record.logoutTime).toLocaleTimeString() : "Still Active"}</td>
                </tr>
              ))
            )}
            {employees.every(emp => emp.attendance.length === 0) && (
              <tr><td colSpan="4" className="text-center p-8 text-gray-500">No attendance logs found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
