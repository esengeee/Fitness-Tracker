"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch("/api/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          router.replace("/weekly");
        } else {
          localStorage.removeItem("token");
          router.replace("/login");
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Loading...</h1>
      <p>Checking your authentication status...</p>
    </div>
  );
}
