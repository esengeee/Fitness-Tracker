"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/clientAuth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Email and password are required");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Login failed");

      if (data.token) setToken(data.token);

      router.push("/today");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-purple-900/10 p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-purple-200">Welcome back</h1>

        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="Your password"
              required
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-2 bg-purple-700 text-white font-semibold rounded-lg shadow hover:bg-purple-800 transition"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-purple-200/80">
          New here?{" "}
          <a href="/register" className="text-purple-200 underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
