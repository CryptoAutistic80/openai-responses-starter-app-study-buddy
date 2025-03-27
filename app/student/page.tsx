"use client";
import StudentDashboard from "@/components/student-dashboard";
import NavHeader from "@/components/nav-header";

export default function StudentPage() {
  return (
    <div className="h-screen flex flex-col">
      <NavHeader />
      <div className="flex-1">
        <StudentDashboard />
      </div>
    </div>
  );
} 