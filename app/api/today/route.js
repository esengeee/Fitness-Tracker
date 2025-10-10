import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WeeklySchedule from "@/models/WeeklySchedule";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const user = verifyToken(request);
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🧠 Get today’s day name
    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    // ✅ Fetch schedule only for this user
    const todaySchedule = await WeeklySchedule.findOne({
      userId: user.userId,
      day: today,
    });

    if (!todaySchedule) {
      return new NextResponse(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(todaySchedule.exercises), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching today's workout:", err);
    return new NextResponse(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
