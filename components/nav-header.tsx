"use client";

import Link from "next/link";
import { GraduationCap, Users, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export default function NavHeader() {
  const pathname = usePathname();

  return (
    <div className="h-16 border-b border-stone-200 bg-white">
      <div className="h-full max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            href="/student" 
            className={`flex items-center gap-2 ${
              pathname === "/student" 
                ? "text-blue-500" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span>Student View</span>
          </Link>

          <Link 
            href="/teacher"
            className={`flex items-center gap-2 ${
              pathname === "/teacher" 
                ? "text-green-500" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Teacher View</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 