"use client";
import { useState, useEffect } from "react";

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function WeeklyPage() {
  const [schedule, setSchedule] = useState({});
  const [inputs, setInputs] = useState({}); // store input values for each day

  useEffect(() => {
    fetch("/api/schedule")
      .then(res => res.json())
      .then(data => setSchedule(data));
  }, []);

  const handleInputChange = (day, field, value) => {
    setInputs({
      ...inputs,
      [day]: { ...inputs[day], [field]: value },
    });
  };

  const addExercise = async (day) => {
    let exercise = inputs[day];

    if (!exercise || !exercise.name) {
      alert("Please enter an exercise name!");
      return;
    }

    // Set defaults if empty
    const sets = exercise.sets ? parseInt(exercise.sets) : 3;
    const reps = exercise.reps ? parseInt(exercise.reps) : 10;

    const exerciseToSave = {
      name: exercise.name,
      sets,
      reps,
    };

    await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, exercise: exerciseToSave }),
    });

    // Refresh schedule
    const updated = await fetch("/api/schedule").then(r => r.json());
    setSchedule(updated);

    // Clear input fields for this day
    setInputs({ ...inputs, [day]: { name: "", sets: "", reps: "" } });
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-200">Weekly Schedule</h1>

      <div className="space-y-4">
        {days.map((day) => (
          <div
            key={day}
            className="p-4 bg-purple-200 rounded-lg shadow flex flex-col"
          >
            <h2 className="font-semibold text-purple-900 text-lg mb-2">{day}</h2>

            <ul className="mb-2">
              {schedule[day]?.map((ex, i) => (
                <li
                  key={i}
                  className="text-purple-900 py-1 border-b border-purple-300 last:border-b-0"
                >
                  {ex.name} — {ex.sets} × {ex.reps}
                </li>
              ))}
            </ul>

            {/* Input fields to add new exercise */}
            <div className="flex flex-wrap gap-2 mb-2">
              <input
                type="text"
                placeholder="Exercise Name"
                value={inputs[day]?.name || ""}
                onChange={(e) => handleInputChange(day, "name", e.target.value)}
                className="px-2 py-1 rounded border border-purple-700 text-black flex-1 min-w-[120px]"
              />
              <input
                type="number"
                placeholder="Sets"
                value={inputs[day]?.sets || ""}
                onChange={(e) => handleInputChange(day, "sets", e.target.value)}
                className="px-2 py-1 rounded border border-purple-700 text-black w-24"
              />
              <input
                type="number"
                placeholder="Reps"
                value={inputs[day]?.reps || ""}
                onChange={(e) => handleInputChange(day, "reps", e.target.value)}
                className="px-2 py-1 rounded border border-purple-700 text-black w-24"
              />
            </div>

            <button
              onClick={() => addExercise(day)}
              className="mt-2 self-start px-4 py-2 bg-purple-700 text-white font-semibold rounded-lg shadow hover:bg-purple-800 transition"
            >
              + Add Exercise
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
