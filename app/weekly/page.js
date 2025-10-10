"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function WeeklyPage() {
  const [schedule, setSchedule] = useState({});
  const [inputs, setInputs] = useState({});
  const router = useRouter();

  const fetchSchedule = async () => {
    try {
      const res = await fetch("/api/schedule", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch schedule");
      const data = await res.json();

      // Transform into object grouped by day for easy rendering
      const grouped = {};
      data.forEach((item) => {
        grouped[item.day] = item.exercises;
      });

      setSchedule(grouped);
    } catch (err) {
      console.error(err);
      setSchedule({});
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleInputChange = (day, field, value) => {
    setInputs({
      ...inputs,
      [day]: { ...inputs[day], [field]: value },
    });
  };

  const addExercise = async (day) => {
    const exercise = inputs[day];
    if (!exercise || !exercise.name) {
      alert("Please enter an exercise name!");
      return;
    }

    const sets = exercise.sets ? parseInt(exercise.sets) : 3;
    const reps = exercise.reps ? parseInt(exercise.reps) : 10;
    const exerciseToSave = { name: exercise.name, sets, reps };

    try {
      console.log("Reached before /api/schedule");

      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ day, exercises: [exerciseToSave] }),
      });

      if (!res.ok) throw new Error("Failed to add exercise");

      console.log("Post fetch successful");

      await fetchSchedule();
      setInputs({ ...inputs, [day]: { name: "", sets: "", reps: "" } });
    } catch (err) {
      console.error("Error adding exercise:", err);
    }
  };

  // 🔹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white relative">
      {/* 🔹 Logout Button (top-right corner) */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold mb-6 text-purple-200 text-center">Weekly Schedule</h1>

      <div className="space-y-4">
        {days.map((day) => (
          <div key={day} className="p-4 bg-purple-200 rounded-lg shadow flex flex-col">
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
