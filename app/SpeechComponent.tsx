import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import MicNoneIcon from "@mui/icons-material/MicNone";

const SpeechComponent: React.FC<{
  onTranscript: (transcript: string) => void;
}> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition =
      (typeof window !== "undefined" && (window as any).SpeechRecognition) ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported by your browser.");
      return;
    }

    const localRecognition = new SpeechRecognition();
    localRecognition.continuous = false;
    localRecognition.interimResults = false;
    localRecognition.lang = "en-US";

    localRecognition.onresult = (event: {
      results: { transcript: any }[][];
    }) => {
      const speechToText = event.results[0][0].transcript;
      onTranscript(speechToText);
      setIsListening(false); // Stop listening after speech is recognized
    };

    localRecognition.onerror = (event: { error: any }) => {
      console.error("Speech Recognition Error: ", event.error);
      setIsListening(false); // Update listening state on error
    };

    localRecognition.onstart = () => {
      setIsListening(true); // Update state to reflect that recognition has started
    };

    localRecognition.onend = () => {
      setIsListening(false); // Update state when recognition ends
    };

    setRecognition(localRecognition);

    return () => {
      localRecognition.stop();
    };
  }, []);

  const startRecognition = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  return (
    <Button
      onClick={startRecognition}
      style={{
        padding: "6px",
        backgroundColor: isListening ? "#f44336" : "#320064",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      startIcon={<MicNoneIcon />}
    >
      {isListening ? "Stop" : "Start"}
    </Button>
  );
};

export default SpeechComponent;
