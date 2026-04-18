"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, MessageSquare } from "lucide-react";

export default function EmployeeTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design Homepage", assignee: user?.name, status: "Pending", description: "Create the main dashboard UI design.", review: "" }
  ]);
  const [reviewText, setReviewText] = useState({});

  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleAddReview = (id) => {
    if(!reviewText[id]) return;
    setTasks(tasks.map(t => t.id === id ? { ...t, review: reviewText[id] } : t));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>My Tasks</h2>
        <p>View tasks assigned to you by the admin and submit your reviews.</p>
      </div>

      <div className="grid gap-6">
        {tasks.map(task => (
          <div key={task.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{task.title}</h3>
                <p className="text-gray-500 mt-1">{task.description}</p>
              </div>
              <span className={`badge ${task.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                {task.status}
              </span>
            </div>

            <div className="border-t pt-4 mt-4">
              {task.review ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><MessageSquare size={16}/> Your Review</h4>
                  <p className="text-gray-700">{task.review}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Write Review / Comments on this task</label>
                  <textarea 
                    className="w-full p-2 border rounded" 
                    placeholder="Describe your work..."
                    value={reviewText[task.id] || ""}
                    onChange={e => setReviewText({...reviewText, [task.id]: e.target.value})}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <button 
                      className="btn-primary flex items-center gap-2"
                      onClick={() => handleAddReview(task.id)}
                    >
                      Submit Review
                    </button>
                    {task.status !== 'Completed' && (
                      <button 
                        className="btn-outline flex items-center gap-2"
                        onClick={() => handleStatusChange(task.id, 'Completed')}
                      >
                        <CheckCircle size={16} /> Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-gray-500 text-center py-8">No tasks assigned to you yet.</p>}
      </div>
    </div>
  );
}
