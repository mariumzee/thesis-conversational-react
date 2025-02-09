"use client";

import React, { useEffect, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import "./ConversationPanel.css"; // Ensure this CSS file exists

interface Message {
  role: string;
  content: string;
}

interface ConversationPanelProps {
  messages: Message[];
  loading: boolean;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  loading,
}) => {
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const cleanText = (text: string) => {
    return text
      .replace(/```json\s*[\s\S]*?```/g, "") // Remove multi-line JSON blocks
      .replace(/\{[\s\S]*?\}/g, "") // Remove inline JSON objects
      .replace(/https?:\/\/\S+/g, "") // Remove links
      .replace(/^#{1,6}\s*/gm, "") // Remove markdown headers (#, ##, ###, etc.)
      .replace(/section-\d+/gi, "") // Remove section indicators
      .replace(/[\[\]]+/g, "") // Remove brackets
      .replace(/^\s*:\s*|\s*:\s*$/gm, "") // Trim colons
      .replace(/\s{2,}/g, " ") // Reduce multiple spaces
      .trim();
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g); // Split by **bold**
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );
  };

  const renderText = (text: string) => {
    text = cleanText(text);

    // Detect lists
    const numberedListPattern = /^(\d+)\.\s(.+)/; // Matches "1. Text", "2. Text"
    const bulletListPattern = /^[-•]\s(.+)/; // Matches "- Text", "• Text"

    let currentList: JSX.Element[] = [];
    let isNumberedList = false;
    const elements: JSX.Element[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        if (isNumberedList) {
          elements.push(
            <ol key={elements.length} className="list-decimal pl-5">
              {currentList}
            </ol>
          );
        } else {
          elements.push(
            <ul key={elements.length} className="list-disc pl-5">
              {currentList}
            </ul>
          );
        }
        currentList = [];
        isNumberedList = false;
      }
    };

    // Split text into sections while maintaining inline formatting
    const lines = text.split(/(?=\d+\.\s|- |• )/g);

    lines.forEach((line, index) => {
      line = line.trim();
      const numberedMatch = line.match(numberedListPattern);
      const bulletMatch = line.match(bulletListPattern);

      if (numberedMatch) {
        if (!isNumberedList && currentList.length > 0) flushList();
        isNumberedList = true;
        currentList.push(
          <li key={index}>{renderBoldText(numberedMatch[2])}</li>
        );
      } else if (bulletMatch) {
        if (isNumberedList) flushList();
        currentList.push(<li key={index}>{renderBoldText(bulletMatch[1])}</li>);
      } else {
        flushList();
        elements.push(
          <p key={index} className="message-paragraph">
            {renderBoldText(line)}
          </p>
        );
      }
    });

    flushList(); // Ensure any remaining list items are flushed

    return elements;
  };

  return (
    <div className="panel-container">
      <h1 className="panel-title">Conversation Panel</h1>

      <div className="message-container">
        {messages
          .filter((msg) => msg.role !== "system")
          .map((msg, index) => {
            const isUserMessage = msg.role === "user";
            return (
              <div
                key={index}
                className={`message ${
                  isUserMessage ? "user-message" : "gpt-message"
                }`}
              >
                <div className="message-box">
                  <div className="message-role">
                    {isUserMessage ? "You" : "GPT"}:
                  </div>
                  <div className="message-content">
                    {renderText(msg.content)}
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={endOfMessagesRef}></div>
      </div>

      {loading && (
        <ThreeDots
          visible={true}
          height="50"
          width="50"
          color="#7f39fb"
          radius="9"
          ariaLabel="three-dots-loading"
        />
      )}
    </div>
  );
};

export default ConversationPanel;
