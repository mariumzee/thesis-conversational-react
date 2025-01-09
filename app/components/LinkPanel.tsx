"use client";

import React, { useEffect, useRef } from 'react';
import { ThreeDots } from 'react-loader-spinner';

interface LinkContent {
  title: string;
  URL: string;
}

interface Message {
  role: string;
  content: string | LinkContent[];
}

interface LinkPanelProps {
  messages: Message[];
  loading: boolean;
}

const LinkPanel: React.FC<LinkPanelProps> = ({ messages, loading }) => {
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null);   // Create a ref for the last message

  useEffect(() => {
    // Scroll into view whenever the messages array changes
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const renderMessageContent = (content: string | LinkContent[]) => {
    if (typeof content === 'string') {
      return <span>{content}</span>;
    } else {
      return (
        <ul>
          {content.map((link, index) => (
            <li key={index}>
              <a href={link.URL} target="_blank" rel="noopener noreferrer" className="block mt-2 text-[#b787f2] hover:text-[#CCAAF6] cursor-pointer">
                {index + 1}: {link.title}
              </a>
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto" style={{ backgroundColor: "#000000", paddingTop: 0 }}>
      <h1 style={{ position: "sticky", color: "#b787f2", fontFamily: "serif", top: 10, backgroundColor: "rgb(31, 31, 31, 0.8)", paddingTop: 20, paddingBottom: 20 }}
        className="text-2xl font-serif text-center mb-6">
        Link-based Assistant
      </h1>

      <div className="space-y-4">
        {messages.length > 0 && messages.map((msg, index) => {
          const isUserMessage = msg.role === "user";
          return (
            <div key={index} className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xl p-4 rounded-lg shadow-md ${isUserMessage ? "bg-[#2f2f2f] text-white" : "bg-[#000] text-white"}`}>
                <div className="font-semibold">
                  {isUserMessage ? "You" : "GPT"}:
                </div>
                <div className="mt-2">
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endOfMessagesRef}></div> {/* This div acts as the scroll target */}
      </div>
      {loading && (
        <ThreeDots visible={true} height="80" width="80" color="#b787f2" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" />
      )}
    </div>
  );
};

export default LinkPanel;
