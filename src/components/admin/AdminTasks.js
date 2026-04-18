"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design Homepage", assignee: "Employee 1", status: "In Progress", description: "Create the main dashboard UI design." },
    { id: 2, title: "API Integration", assignee: "Employee 2", status: "Pending", description: "Connect the frontend with the user API." }
  ]);
  const [newTask, setNewTask] = useState({ title: "", assignee: "", description: "" });
  const [showAdd, setShowAdd] = useState(false);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignee) return;
    const task = {
      id: tasks.length + 1,
      ...newTask,
      status: "Pending"
    };
    setTasks([...tasks, task]);
    setNewTask({ title: "", assignee: "", description: "" });
    setShowAdd(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Task Management</h2>
          <p>Assign tasks to employees and track progress.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Assign New Task
        </button>
      </div>

      {showAdd && (
        <div className="card mb-6 animate-fade-in">
          <h3 className="mb-4">Create New Task</h3>
          <form onSubmit={handleAddTask} className="flex gap-4 flex-wrap">
            <div style={{ flex: "1 1 200px" }}>
              <label className="block mb-2 text-sm">Task Title</label>
              <input type="text" required className="w-full p-2 border rounded" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label className="block mb-2 text-sm">Assign To (Employee Name)</label>
              <input type="text" required className="w-full p-2 border rounded" value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})} />
            </div>
            <div style={{ flex: "1 1 100%" }}>
              <label className="block mb-2 text-sm">Description</label>
              <textarea required className="w-full p-2 border rounded" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
            </div>
            <button type="submit" className="btn-primary mt-2">Create Task</button>
          </form>
        </div>
      )}

      <div className="card">
        <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              <th className="p-4 text-sm text-gray-500 font-medium">Task</th>
              <th className="p-4 text-sm text-gray-500 font-medium">Assignee</th>
              <th className="p-4 text-sm text-gray-500 font-medium">Status</th>
              <th className="p-4 text-sm text-gray-500 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td className="p-4">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm text-gray-500">{task.description}</div>
                </td>
                <td className="p-4">{task.assignee}</td>
                <td className="p-4">
                  <span className={`badge ${task.status === 'Pending' ? 'badge-warning' : 'badge-success'}`}>
                    {task.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-gray-500 hover:text-red-500 ml-2" onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && <tr><td colSpan="4" className="text-center p-8 text-gray-500">No tasks assigned</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
