"use client";
import React, { useState, useEffect } from "react";
import LinkPanel from "./components/LinkPanel";
import ConversationPanel from "./components/ConversationPanel";
import OpenAI from "openai";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SpeechComponent from "./SpeechComponent";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
import { GoogleAnalytics } from "@next/third-parties/google";

const TRACKING_ID_GA = "G-6RB1RCRXHR";
ReactGA.initialize(TRACKING_ID_GA);

const Home: React.FC = () => {
  const [conversationChat, setConversationChat] = useState<
    { role: string; content: string }[]
  >([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(true); // State to control the dialog visibility
  const [isChecked, setIsChecked] = useState(false);

  const handleAgree = () => {
    if (isChecked) {
      setOpenDialog(false);
    }
  };

  const handleCheck = (event: any) => {
    setIsChecked(event.target.checked);
  };
  useEffect(() => {
    const initialInstruction = {
      role: "system",
      content: `For each and every message, 
      you have to give a detailed response. Your response should contain two sections i.e, section-1 and section-2. 
      In section-1, you should only give textual answer explanation and in section-2 
      you should give more than 5 relevant working links.
      the response in Section-2 should be written as a JSON object/Python dictionary, 
      where the key of the dictionary is
      the title of the url link and value of the dictionary is the http link itself.`,
    };
    setConversationChat([initialInstruction]);
  }, []);

  const startChat = async () => {
    if (!input) return;
    setIsLoading(true);

    try {
      const updatedConversationChat = [
        ...conversationChat,
        { role: "user", content: input },
      ];
      setConversationChat(updatedConversationChat);

      const response = await fetchBaseResponse(updatedConversationChat);
      console.log("=========base response========", response);
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
      model: "gpt-4o",
      messages: chatHistory,
    });

    return response.choices[0].message?.content || "No response";
  };

  const updateChats = (response: string) => {
    setConversationChat((prev) => [
      ...prev,
      { role: "assistant", content: response },
    ]);
  };
  const buttonStyle = {
    color: "white",
    borderColor: "white",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "4px",
  };

  const enabledStyle = {
    ...buttonStyle,
    cursor: "pointer", // Cursor is a pointer when the button is enabled
  };

  const disabledStyle = {
    ...buttonStyle,
    cursor: "not-allowed", // Cursor shows not-allowed when the button is disabled
    opacity: "0.5", // Optional: Decrease the opacity for visual feedback
  };

  return (
    <>
      <GoogleAnalytics gaId="G-6RB1RCRXHR" />

      <div className="flex flex-col h-screen">
        <div className="flex w-full" style={{ height: "90vh" }}>
          <div className="w-1/2 bg-blue-100 overflow-y-auto">
            <LinkPanel messages={conversationChat} loading={isLoading} />
          </div>
          <div className="w-1/2 bg-green-100 overflow-y-auto">
            <ConversationPanel
              messages={conversationChat}
              loading={isLoading}
            />
          </div>
        </div>
        <div className="w-full bg-[#2f2f2f] flex justify-center items-center p-4 space-x-4">
          {/* <SpeechComponent
            onTranscript={(transcript) => setInput(transcript)}
          /> */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={!isLoading ? "" : "Ask anything"}
            className={`bg-[#2f2f2f] border border-gray-700 focus:border-[#b787f2] rounded p-2 w-3/4 text-white focus:outline-none ${
              isLoading ? "cursor-not-allowed" : "cursor-text"
            }`}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                e.preventDefault(); // Prevent the default action of the enter key
                startChat();
              }
            }}
          />

          <button
            onClick={startChat}
            className={`bg-[#320064] text-white px-4 py-2 rounded ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#3a0078] cursor-pointer"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Search"}
          </button>

          <Dialog open={openDialog}>
            <DialogTitle style={{ backgroundColor: "#2f2f2f", color: "white" }}>
              <strong>
                Consent to Participate in Research: "User Satisfaction &
                Efficiency in Conversational vs. Traditional Search Engines"
              </strong>
            </DialogTitle>
            <DialogContent style={{ backgroundColor: "#2f2f2f" }}>
              <DialogContentText style={{ color: "white" }}>
                Your involvement will contribute valuable data that could
                influence future designs of search engines, potentially
                enhancing user interactions and satisfaction in digital
                environments. Our research team follows strict protocols to
                ensure ethical conduct, privacy protection, and consistent data
                collection across all observations.
                <br />
                <br />
                <strong>Purpose of the Study:</strong>
                This research seeks to explore the differences in user
                satisfaction and efficiency between conversational search
                engines and traditional search methods. The findings will help
                improve understanding of how search engine design can affect
                user experience.
                <br />
                <br />
                <strong>Nature of Involvement:</strong>
                As a participant in this study, you will be asked to interact
                with both conversational and traditional search interfaces and
                complete tasks that measure your efficiency and satisfaction.
                Each session is expected to last approximately 30 minutes
                maximum.
                <br />
                <br />
                <strong>Confidentiality:</strong>
                The confidentiality of your participation will be strictly
                maintained. We only require your age and occupational
                background. Pseudonyms will be used in any publications or
                presentations that result from this study to ensure that you
                cannot be identified.
                <br />
                <br />
                <strong>Additional Observations:</strong>
                In addition to standard data collection, we will record
                non-verbal cues such as signs of confusion, frustration, or
                engagement, and note any unusual behaviors during the study.
                These observations will help us gain insights into natural user
                responses without interrupting the thought process.
                <br />
                <br />
                <strong>Data Retention and Destruction:</strong>
                Upon completion of the research, all data will be securely
                archived or destroyed in accordance with institutional data
                retention policies. We are committed to maintaining data
                integrity and will ensure that all information is handled
                responsibly.
                <br />
                <br />
              </DialogContentText>
            </DialogContent>
            <DialogActions style={{ backgroundColor: "#2f2f2f" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    style={{ color: "white" }}
                    checked={isChecked}
                    onChange={handleCheck}
                  />
                }
                label="I agree to participate"
                style={{ color: "white" }}
              />
              <Button
                onClick={(e) => {
                  if (!isChecked) {
                    e.preventDefault(); // Prevent any click action
                    return; // Exit without doing anything
                  }
                  handleAgree(); // Only call handleAgree if isChecked is true
                }}
                color="primary"
                style={isChecked ? enabledStyle : disabledStyle}
              >
                Let's go!
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Home;
