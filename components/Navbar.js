"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const tabs = [
    { href: "/today", label: "Today" },
    { href: "/weekly", label: "Weekly" },
    { href: "/completed", label: "Completed" },
  ];

  return (
    <nav className="fixed bottom-0 w-full flex justify-around bg-gray-900 text-white py-3">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-4 ${
            pathname === tab.href ? "text-yellow-400 font-bold" : "text-gray-300"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
