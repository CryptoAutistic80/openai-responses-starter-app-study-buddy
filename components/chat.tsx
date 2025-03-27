"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ToolCall from "./tool-call";
import Message from "./message";
import Annotations from "./annotations";
import { Item } from "@/lib/assistant";
import { BookOpen, FileText, Brain, Target, Send } from "lucide-react";

interface ChatProps {
  items: Item[];
  onSendMessage: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({ items, onSendMessage }) => {
  const itemsEndRef = useRef<HTMLDivElement>(null);
  const [inputMessageText, setinputMessageText] = useState<string>("");
  // This state is used to provide better user experience for non-English IMEs such as Japanese
  const [isComposing, setIsComposing] = useState(false);
  const [showStudyTools, setShowStudyTools] = useState(false);

  const scrollToBottom = () => {
    itemsEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isComposing) {
      event.preventDefault();
      onSendMessage(inputMessageText);
      setinputMessageText("");
    }
  }, [onSendMessage, inputMessageText]);

  useEffect(() => {
    scrollToBottom();
  }, [items]);

  const studyTools = [
    { icon: <BookOpen className="w-5 h-5" />, label: "Generate Quiz" },
    { icon: <FileText className="w-5 h-5" />, label: "Summarize" },
    { icon: <Brain className="w-5 h-5" />, label: "Explain Concept" },
    { icon: <Target className="w-5 h-5" />, label: "Set Goal" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Study Tools Toggle */}
      <div className="flex-none px-6 pt-4">
        <button
          onClick={() => setShowStudyTools(!showStudyTools)}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <span>Study Tools</span>
          <svg
            className={`w-4 h-4 transform transition-transform ${showStudyTools ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Study Tools Panel */}
      {showStudyTools && (
        <div className="flex-none px-6 py-2">
          <div className="grid grid-cols-2 gap-2">
            {studyTools.map((tool, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(`/tool ${tool.label.toLowerCase()}`)}
                className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 hover:bg-gray-50 transition-colors"
              >
                {tool.icon}
                <span className="text-sm">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index}>
              {item.type === "message" && (
                <Message message={item} />
              )}
              {item.type === "tool_call" && (
                <ToolCall
                  name={item.name}
                  args={item.parsedArguments}
                  output={item.output}
                  status={item.status}
                />
              )}
            </div>
          ))}
          <div ref={itemsEndRef} />
        </div>
      </div>

      {/* Chat Input - Fixed at bottom */}
      <div className="flex-none p-4 border-t border-gray-200">
        <div className="flex w-full items-center rounded-2xl border border-stone-200 shadow-sm bg-white">
          <textarea
            id="prompt-textarea"
            tabIndex={0}
            dir="auto"
            rows={1}
            placeholder="Ask a study question or use /help to see available commands..."
            className="flex-1 resize-none overflow-hidden border-0 focus:outline-none text-sm bg-transparent py-4 pl-4 pr-2 min-h-[56px] max-h-[56px]"
            value={inputMessageText}
            onChange={(e) => setinputMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
          <button
            onClick={() => {
              if (inputMessageText.trim()) {
                onSendMessage(inputMessageText);
                setinputMessageText("");
              }
            }}
            disabled={!inputMessageText.trim()}
            className="flex-none p-3 mr-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5 text-blue-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
