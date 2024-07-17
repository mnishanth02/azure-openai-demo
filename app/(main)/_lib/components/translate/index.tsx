"use client";

import React, { useState } from "react";
import { Loader2, Mic } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const TranslateUi: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    // Simulating API call for translation
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTranslatedText(`Translated: ${inputText}`);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleVoiceInput = async () => {
    setIsRecording(true);
    // Simulating voice recording and translation
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const simulatedVoiceInput = "This is a voice input simulation.";
      setInputText(simulatedVoiceInput);
      setTranslatedText(`Translated: ${simulatedVoiceInput}`);
    } catch (error) {
      console.error("Voice input error:", error);
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left Section - Input */}
        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Input</h2>
              <Button variant="outline" size="icon" onClick={handleVoiceInput} disabled={isRecording}>
                {isRecording ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            <Textarea
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={handleTextInput}
              className="mb-2 h-40 w-full"
            />
            <Button onClick={handleTranslate} disabled={isTranslating || !inputText.trim()} className="w-full">
              {isTranslating ? "Translating..." : "Translate"}
            </Button>
          </CardContent>
        </Card>

        {/* Right Section - Output */}
        <Card className="col-span-1">
          <CardContent className="p-4">
            <h2 className="mb-2 text-lg font-semibold">Translation</h2>
            <Textarea
              value={translatedText}
              readOnly
              className="h-40 w-full"
              placeholder="Translation will appear here..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TranslateUi;
