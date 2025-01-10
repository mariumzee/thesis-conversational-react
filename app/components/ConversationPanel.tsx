"use client";

import React, { useEffect, useRef } from 'react';
import { ThreeDots } from 'react-loader-spinner';

interface ConversationPanelProps {
    messages: { role: string; content: string }[];
    loading: boolean;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({ messages, loading }) => {
    const endOfMessagesRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const cleanText = (text: string) => {
        return text
            .replace(/({[^{}]*})/g, '') // Attempt to remove simple JSON objects

            .replace(/section-\d+/gi, '') // Remove 'section-1', 'section-2', etc. case-insensitively
            .replace(/[\{\}\[\]•,;]+/g, '') // Remove extra brackets, bullet points, commas, curly brackets, and semicolons
            .replace(/^\s*:\s*|\s*:\s*$/gm, '') // Remove colons at the start or end of each line
            .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
            .trim(); // Trim leading and trailing spaces
    };


    const renderText = (text: string) => {
        text = cleanText(text); // Clean text before splitting into paragraphs
        return text.split("\n").map((paragraph, index) => {
            paragraph = paragraph.trim(); // Trim each paragraph to ensure it's not just whitespace
            if (paragraph) {
                return <p key={index} style={{ marginBottom: '0.75em' }}>{paragraph}</p>;
            }
            return null;
        });
    };

    return (
        <div className="p-6 h-full overflow-y-auto"
            style={{
                backgroundColor: "#141414",
                paddingTop: 0
            }}>
            <h1 style={{ position: "sticky", color: "#7f39fb", top: 10, backgroundColor: "rgb(40, 40, 40, 0.8)", paddingTop: 20, paddingBottom: 20 }}
                className="text-2xl font-serif text-center mb-10">
                Conversation Panel
            </h1>

            <div className="space-y-4">
                {messages.filter(msg => msg.role !== 'system').map((msg, index) => {
                    const isUserMessage = msg.role === "user";
                    return (
                        <div key={index}
                            className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-xl p-4 rounded-lg shadow-md
                             ${isUserMessage ? "bg-[#2f2f2f] text-white"
                                        : "bg-[#141414] text-white"}`}>
                                <div className="font-semibold">
                                    {isUserMessage ? "You" : "GPT"}:
                                </div>
                                <div className="mt-2 text-left">
                                    {renderText(msg.content)}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={endOfMessagesRef}></div>
            </div>
            {loading && (
                <ThreeDots visible={true}
                    height="80"
                    width="80"
                    color="#7f39fb"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass="" />
            )}
        </div>
    );
};

export default ConversationPanel;
