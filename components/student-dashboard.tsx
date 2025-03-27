"use client";

import React, { useState } from "react";
import { BookOpen, MessageSquare } from "lucide-react";
import Chat from "./chat";
import { Item, processMessages } from "@/lib/assistant";
import useConversationStore from "@/stores/useConversationStore";

interface Class {
  id: string;
  name: string;
  description: string;
  teacher: string;
  materials: number;
}

const StudentDashboard: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showChat, setShowChat] = useState(false);
  const { chatMessages, addConversationItem, addChatMessage } = useConversationStore();

  // Mock data - will be replaced with real data later
  const classes: Class[] = [
    {
      id: "1",
      name: "Biology 101",
      description: "Introduction to Biology",
      teacher: "Dr. Smith",
      materials: 5,
    },
    {
      id: "2",
      name: "Chemistry 101",
      description: "Basic Chemistry",
      teacher: "Prof. Johnson",
      materials: 3,
    },
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
    <div className="h-full">
      {!selectedClass ? (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Your Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedClass(cls)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{cls.name}</h3>
                    <p className="text-sm text-gray-600">{cls.description}</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{cls.materials} study materials</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Teacher: {cls.teacher}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 border-b border-stone-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedClass(null)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Classes
              </button>
              <h2 className="text-xl font-bold">{selectedClass.name}</h2>
            </div>
            <button
              onClick={() => setShowChat(!showChat)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{showChat ? "Hide Chat" : "Show Chat"}</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Study Materials */}
            <div className="flex-1 p-6">
              <h3 className="text-lg font-semibold mb-4">Study Materials</h3>
              <div className="space-y-4">
                {/* Materials list will go here */}
                <div className="text-gray-500 text-center py-8">
                  No materials available yet
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            {showChat && (
              <div className="w-96 border-l border-stone-200">
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