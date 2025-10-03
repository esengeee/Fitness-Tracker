import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Fitness Tracker",
  description: "Track workouts with Next.js + MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-16 bg-gray-100">
        {children}
        <Navbar />
      </body>
    </html>
  );
}
