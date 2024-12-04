"use client";

import React, { useState } from "react";

interface Message {
    role: string;
    content: string;
}

interface ConversationPanelProps {
    messages?: Message[]; // Allow parent to pass messages
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({ messages = [] }) => {
    const [input, setInput] = useState<string>("");

    return (
        <div className="p-6 h-full overflow-y-auto bg-green-100">
            <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
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
                                className={`max-w-xl p-4 rounded-lg shadow-md ${isUserMessage ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                <div className="font-semibold">
                                    {isUserMessage ? "You" : "GPT"}:
                                </div>
                                <div className="mt-2">
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>


        </div>
    );
};

export default ConversationPanel;
