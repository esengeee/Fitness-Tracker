import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password)
      return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });

    const user = await User.findOne({ email });
    if (!user)
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return new Response(JSON.stringify({ token, email: user.email }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
