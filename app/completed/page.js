"use client";
import { useState, useEffect } from "react";

export default function CompletedPage() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
  const fetchCompleted = async () => {
    try {
      const res = await fetch("/api/completed");
      if (!res.ok) throw new Error("Network response not ok");

      const data = await res.json();
      setCompleted(data);
    } catch (err) {
      console.error("Failed to fetch completed workouts:", err);
      setCompleted([]); // fallback to empty array
    }
  };

  fetchCompleted();
}, []);

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-200">Completed Workouts</h1>

      {completed.length === 0 ? (
        <p className="text-gray-300">No workouts completed yet</p>
      ) : (
        <ul className="space-y-4">
          {completed.map((workout, i) => (
            <li
              key={i}
              className="p-4 bg-purple-200 rounded-lg shadow flex flex-col"
            >
              <p className="font-semibold text-purple-900 mb-2">
                {new Date(workout.date).toDateString()}
              </p>
              <ul className="ml-4 list-disc">
                {workout.exercises.map((ex, j) => (
                  <li
                    key={j}
                    className="text-purple-900 py-1 border-b border-purple-300 last:border-b-0"
                  >
                    {ex.name} — {ex.sets} × {ex.reps}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
