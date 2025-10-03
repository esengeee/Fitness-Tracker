"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetch("/api/exercises")
      .then(res => res.json())
      .then(data => setExercises(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sets: Number(sets), reps: Number(reps) }),
    });
    setName("");
    setSets("");
    setReps("");
    const updated = await fetch("/api/exercises").then(r => r.json());
    setExercises(updated);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Fitness Tracker</h1>

      <form onSubmit={handleSubmit} className="my-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Exercise" />
        <input value={sets} onChange={(e) => setSets(e.target.value)} placeholder="Sets" type="number" />
        <input value={reps} onChange={(e) => setReps(e.target.value)} placeholder="Reps" type="number" />
        <button type="submit">Add</button>
      </form>

      <ul>
        {exercises.map((ex) => (
          <li key={ex._id}>
            {ex.name} - {ex.sets} sets × {ex.reps} reps
          </li>
        ))}
      </ul>
    </div>
  );
}
