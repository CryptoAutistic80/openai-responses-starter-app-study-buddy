"use client";
import Link from "next/link";
import { GraduationCap, Users } from "lucide-react";

export default function Main() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto p-8">
        <Link 
          href="/student"
          className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-stone-200"
        >
          <GraduationCap className="w-12 h-12 text-blue-500" />
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Student View</h2>
            <p className="text-gray-600">Access your classes and study materials</p>
          </div>
        </Link>

        <Link 
          href="/teacher"
          className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-stone-200"
        >
          <Users className="w-12 h-12 text-green-500" />
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Teacher View</h2>
            <p className="text-gray-600">Manage classes and study materials</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
