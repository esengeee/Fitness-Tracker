"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TodayPage() {
  const [exercises, setExercises] = useState([]); // all exercises for today
  const [completed, setCompleted] = useState([]); // completed exercises
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const todayDate = new Date().toISOString().split("T")[0];

  // ✅ Default template exercises
  const defaultExercises = [
    { name: "Push Ups", sets: 3, reps: 10 },
    { name: "Squats", sets: 3, reps: 12 },
    { name: "Plank", sets: 3, reps: 60 }, // seconds
  ];

  useEffect(() => {
    const fetchTodayWorkout = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting to login...");
          router.replace("/login");
          return;
        }

        // Fetch today's exercises
        const res = await fetch("/api/today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        let data = await res.json();

        // If empty, use default template
        if (!data || data.length === 0) data = defaultExercises;

        // Fetch today's completed workouts
        const completedRes = await fetch("/api/completed", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!completedRes.ok) {
          console.error("Failed to fetch completed workouts:", await completedRes.text());
          setLoading(false);
          return;
        }

        const completedData = await completedRes.json();

        const todayCompletedEntry = Array.isArray(completedData)
          ? completedData.find(
              (entry) => new Date(entry.date).toISOString().split("T")[0] === todayDate
            )
          : null;

        if (todayCompletedEntry) {
          setCompleted(todayCompletedEntry.exercises.map((ex) => ex.name));
        }

        setExercises(data);
      } catch (error) {
        console.error("Error fetching today's workout:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayWorkout();
  }, []);

  const toggleExercise = (index) => {
    const exercise = exercises[index];
    if (completed.includes(exercise.name)) {
      setCompleted(completed.filter((name) => name !== exercise.name));
    } else {
      setCompleted([...completed, exercise.name]);
    }
  };

  const markCompleted = async () => {
    if (completed.length === 0) {
      alert("Please select at least one exercise!");
      return;
    }

    const exercisesToSave = exercises.filter((ex) => completed.includes(ex.name));

    await fetch("/api/completed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ date: todayDate, exercises: exercisesToSave }),
    });

    alert("Today's workout updated ✅");
  };

  if (loading) return <p className="p-6 text-gray-300">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-200">Today’s Workout</h1>

      <ul className="space-y-3">
        {exercises.map((ex, i) => (
          <li
            key={i}
            className="p-4 bg-purple-200 rounded-lg shadow flex items-center justify-between"
          >
            <div className="text-purple-900 font-medium">
              {ex.name} — {ex.sets} sets × {ex.reps} reps
            </div>
            <input
              type="checkbox"
              checked={completed.includes(ex.name)}
              onChange={() => toggleExercise(i)}
              className="w-5 h-5 accent-purple-700"
            />
          </li>
        ))}
      </ul>

      {exercises.length > 0 && (
        <button
          onClick={markCompleted}
          className="mt-6 px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg shadow hover:bg-purple-800 transition"
        >
          Update Completed Exercises
        </button>
      )}
    </div>
  );
}
