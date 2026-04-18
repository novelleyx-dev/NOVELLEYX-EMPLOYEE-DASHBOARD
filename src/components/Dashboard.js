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
import AdminTasks from "./admin/AdminTasks";
import EmployeeTasks from "./employee/EmployeeTasks";
import SettingsPage from "./shared/SettingsPage";
import AdminAttendance from "./admin/AdminAttendance";
import AdminAnalytics from "./admin/AdminAnalytics";
export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    if (user?.role === "admin") {
      switch (activeTab) {
        case "dashboard": return <AdminDashboardHome />;
        case "employees": return <AdminEmployees />;
        case "chat": return <SharedChat />;
        case "tasks": return <AdminTasks />;
        case "attendance": return <AdminAttendance />;
        case "analytics": return <AdminAnalytics />;
        case "settings": return <SettingsPage />;
        default: return <div><h2>{activeTab}</h2><p>This module is under construction.</p></div>;
      }
    } else {
      switch (activeTab) {
        case "dashboard": return <EmployeeDashboardHome />;
        case "skills": return <EmployeeSkills />;
        case "chat": return <SharedChat />;
        case "tasks": return <EmployeeTasks />;
        case "settings": return <SettingsPage />;
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
