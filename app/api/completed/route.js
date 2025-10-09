import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import CompletedWorkout from "@/models/CompletedWorkout";

export async function GET(request) {
  try {
    await connectDB();
    console.log("GET", request);
    const user = verifyToken(request);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch only this user's workouts
    const completed = await CompletedWorkout.find({ userId: user.userId }).sort({ date: -1 });

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

    const user = verifyToken(request);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { date, exercises } = await request.json();
    if (!date || !exercises || exercises.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let workout = await CompletedWorkout.findOne({ userId: user.userId, date });

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
      await CompletedWorkout.create({ userId: user.userId, date, exercises });
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
