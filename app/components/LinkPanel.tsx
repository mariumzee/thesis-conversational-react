"use client";

import React from "react";

interface Message {
  role: string;
  content: string;
}

interface LinkPanelProps {
  messages?: Message[]; // Allow parent to pass messages
}

const LinkPanel: React.FC<LinkPanelProps> = ({ messages = [] }) => {

  // Function to render content with clickable links in a list format
  const renderContentWithLinks = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const listItems = content.split(/\n\d+\.\s+/).filter(Boolean); // Split by numbered list items (e.g., 1., 2., etc.)

    return (
      <ol className="list-decimal ml-5 space-y-2">
        {listItems.map((item, index) => (
          <li key={index} className="text-black">
            {item.split(urlRegex).map((part, i) =>
              urlRegex.test(part) ? (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {part}
                </a>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </li>
        ))}
      </ol>
    );
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-blue-100">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Multi Context!
      </h1>
      <div className="space-y-4">
        {messages.map((msg, index) => {
          const isUserMessage = msg.role === "user";
          return (
            <div
              key={index}
              className={`flex ${isUserMessage ? "justify-end text-white" : "justify-start text-gray-800"}`}
            >
              <div
                className={`max-w-xl p-4 rounded-lg shadow-md ${isUserMessage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                <div className="font-semibold">
                  {isUserMessage ? "You" : "GPT"}:
                </div>
                <div className="mt-2">
                  {msg.role === "gpt"
                    ? renderContentWithLinks(msg.content)
                    : <span className="text-white-500">{msg.content}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

  );
};

export default LinkPanel;
