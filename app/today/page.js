"use client";
import { useState, useEffect } from "react";

export default function TodayPage() {
  const [exercises, setExercises] = useState([]); // all exercises for today
  const [completed, setCompleted] = useState([]); // all completed exercises for today
  const [loading, setLoading] = useState(true);

  const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  useEffect(() => {
    const fetchTodayWorkout = async () => {
      setLoading(true);

      // Fetch today's exercises
      console.log("just after true")
      const res = await fetch("/api/today");
      const data = await res.json();
      console.log("just after apitoday")
      // Fetch today's completed workouts
      const completedRes = await fetch("/api/completed");
      const completedData = await completedRes.json();
      console.log("just after complete")
      const todayCompletedEntry = completedData.find(
        (entry) => new Date(entry.date).toISOString().split("T")[0] === todayDate
      );

      if (todayCompletedEntry) {
        setCompleted(todayCompletedEntry.exercises.map((ex) => ex.name));
      }

      setExercises(data);
      setLoading(false);
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

    // Get exercises details for completed names
    const exercisesToSave = exercises.filter((ex) => completed.includes(ex.name));

    await fetch("/api/completed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: todayDate, exercises: exercisesToSave }),
    });

    alert("Today's workout updated ✅");
  };

  if (loading) return <p className="p-6 text-gray-300">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-200">Today’s Workout</h1>

      {exercises.length === 0 ? (
        <p className="text-gray-300">No exercises planned today</p>
      ) : (
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
      )}

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
