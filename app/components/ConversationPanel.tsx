"use client";

import React, { useEffect, useRef, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import "./ConversationPanel.css"; // Ensure to create this CSS file for styling
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ReactGA from "react-ga4"; // Use "react-ga" if using Universal Analytics
const TRACKING_ID_GA = "G-6RB1RCRXHR";

ReactGA.initialize(TRACKING_ID_GA);

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
  const [loadingMessage, setLoadingMessage] = useState("Writing response...");

  // Array of dynamic loading texts
  const loadingTexts = [
    "Writing response...",
    "Gathering information...",
    "Thinking...",
    "Almost there...",
  ];

  // Cycle through loading messages every 2 seconds
  useEffect(() => {
    if (loading) {
      let index = 0;
      const interval = setInterval(() => {
        setLoadingMessage(loadingTexts[index]);
        index = (index + 1) % loadingTexts.length;
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function removeSentenceStartingFrom(input: string, phrase: string): string {
    const regex = new RegExp(phrase + ".*?[.!?]", "i"); // Case insensitive match
    return input.replace(regex, "").trim();
  }

  const cleanText = (text: string) => {
    const sectionJsonRegex = /Section-2:\s*\{[\s\S]*?\}/g; // Matches "Section-2:" followed by JSON (multi-line safe)
    const jsonRegex = /\{[\s\S]*?\}/g; // Matches any JSON object

    text = text
      .replace("**Section-1: Explanation**", "")
      .replace("Textual Answer Explanation", "")
      .replace("**Section-1: Explanation**", "")
      .replace("Section 1", "")

      // .replace(sectionJsonRegex, "")
      .replace(jsonRegex, "")
      .replace(/section-\d+/gi, "")
      .replace("Working links json", "")
      .replace("Working Links JSON", "")
      .replace("JSON", "")
      .replace("json", "")
      .replace("Textual Explanation", "")
      .replace("**Section-2: Relevant Website Links**", "")
      .replace("Relevant Website Links", "")
      .replace("**: **", "")
      .replace("** :**", "")

      .replace("Section 2", "")
      .replace("=", "")
      .replace(/[\{\}\[\]•,;]+/g, "")
      .replace(/^\s*:\s*|\s*:\s*$/gm, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    return removeSentenceStartingFrom(text, "Here are");
  };

  const renderText = (text: string) => {
    const cleanedText = cleanText(text);

    // Convert numbered list text into proper markdown formatting
    const formattedText = cleanedText.replace(/(\d+)\.\s+/g, "\n$1. "); // Ensure proper markdown list format

    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{formattedText}</ReactMarkdown>
    );
  };

  useEffect(() => {
    const handleKeyPress = (event: { key: string }) => {
      if (event.key === "Enter") {
        ReactGA.event({
          category: "Keyboard",
          action: "Pressed Enter Key",
          label: "User pressed Enter key",
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

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
        <div className="loading-container">
          <ThreeDots
            visible={true}
            height="50"
            width="50"
            color="#7f39fb"
            radius="9"
            ariaLabel="three-dots-loading"
          />
          <p className="loading-text">{loadingMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ConversationPanel;
