import React from 'react';
import { ThreeDots } from 'react-loader-spinner'; // Make sure to install this package if not already included

interface LinkPanelProps {
  messages: { role: string; content: string }[];
  loading: boolean;
}

const LinkPanel: React.FC<LinkPanelProps> = ({ messages, loading }) => {
  // Function to render content, parsing out links if it's a GPT message
  const renderContentWithLinks = (content: string) => {
    const linkRegex = /https?:\/\/\S+/gi;
    const links = content.match(linkRegex);
    const textWithoutLinks = content.replace(linkRegex, '').trim();

    return (
      <>
        <span>{textWithoutLinks}</span>
        {links && links.map((link, index) => (
          <a key={index} href={link} target="_blank" rel="noopener noreferrer"
            className="block mt-2 text-blue-500 hover:text-blue-800">
            {link}
          </a>
        ))}
      </>
    );
  };

  return (
    <div className="p-6 h-full overflow-y-auto" style={{ backgroundColor: "#C2D9FC", paddingTop: 0 }}>
      <h1 style={{ position: "sticky", fontStyle: "italic", top: 0, backgroundColor: "rgb(194, 217, 252, 0.8)", paddingTop: 15 }}
        className="text-2xl font-bold text-center text-blue-600 mb-6">
        Link-based Assistant
      </h1>

      <div className="space-y-4">
        {messages.map((msg, index) => {
          const isUserMessage = msg.role === "user";
          return (
            <div key={index} className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xl p-4 rounded-lg shadow-md ${isUserMessage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                <div className="font-semibold">
                  {isUserMessage ? "You" : "GPT"}:
                </div>
                <div className="mt-2">
                  {msg.role === "gpt" ? (
                    renderContentWithLinks(msg.content)
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {loading && (
        <ThreeDots visible={true} height="80" width="80" color="#76A0CA" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" />
      )}
    </div>
  );
};

export default LinkPanel;
