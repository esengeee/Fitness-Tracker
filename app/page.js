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
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);
}
