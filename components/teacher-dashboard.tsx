"use client";

import React, { useState } from "react";
import { FileText, BookOpen, Settings, Users, MessageSquare, Upload, X, FolderPlus } from "lucide-react";
import Chat from "./chat";
import { Item, processMessages } from "@/lib/assistant";
import useConversationStore from "@/stores/useConversationStore";

interface Class {
  id: string;
  name: string;
  description: string;
  studentCount: number;
  allowWebAccess: boolean;
  instructions: string;
  materials: StudyMaterial[];
}

interface StudyMaterial {
  id: string;
  title: string;
  type: string;
  uploadedAt: Date;
  lastAccessed: Date;
  classId: string;
  description?: string;
}

const TeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"classes" | "materials" | "settings">("classes");
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedClassForMaterials, setSelectedClassForMaterials] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { chatMessages, addConversationItem, addChatMessage } = useConversationStore();

  // Mock data - will be replaced with real data later
  const classes: Class[] = [
    {
      id: "1",
      name: "Biology 101",
      description: "Introduction to Biology",
      studentCount: 25,
      allowWebAccess: true,
      instructions: "Focus on understanding core concepts and their applications",
      materials: [
        {
          id: "1",
          title: "Chapter 1 Notes",
          type: "pdf",
          uploadedAt: new Date(),
          lastAccessed: new Date(),
          classId: "1",
          description: "Introduction to cell biology and basic concepts",
        },
      ],
    },
    {
      id: "2",
      name: "Chemistry 101",
      description: "Basic Chemistry",
      studentCount: 30,
      allowWebAccess: false,
      instructions: "Focus on problem-solving and practical applications",
      materials: [],
    },
  ];

  // Get all materials across classes
  const allMaterials: StudyMaterial[] = classes.flatMap(cls => 
    cls.materials.map(material => ({
      ...material,
      classId: cls.id
    }))
  );

  // Filter materials based on selected class
  const filteredMaterials = selectedClassForMaterials === "all"
    ? allMaterials
    : allMaterials.filter(material => material.classId === selectedClassForMaterials);

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
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-stone-200 p-4">
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab("classes")}
            className={`w-full flex items-center gap-2 p-2 rounded-lg ${
              activeTab === "classes" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Classes</span>
          </button>
          <button
            onClick={() => setActiveTab("materials")}
            className={`w-full flex items-center gap-2 p-2 rounded-lg ${
              activeTab === "materials" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Materials</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-2 p-2 rounded-lg ${
              activeTab === "settings" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "classes" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Classes</h2>
              <button className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90">
                Create New Class
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{cls.name}</h3>
                      <p className="text-sm text-gray-600">{cls.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedClass(cls);
                          setShowChat(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{cls.studentCount} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>{cls.materials.length} materials</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>Web access: {cls.allowWebAccess ? "Allowed" : "Disabled"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "materials" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Study Materials</h2>
              <div className="flex items-center gap-4">
                <select
                  value={selectedClassForMaterials}
                  onChange={(e) => setSelectedClassForMaterials(e.target.value)}
                  className="border border-stone-200 rounded-lg px-4 py-2"
                >
                  <option value="all">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Material
                </button>
              </div>
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaterials.map((material) => (
                <div
                  key={material.id}
                  className="border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{material.title}</h3>
                      <p className="text-sm text-gray-600">
                        {classes.find(c => c.id === material.classId)?.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <FileText className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {material.description && (
                    <p className="text-sm text-gray-600 mt-2">{material.description}</p>
                  )}
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span>Uploaded: {material.uploadedAt.toLocaleDateString()}</span>
                    <span>Last accessed: {material.lastAccessed.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {filteredMaterials.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No materials found. Upload some materials to get started.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            {/* Settings will go here */}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[600px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Upload Material</h3>
              <button onClick={() => setShowUploadModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Class</label>
                <select className="w-full border border-stone-200 rounded-lg px-4 py-2">
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full border border-stone-200 rounded-lg px-4 py-2"
                  placeholder="Enter material title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full border border-stone-200 rounded-lg px-4 py-2"
                  rows={3}
                  placeholder="Enter material description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Upload Files</label>
                <div className="border-2 border-dashed border-stone-200 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Drag and drop files here, or click to select</p>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {showChat && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[800px] h-[600px] flex flex-col">
            <div className="p-4 border-b border-stone-200 flex justify-between items-center">
              <h3 className="font-semibold">Test Chat - {selectedClass.name}</h3>
              <button onClick={() => setShowChat(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <Chat items={chatMessages} onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard; 