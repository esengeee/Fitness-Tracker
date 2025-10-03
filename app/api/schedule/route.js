import { connectDB } from "@/lib/mongodb";
import WeeklySchedule from "@/models/WeeklySchedule";

export async function GET() {
  await connectDB();
  const schedules = await WeeklySchedule.find({});
  // Convert array of schedules to {day: exercises} object
  const result = {};
  schedules.forEach(s => {
    result[s.day] = s.exercises;
  });
  return new Response(JSON.stringify(result), { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const { day, exercise } = await req.json();

  // Check if schedule exists for this day
  let schedule = await WeeklySchedule.findOne({ day });
  if (schedule) {
    schedule.exercises.push(exercise);
    await schedule.save();
  } else {
    schedule = await WeeklySchedule.create({ day, exercises: [exercise] });
  }

  return new Response(JSON.stringify(schedule), { status: 200 });
}
