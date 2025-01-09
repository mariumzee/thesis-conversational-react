"use client"; // This is a client component 👈🏽

import React, { useState } from "react";
import LinkPanel from "./components/LinkPanel";
import ConversationPanel from "./components/ConversationPanel";
import OpenAI from "openai";
import MicNoneIcon from "@mui/icons-material/MicNone";

const Home: React.FC = () => {
  const [linkChat, setLinkChat] = useState<{ role: string; content: any }[]>([]);
  const [conversationChat, setConversationChat] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  const startChat = async () => {
    if (!input) return;
    setIsLoading(true);

    try {
      // Append the user's input to both chat panels
      setLinkChat(prev => [...prev, { role: "user", content: input }]);
      setConversationChat(prev => [...prev, { role: "user", content: input }]);

      // Fetch the response from OpenAI
      const baseResponse = await fetchBaseResponse(input);

      // Parse the response into link suggestions and conversation response
      const { linkSuggestions, conversationResponse } = parseResponse(baseResponse);

      // Update chat with parsed data
      updateChats(linkSuggestions, conversationResponse);
    } catch (error) {
      console.error("Error during request:", error);
    } finally {
      setIsLoading(false);
      setInput(""); // Clear input after processing is done
    }
  };

  const updateChats = (links: any[], conversation: string) => {
    setLinkChat(prev => [
      ...prev,
      { role: "gpt", content: links } // Links are passed as content
    ]);
    setConversationChat(prev => [
      ...prev,
      { role: "gpt", content: conversation }
    ]);
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
            content: `
            Provide a detailed response containing contextual details about topic
            "${query}" first. And then, provide some related links to "${query}" with
            title as "Title:" and URL as "URL:". Please avoid writing extra text or styling, just provide links directly without mentioning "here 
            are links" or similar guidance in your response.`,
          },
        ],
      });

      return response.choices[0].message?.content || "No response";
    } catch (error) {
      console.error("Error fetching base response:", error);
      return "Sorry, an error occurred. Please try again.";
    }
  };

  const parseResponse = (response: string): { linkSuggestions: any[], conversationResponse: string } => {
    // Regular expression to match titles followed by URLs
    const linkRegex = /Title: (.+?)\nURL: (https?:\/\/\S+)/gi;

    let match;
    const links = [];

    // Loop through each match to extract titles and URLs
    while ((match = linkRegex.exec(response)) !== null) {
      // Create an object for each link with title and URL
      const linkObject = { title: match[1], URL: match[2] };
      links.push(linkObject);
    }

    console.log("Links Extracted:", links);

    // Remove the matched title and URL lines from the response
    const conversationResponse = response.replace(linkRegex, '').trim();

    return { linkSuggestions: links, conversationResponse };
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
      <div className="w-full bg-[#2f2f2f] flex justify-center items-center p-4 space-x-4">
        {/* Input Field */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything"
          className="border bg-[#2f2f2f] rounded p-2 w-3/4 text-white"
          disabled={isLoading} // Disable input while loading
        />

        {/* Search Button */}
        <button
          onClick={startChat}
          className="bg-[#320064] text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Search"}
        </button>
      </div>
    </div>
  );
};

export default Home;
