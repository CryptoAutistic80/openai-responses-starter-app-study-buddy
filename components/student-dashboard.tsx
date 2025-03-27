"use client";

import React, { useState } from "react";
import { BookOpen, MessageSquare, ChevronLeft, ChevronDown, Brain, Target, Search, BookOpenCheck, Clock } from "lucide-react";
import Chat from "./chat";
import { Item, processMessages } from "@/lib/assistant";
import useConversationStore from "@/stores/useConversationStore";

interface Class {
  id: string;
  name: string;
  description: string;
  teacher: string;
  materials: number;
  progress?: number;
  nextLesson?: string;
}

const StudentDashboard: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showStudyTools, setShowStudyTools] = useState(false);
  const { chatMessages, addConversationItem, addChatMessage } = useConversationStore();

  // Mock data - will be replaced with real data later
  const classes: Class[] = [
    {
      id: "1",
      name: "Biology 101",
      description: "Introduction to Biology",
      teacher: "Dr. Smith",
      materials: 5,
      progress: 60,
      nextLesson: "Cell Structure and Function",
    },
    {
      id: "2",
      name: "Chemistry 101",
      description: "Basic Chemistry",
      teacher: "Prof. Johnson",
      materials: 3,
      progress: 30,
      nextLesson: "Chemical Bonds",
    },
  ];

  const studyTools = [
    { icon: <Brain className="w-4 h-4" />, label: "Generate Quiz", action: "quiz" },
    { icon: <BookOpenCheck className="w-4 h-4" />, label: "Summarize Topic", action: "summarize" },
    { icon: <Target className="w-4 h-4" />, label: "Practice Questions", action: "practice" },
    { icon: <Clock className="w-4 h-4" />, label: "Study Timer", action: "timer" },
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userItem: Item = {
      type: "message",
      role: "user",
      content: [{ type: "input_text", text: message.trim() }],
    };
    const userMessage: any = {
      role: "user",
      content: message.trim(),
    };

    try {
      addConversationItem(userMessage);
      addChatMessage(userItem);
      await processMessages();
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  return (
    <div className="h-full bg-gray-50">
      {!selectedClass ? (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Continue your learning journey</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your classes and materials..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{cls.name}</h3>
                      <p className="text-sm text-gray-600">{cls.description}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClass(cls);
                        setShowChat(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>{cls.materials} study materials</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Teacher: {cls.teacher}
                    </div>
                    {cls.progress !== undefined && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{cls.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${cls.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedClass(cls)}
                    className="mt-6 w-full py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Class Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
              <div className="h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedClass(null)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <h2 className="text-xl font-bold">{selectedClass.name}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowStudyTools(!showStudyTools)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Brain className="w-4 h-4" />
                      <span>Study Tools</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showStudyTools ? 'rotate-180' : ''}`} />
                    </button>
                    {showStudyTools && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        {studyTools.map((tool) => (
                          <button
                            key={tool.action}
                            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 text-sm"
                            onClick={() => {
                              // Handle tool action
                              setShowStudyTools(false);
                            }}
                          >
                            {tool.icon}
                            <span>{tool.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      showChat 
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{showChat ? 'Hide Chat' : 'Show Chat'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Study Materials */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Next Up</h3>
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="font-medium mb-2">{selectedClass.nextLesson}</h4>
                    <p className="text-sm text-gray-600 mb-4">Continue where you left off</p>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                      Start Lesson
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Study Materials</h3>
                  <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
                    {selectedClass.materials === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        No materials available yet
                      </div>
                    ) : (
                      // Materials will be listed here
                      <div className="p-6 text-center text-gray-500">
                        Materials coming soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            {showChat && (
              <div className="w-[400px] border-l border-gray-200 bg-white">
                <Chat items={chatMessages} onSendMessage={handleSendMessage} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard; 