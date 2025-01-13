"use client";
import React, { useState, useEffect } from "react";
import LinkPanel from "./components/LinkPanel";
import ConversationPanel from "./components/ConversationPanel";
import OpenAI from "openai";
import MicNoneIcon from "@mui/icons-material/MicNone";


const Home: React.FC = () => {
  const [conversationChat, setConversationChat] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Try to get the SpeechRecognition object, handling browsers that may not support it
  const SpeechRecognition = (typeof window !== "undefined") && (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  // Initialize SpeechRecognition if available
  const recognition = new SpeechRecognition();
  recognition.continuous = false; // Stops after recognizing speech
  recognition.interimResults = false; // Only final result is returned
  recognition.lang = "en-US"; // Set language

  useEffect(() => {
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
    }
  }, []);

  // Start speech recognition
  const startRecognition = () => {
    recognition.start();
  };

  // Event listener when speech is recognized
  recognition.onresult = (event: any) => {
    const speechToText = event.results[0][0].transcript;
    setInput(speechToText); // Update input field with recognized text
  };

  // Handle errors
  recognition.onerror = (event: any) => {
    console.error("Speech recognition error", event.error);
  };

  useEffect(() => {
    const initialInstruction = {
      role: "system",
      content: `For each and every message in our chat, 
      you have to give a good response containing contextual 
      the topics we discuss. Your response should contain two sections i.e, section-1 and section-2. 
      In section-1, you should only give textual answer explanation and in section-2 
      you should give the relevant links.
      the response in Section-2 should be written as a JSON object/Python dictionary, 
      where the key of the dictionary is
      the title of the url link and value of the dictionary is the http link itself.`
    };
    setConversationChat([initialInstruction]);
  }, []);

  const startChat = async () => {
    if (!input) return;
    setIsLoading(true);

    try {
      const updatedConversationChat = [...conversationChat, { role: "user", content: input }];
      setConversationChat(updatedConversationChat);

      const response = await fetchBaseResponse(updatedConversationChat);
      updateChats(response);
    } catch (error) {
      console.error("Error during request:", error);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const fetchBaseResponse = async (chatHistory: any[]): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) throw new Error("OpenAI API key is missing");

    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatHistory,
    });

    return response.choices[0].message?.content || "No response";
  };

  const updateChats = (response: string) => {

    setConversationChat(prev => [
      ...prev,
      { role: "assistant", content: response }
    ]);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex w-full" style={{ height: "90vh" }}>
        <div className="w-1/2 bg-blue-100 overflow-y-auto">
          <LinkPanel messages={conversationChat} loading={isLoading} />
        </div>
        <div className="w-1/2 bg-green-100 overflow-y-auto">
          <ConversationPanel messages={conversationChat} loading={isLoading} />
        </div>
      </div>
      <div className="w-full bg-[#2f2f2f] flex justify-center items-center p-4 space-x-4">
        {/* Mic Button */}
        <button
          onClick={startRecognition}
          style={{
            padding: "10px",
            backgroundColor: "#320064",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <MicNoneIcon />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={!isLoading ? "" : "Ask anything"}
          className={`bg-[#2f2f2f] border border-gray-700 focus:border-[#b787f2] rounded p-2 w-3/4 text-white focus:outline-none ${isLoading ? 'cursor-not-allowed' : 'cursor-text'}`}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading) {
              e.preventDefault(); // Prevent the default action of the enter key
              startChat();
            }
          }}
        />


        <button
          onClick={startChat}
          className={`bg-[#320064] text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3a0078] cursor-pointer'}`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Search"}
        </button>

      </div>
    </div>
  );
};

export default Home;
