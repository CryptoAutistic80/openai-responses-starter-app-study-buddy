"use client";
import TeacherDashboard from "@/components/teacher-dashboard";
import NavHeader from "@/components/nav-header";

export default function TeacherPage() {
  return (
    <div className="h-screen flex flex-col">
      <NavHeader />
      <div className="flex-1">
        <TeacherDashboard />
      </div>
    </div>
  );
} 