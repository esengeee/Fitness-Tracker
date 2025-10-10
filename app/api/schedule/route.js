import { connectDB } from "@/lib/mongodb";
import WeeklySchedule from "@/models/WeeklySchedule";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const user = verifyToken(request);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const schedule = await WeeklySchedule.find({ userId: user.userId });
    return new Response(JSON.stringify(schedule), { status: 200 });
  } catch (err) {
    console.error("GET /api/schedule error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const user = verifyToken(request);
    const { day, exercises } = await request.json();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    if (!day || !exercises || exercises.length === 0) {
      return new Response(JSON.stringify({ error: "Missing day or exercises" }), { status: 400 });
    }

    let existing = await WeeklySchedule.findOne({ userId: user.userId, day });

    if (existing) {
      existing.exercises.push(...exercises);
      await existing.save();
    } else {
      await WeeklySchedule.create({ userId: user.userId, day, exercises });
    }

    return new Response(JSON.stringify({ message: "Schedule updated successfully" }), { status: 200 });
  } catch (err) {
    console.error("POST /api/schedule error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
