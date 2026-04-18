"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/context/AuthContext";
import AdminDashboardHome from "./admin/AdminDashboardHome";
import AdminEmployees from "./admin/AdminEmployees";
import EmployeeDashboardHome from "./employee/EmployeeDashboardHome";
import EmployeeSkills from "./employee/EmployeeSkills";
import SharedChat from "./shared/SharedChat";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Render the proper content based on role and active tab
  const renderContent = () => {
    if (user?.role === "admin") {
      switch (activeTab) {
        case "dashboard": return <AdminDashboardHome />;
        case "employees": return <AdminEmployees />;
        case "chat": return <SharedChat />;
        default: return <div><h2>{activeTab}</h2><p>This module is under construction.</p></div>;
      }
    } else {
      switch (activeTab) {
        case "dashboard": return <EmployeeDashboardHome />;
        case "skills": return <EmployeeSkills />;
        case "chat": return <SharedChat />;
        default: return <div><h2>{activeTab}</h2><p>This module is under construction.</p></div>;
      }
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Header />
        <div className="page-content animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
