import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password)
      return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });

    const user = new User({ email, password });
    await user.save();

    // ✅ Generate JWT
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return new Response(
      JSON.stringify({ message: "User registered successfully", token }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
