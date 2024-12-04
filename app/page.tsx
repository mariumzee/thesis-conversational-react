"use client";
import React, { useState } from "react";
import LinkPanel from "./components/LinkPanel";
import ConversationPanel from "./components/ConversationPanel";
import OpenAI from "openai";

const Home: React.FC = () => {
  const [linkeReplies, setLinkReplies] = useState<{ role: string; content: string }[]>([]);
  // const [conversationReplies, setConversationReplies] = useState<{ role: string; content: string }[]>([]);
  const [conversationReplies, setConversationReplies] = useState<{ role: string; content: string }[]>([]);

  const [input, setInput] = useState<string>("");

  const requestLinks = async () => {
    if (!input) return;

    const response = await generateLinkSuggestions(input);
    const conversation = await generateConversationResponse(input);

    setLinkReplies([...linkeReplies, { role: "user", content: input }, { role: "gpt", content: response }]);
    setConversationReplies([...conversationReplies, { role: "user", content: input }, { role: "gpt", content: conversation }]);

    setInput("");
  };


  const generateConversationResponse = async (query: string): Promise<string> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) throw new Error("OpenAI API key is missing");

      const openai = new OpenAI({
        apiKey: apiKey,
        // organization: "Macbook Marium",
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: query }],
      });

      const message = response.choices[0].message?.content || "No response";
      return message;
    } catch (error) {
      console.error("Error generating conversation response:", error);
      return "Sorry, an error occurred. Please try again.";
    }
  };


  const generateLinkSuggestions = async (query: string): Promise<string> => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // or "gpt-4" if accessible
        messages: [{ role: "user", content: `Provide some useful links related to ${query}` }],
      }),
    });

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No choices returned from API");
    }

    return data.choices[0].message.content;
  };
  return (
    <div className="flex flex-col h-screen">
      {/* Top two panels (each 45vh in height) */}
      <div className="flex w-full" style={{ height: "90vh" }}>
        {/* LinkPanel (left) */}
        <div className="w-1/2 bg-blue-100 overflow-y-auto" style={{ height: "90vh" }}>
          <LinkPanel messages={linkeReplies} />
        </div>

        {/* ConversationPanel (right) */}
        <div className="w-1/2 bg-green-100 overflow-y-auto" style={{ height: "90vh" }}>
          <ConversationPanel messages={conversationReplies} />
        </div>
      </div>

      {/* Input and button at the bottom */}
      <div className="w-full bg-blue-100 flex justify-center items-center p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for links..."
          className="border rounded p-2 w-3/4 mr-2"
        />
        <button onClick={requestLinks} className="bg-blue-500 text-white px-4 py-2 rounded">
          Let's go!
        </button>
      </div>
    </div>


  );
};

export default Home;
