import { connectDB } from "@/lib/mongodb";
import CompletedWorkout from "@/models/CompletedWorkout"; // Your Mongoose model

export async function GET() {
  try {
    await connectDB();

    const completed = await CompletedWorkout.find().sort({ date: -1 });
    return new Response(JSON.stringify(completed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const { date, exercises } = await request.json();

    if (!date || !exercises || exercises.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let workout = await CompletedWorkout.findOne({ date });

    if (workout) {
      // Merge new exercises avoiding duplicates
      const existingNames = workout.exercises.map((ex) => ex.name);
      const newExercises = exercises.filter((ex) => !existingNames.includes(ex.name));

      workout.exercises.push(...newExercises);
      await workout.save();

      return new Response(JSON.stringify({ message: "Updated today's workout" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Create a new entry
      await CompletedWorkout.create({ date, exercises });
      return new Response(JSON.stringify({ message: "Marked today's workout" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
