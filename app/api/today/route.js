import { connectDB } from "@/lib/mongodb";
import WeeklySchedule from "@/models/WeeklySchedule";
import ExerciseTemplate from "@/models/ExerciseTemplate";

export async function GET() {
  await connectDB();
  const today = new Date().toLocaleString("en-US", { weekday: "long" });

  // Check schedule for today
  let schedule = await WeeklySchedule.find({ day: today });

  let exercises;
  if (schedule.length > 0) {
    exercises = schedule.flatMap(s => s.exercises);
  } else {
    // Check if default exercises exist
    exercises = await ExerciseTemplate.find();
    if (exercises.length === 0) {
      // Create defaults on-the-fly
      exercises = await ExerciseTemplate.insertMany([
        { name: "Push Ups", sets: 3, reps: 15 },
        { name: "Squats", sets: 3, reps: 20 },
        { name: "Plank", sets: 3, reps: 60 }, // seconds
      ]);
    }
  }

  return new Response(JSON.stringify(exercises), { status: 200 });
}
