import { connectDB } from "@/lib/mongodb";
import Exercise from "@/models/Exercise";

export async function GET() {
  await connectDB();
  const exercises = await Exercise.find();
  return Response.json(exercises);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const exercise = await Exercise.create(data);
  return Response.json(exercise);
}
