"use client";

import React from "react";
import { FileText, BookOpen, Clock, Target } from "lucide-react";

interface StudyMaterial {
  id: string;
  title: string;
  type: string;
  uploadedAt: Date;
  lastAccessed: Date;
}

interface StudyStats {
  totalMaterials: number;
  studyTime: number;
  completedQuizzes: number;
  activeGoals: number;
}

const StudyDashboard: React.FC = () => {
  // Mock data - will be replaced with real data later
  const materials: StudyMaterial[] = [
    {
      id: "1",
      title: "Biology Chapter 1",
      type: "pdf",
      uploadedAt: new Date(),
      lastAccessed: new Date(),
    },
    {
      id: "2",
      title: "Chemistry Notes",
      type: "doc",
      uploadedAt: new Date(),
      lastAccessed: new Date(),
    },
  ];

  const stats: StudyStats = {
    totalMaterials: 2,
    studyTime: 120, // minutes
    completedQuizzes: 3,
    activeGoals: 2,
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Study Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Materials</span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.totalMaterials}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Study Time</span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.studyTime}m</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-600">Quizzes</span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.completedQuizzes}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-600">Goals</span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.activeGoals}</p>
        </div>
      </div>

      {/* Recent Materials */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200">
        <div className="p-4 border-b border-stone-200">
          <h3 className="text-lg font-semibold">Recent Materials</h3>
        </div>
        <div className="divide-y divide-stone-200">
          {materials.map((material) => (
            <div key={material.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{material.title}</h4>
                    <p className="text-sm text-gray-500">
                      Last accessed: {material.lastAccessed.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="text-sm text-blue-500 hover:text-blue-600">
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyDashboard; 