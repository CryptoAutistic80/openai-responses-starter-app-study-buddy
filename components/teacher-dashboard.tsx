"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  MessageSquare, 
  Users, 
  Settings, 
  Plus,
  Search,
  GraduationCap,
  BarChart,
  Clock,
  FileText,
  ChevronDown,
  ChevronLeft,
  MoreVertical
} from "lucide-react";
import Chat from "./chat";
import { Item, processMessages } from "@/lib/assistant";
import useConversationStore from "@/stores/useConversationStore";

interface Class {
  id: string;
  name: string;
  description: string;
  studentsCount: number;
  materialsCount: number;
  nextClass?: string;
  nextClassTime?: string;
  averageProgress?: number;
  recentSubmissions?: number;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: string;
  description: string;
}

const TeacherDashboard: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showClassOptions, setShowClassOptions] = useState<string | null>(null);
  const [currentClassChat, setCurrentClassChat] = useState<string | null>(null);

  const { 
    chatMessages, 
    addConversationItem, 
    addChatMessage,
    clearConversation 
  } = useConversationStore();

  // Mock data - will be replaced with real data later
  const classes: Class[] = [
    {
      id: "1",
      name: "Biology 101",
      description: "Introduction to Biology",
      studentsCount: 25,
      materialsCount: 1,
      nextClass: "Cell Structure and Function",
      nextClassTime: "Tomorrow at 10:00 AM",
      averageProgress: 60,
      recentSubmissions: 15,
    },
    {
      id: "2",
      name: "Chemistry 101",
      description: "Basic Chemistry",
      studentsCount: 30,
      materialsCount: 0,
      nextClass: "Chemical Bonds",
      nextClassTime: "Thursday at 2:00 PM",
      averageProgress: 45,
      recentSubmissions: 8,
    },
  ];

  const quickActions: QuickAction[] = [
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Create Material",
      action: "create_material",
      description: "Upload new study materials",
    },
    {
      icon: <BarChart className="w-5 h-5" />,
      label: "Progress Report",
      action: "progress_report",
      description: "View class performance",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Message Students",
      action: "message_students",
      description: "Send announcements",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Schedule Class",
      action: "schedule_class",
      description: "Plan upcoming sessions",
    },
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !selectedClass) return;

    const userItem: Item = {
      type: "message",
      role: "user",
      content: [{ 
        type: "input_text", 
        text: `[${selectedClass.name}] ${message.trim()}`
      }],
    };

    const userMessage = {
      role: "user",
      content: `[${selectedClass.name}] ${message.trim()}`,
    };

    try {
      addConversationItem(userMessage);
      addChatMessage(userItem);
      await processMessages();
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  const handleClassSelect = (cls: Class) => {
    if (currentClassChat !== cls.id) {
      clearConversation();
      setCurrentClassChat(cls.id);
    }
    setSelectedClass(cls);
    setShowChat(true);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {!selectedClass ? (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Teacher Dashboard</h2>
              <p className="text-gray-600">Manage your classes and materials</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create New Class</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action) => (
              <button
                key={action.action}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all text-left"
              >
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-medium mb-1">{action.label}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search classes, materials, or students..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Classes List */}
          <div className="space-y-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{cls.name}</h3>
                        <div className="relative">
                          <button
                            onClick={() => setShowClassOptions(showClassOptions === cls.id ? null : cls.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                          </button>
                          {showClassOptions === cls.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                                Edit Class
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                                Manage Students
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                                Class Settings
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{cls.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Students</div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{cls.studentsCount}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Materials</div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{cls.materialsCount}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Avg. Progress</div>
                          <div className="flex items-center gap-2">
                            <BarChart className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{cls.averageProgress}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Recent Submissions</div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{cls.recentSubmissions}</span>
                          </div>
                        </div>
                      </div>

                      {cls.nextClass && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Next: {cls.nextClass} • {cls.nextClassTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedClass(cls)}
                      className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Manage Class
                    </button>
                    <button
                      onClick={() => handleClassSelect(cls)}
                      className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
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
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex min-h-0">
            {/* Class Management */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold mb-2">Students</h3>
                    <div className="text-3xl font-bold text-blue-500 mb-2">
                      {selectedClass.studentsCount}
                    </div>
                    <p className="text-sm text-gray-600">Active students in class</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold mb-2">Average Progress</h3>
                    <div className="text-3xl font-bold text-blue-500 mb-2">
                      {selectedClass.averageProgress}%
                    </div>
                    <p className="text-sm text-gray-600">Class completion rate</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold mb-2">Recent Activity</h3>
                    <div className="text-3xl font-bold text-blue-500 mb-2">
                      {selectedClass.recentSubmissions}
                    </div>
                    <p className="text-sm text-gray-600">New submissions this week</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Study Materials</h3>
                    <div className="bg-white rounded-xl border border-gray-200">
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <span className="font-medium">All Materials</span>
                        <button className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600">
                          <Plus className="w-4 h-4" />
                          <span>Add Material</span>
                        </button>
                      </div>
                      {selectedClass.materialsCount === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          No materials available yet
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          Materials coming soon
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Student Progress</h3>
                    <div className="bg-white rounded-xl border border-gray-200">
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <span className="font-medium">Progress Overview</span>
                        <button className="text-sm text-blue-500 hover:text-blue-600">
                          View All
                        </button>
                      </div>
                      <div className="p-6 text-center text-gray-500">
                        Student progress details coming soon
                      </div>
                    </div>
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

export default TeacherDashboard; 