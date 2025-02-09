"use client";

import React, { useEffect, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import "./ConversationPanel.css"; // Ensure to create this CSS file for styling
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  function removeSentenceStartingFrom(input: string, phrase: string): string {
    const regex = new RegExp(phrase + ".*?[.!?]", "i"); // Case insensitive match
    return input.replace(regex, "").trim();
  }

  const cleanText = (text: string) => {
    const sectionJsonRegex = /Section-2:\s*\{[\s\S]*?\}/g; // Matches "Section-2:" followed by JSON (multi-line safe)
    const jsonRegex = /\{[\s\S]*?\}/g; // Matches any JSON object

    text = text
      .replace(sectionJsonRegex, "") // Removes "Section-2" and its JSON
      .replace(jsonRegex, "") // Extra safety to remove any remaining JSON
      .replace(/section-\d+/gi, "") // R
      .replace("Section 1", "") // Removes any "section-#" occurrences
      .replace("Working links json", "") // Removes any "section-#" occurrences
      .replace("Working Links JSON", "") // Removes any "section-#" occurrences
      .replace("JSON", "") // Removes any "section-#" occurrences
      .replace("Textual Answer Explanation", "")
      .replace("Section 2", "") // Removes any "section-#" occurrences
      .replace("=", "") // Removes any "section-#" occurrences

      .replace(/[\{\}\[\]•,;]+/g, "") // Cleans up leftover symbols
      .replace(/^\s*:\s*|\s*:\s*$/gm, "") // Removes isolated colons
      .replace(/\s{2,}/g, " ") // Collapses extra spaces
      .trim();

    return removeSentenceStartingFrom(text, "Here are");
  };

  const renderText = (text: string) => {
    const numberedListRegex = /\d+\.\s(.*?)(?=\s\d+\.|$)/g;

    text = text.replace(numberedListRegex, "").trim();
    text = cleanText(text);

    console.log("CLEANED TEXT= ", text);

    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>;
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
