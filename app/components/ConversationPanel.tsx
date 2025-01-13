"use client";

import React, { useEffect, useRef } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import './ConversationPanel.css'; // Ensure to create this CSS file for styling

interface Message {
    role: string;
    content: string;
}

interface ConversationPanelProps {
    messages: Message[];
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
            .replace(/({[^{}]*})/g, '')
            .replace(/section-\d+/gi, '')
            .replace(/[\{\}\[\]•,;]+/g, '')
            .replace(/^\s*:\s*|\s*:\s*$/gm, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
    };

    const renderText = (text: string) => {
        text = cleanText(text);
        return text.split("\n").map((paragraph, index) => {
            paragraph = paragraph.trim();
            if (paragraph) {
                return <p key={index} className="message-paragraph">{paragraph}</p>;
            }
            return null;
        });
    };

    return (
        <div className="panel-container">
            <h1 className="panel-title">Conversation Panel</h1>

            <div className="message-container">
                {messages.filter(msg => msg.role !== 'system').map((msg, index) => {
                    const isUserMessage = msg.role === "user";
                    return (
                        <div key={index} className={`message ${isUserMessage ? "user-message" : "gpt-message"}`}>
                            <div className="message-box">
                                <div className="message-role">{isUserMessage ? "You" : "GPT"}:</div>
                                <div className="message-content">{renderText(msg.content)}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={endOfMessagesRef}></div>
            </div>

            {loading && (
                <ThreeDots visible={true} height="50" width="50" color="#7f39fb" radius="9" ariaLabel="three-dots-loading" />
            )}
        </div>
    );
};

export default ConversationPanel;
