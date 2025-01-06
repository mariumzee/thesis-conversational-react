"use client";

import React, { useState, useEffect, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";

interface Message {
    role: string;
    content: string;
}

interface ConversationPanelProps {
    messages?: Message[];
    loading?: boolean;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({ messages = [], loading = false }) => {
    const [input, setInput] = useState<string>("");
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to the bottom of the chat whenever messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Function to render content as paragraphs or lists
    const renderContent = (content: string) => {
        const listRegex = /^(\d+\.\s+|•\s+)/gm; // Matches numbered or bullet points
        const isList = listRegex.test(content);

        if (isList) {
            const listItems = content.split("\n").map((line, index) => {
                if (line.match(/^\d+\./)) {
                    return <li key={index}>{line.replace(/^\d+\.\s*/, "")}</li>; // Remove number and period
                } else if (line.match(/^•/)) {
                    return <li key={index}>{line.replace(/^•\s*/, "")}</li>; // Remove bullet point
                }
                return null;
            });

            return <ul className="list-disc pl-5 space-y-2">{listItems}</ul>; // Render as a list
        }

        // Split long text into paragraphs for readability
        const paragraphs = content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed mb-3 last:mb-0">{paragraph}</p>
        ));

        return <div>{paragraphs}</div>; // Render paragraphs
    };

    return (
        <div className="p-6 h-full overflow-y-auto" style={{ backgroundColor: "#C9E1D5", paddingTop: 0 }}>
            <h1
                style={{ position: "sticky", top: 0, fontStyle: "italic", backgroundColor: "rgba(201, 225, 213, 0.8)", paddingTop: 15 }}
                className="text-2xl font-bold text-center text-green-600 mb-6"
            >
                Hi! Let's have a conversation
            </h1>

            <div className="space-y-4">
                {/* Message List */}
                {messages.map((msg, index) => {
                    const isUserMessage = msg.role === "user";
                    return (
                        <div
                            key={index}
                            className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-xl p-4 rounded-lg shadow-md ${isUserMessage
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                {/* Message Header */}
                                <div className="font-semibold text-lg mb-2">
                                    {isUserMessage ? "You" : "GPT"}:
                                </div>
                                {/* Message Content */}
                                <div className="mt-2">{renderContent(msg.content)}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messageEndRef} />
            </div>

            {loading && (
                <div className="flex justify-center mt-4">
                    <ThreeDots
                        visible={true}
                        height="80"
                        width="80"
                        color="#4fa94d"
                        radius="9"
                        ariaLabel="three-dots-loading"
                    />
                </div>
            )}
        </div>
    );
};

export default ConversationPanel;
