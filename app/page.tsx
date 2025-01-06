"use client"; // This is a client component 👈🏽

import React, { useState } from "react";
import LinkPanel from "./components/LinkPanel";
import ConversationPanel from "./components/ConversationPanel";
import OpenAI from "openai";
import MicNoneIcon from "@mui/icons-material/MicNone";


const Home: React.FC = () => {
  const [linkChat, setLinkChat] = useState<{ role: string; content: string }[]>([]);
  const [conversationChat, setConversationChat] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  const startChat = async () => {
    if (!input) return;
    setIsLoading(true);
    setLinkChat(prev => [...prev, { role: "user", content: input }]);
    setConversationChat(prev => [...prev, { role: "user", content: input }]);

    try {
      const baseResponse = await fetchBaseResponse(input);
      const { linkSuggestions, conversationResponse } = parseResponse(baseResponse);

      setLinkChat(prev => [...prev, { role: "gpt", content: linkSuggestions }]);
      setConversationChat(prev => [...prev, { role: "gpt", content: conversationResponse }]);
      setInput("");
    } catch (error) {
      console.error("Error during request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBaseResponse = async (query: string): Promise<string> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) throw new Error("OpenAI API key is missing");

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Please provide a detailed response containing both contextual conversation and a list of relevant links for the topic: "${query}".`,
          },
        ],
      });

      return response.choices[0].message?.content || "No response";
    } catch (error) {
      console.error("Error fetching base response:", error);
      return "Sorry, an error occurred. Please try again.";
    }
  };

  const parseResponse = (response: string): { linkSuggestions: string, conversationResponse: string } => {
    const linkRegex = /https?:\/\/\S+/gi;
    const links = response.match(linkRegex) || [];
    const linkSuggestions = links.join("\n");
    const conversationResponse = response.replace(linkRegex, '').trim();

    return { linkSuggestions, conversationResponse };
  };


  return (
    <div className="flex flex-col h-screen">
      <div className="flex w-full" style={{ height: "90vh" }}>
        {/* Link Panel */}
        <div className="w-1/2 bg-blue-100 overflow-y-auto" style={{ height: "90vh" }}>
          <LinkPanel messages={linkChat} loading={isLoading} />
        </div>

        {/* Conversation Panel */}
        <div className="w-1/2 bg-green-100 overflow-y-auto" style={{ height: "90vh" }}>
          <ConversationPanel messages={conversationChat} loading={isLoading} />
        </div>
      </div>

      {/* Input and Button */}
      <div className="w-full bg-blue-100 flex justify-center items-center p-4 space-x-4">


        {/* Input Field */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything"
          className="border rounded p-2 w-3/4 text-black"
          disabled={isLoading} // Disable input while loading
        />

        {/* Search Button */}
        <button
          onClick={startChat}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Search"}
        </button>
      </div>
    </div>
  );
};

export default Home;
