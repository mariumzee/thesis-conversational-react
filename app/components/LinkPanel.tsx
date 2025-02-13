"use client";

import React, { useEffect, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import "./LinkPanel.css";
import ReactGA from "react-ga4";

interface Message {
  role: string;
  content: string;
}

interface LinkPanelProps {
  messages: Message[];
  loading: boolean;
}

const LinkPanel: React.FC<LinkPanelProps> = ({ messages, loading }) => {
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function extractJsonObject(inputString: string): any {
    const regex = /{[^{}]*}/;
    const match = inputString.match(regex);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        console.error("Failed to parse JSON", e);
      }
    }
    return null;
  }

  const sendGAEvent = (value: unknown) => {
    ReactGA.event({
      category: "Clicks",
      action: "Link Clicked",
      label: String(value),
    });
  };
  const renderMessageContent = (content: string) => {
    console.log("content", content);

    // Function to extract JSON from any text
    const extractJsonFromText = (content: string) => {
      const jsonMatch = content.match(/\{[\s\S]*\}/); // Find the first JSON object
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]); // Parse JSON
        } catch (error) {
          console.error("Invalid JSON found in text", error);
        }
      }
      return null;
    };

    const jsonObj = extractJsonFromText(content);
    console.log("jsonOBJ MAKING", jsonObj);

    if (jsonObj) {
      return (
        <ul>
          {Object.entries(jsonObj).map(([key, value], index) => (
            <li key={key}>
              <a
                onClick={() => sendGAEvent(value)}
                href={String(value)}
                target="_blank"
                className="block mt-2 text-[#b787f2] hover:text-[#CCAAF6] cursor-pointer"
              >
                {index + 1}: {String(key)}
              </a>
            </li>
          ))}
        </ul>
      );
    } else {
      return <span>I don't have related links to this topic.</span>;
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto link-panel">
      <h1 className="link-panel-title">Link-based Assistant</h1>

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
                    {isUserMessage ? "You" : "GPT suggests the following links"}
                    :
                  </div>
                  <div className="message-content">
                    {isUserMessage
                      ? msg.content
                      : renderMessageContent(msg.content)}
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={endOfMessagesRef}></div>
      </div>

      {loading && (
        <ThreeDots
          visible={loading}
          height="50"
          width="50"
          color="#b787f2"
          radius="9"
          ariaLabel="three-dots-loading"
        />
      )}
    </div>
  );
};

export default LinkPanel;
