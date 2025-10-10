"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/clientAuth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Email and password are required");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Registration failed");

      if (data.token) setToken(data.token);

      router.push("/today");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-purple-900/10 p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-purple-200">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-purple-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded border border-purple-700 bg-purple-950/30 text-white placeholder-purple-300"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-purple-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded border border-purple-700 bg-purple-950/30 text-white placeholder-purple-300"
              placeholder="At least 6 characters"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-purple-200 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2 rounded border border-purple-700 bg-purple-950/30 text-white placeholder-purple-300"
              placeholder="Repeat password"
              required
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-2 bg-purple-700 text-white font-semibold rounded-lg shadow hover:bg-purple-800 transition"
          >
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-purple-200/80">
          Already have an account?{" "}
          <a href="/login" className="text-purple-200 underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
