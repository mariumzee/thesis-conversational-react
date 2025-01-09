import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

interface ConversationPanelProps {
    messages: { role: string; content: string }[];
    loading: boolean;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({ messages, loading }) => {
    const renderText = (text: string) => {
        return text.split("\n").map((paragraph, index) => {
            if (paragraph.trim()) {
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
                className="text-2xl font-serif  text-center mb-10">
                Conversation Panel
            </h1>

            <div className="space-y-4">
                {messages.map((msg, index) => {
                    const isUserMessage = msg.role === "user";
                    return (
                        <div key={index}
                            className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-xl p-4 rounded-lg shadow-md
                             ${isUserMessage ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-800"}`}>
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
            </div>
            {loading && (
                <ThreeDots visible={true}
                    height="80"
                    width="80"
                    color="#4A90E2"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass="" />
            )}
        </div>
    );
};

export default ConversationPanel;
