"use client";

import React, { useState } from "react";
import { Loader2, Mic } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const VoiceRecognitionUI: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState("");
  const [translationResult, setTranslationResult] = useState("");

  const startRecording = (mode: "transcription" | "translation") => {
    setIsRecording(true);

    // Simulating audio recording and API call
    setTimeout(() => {
      setIsRecording(false);
      if (mode === "transcription") {
        setTranscriptionResult("This is a simulated transcription of your voice input.");
      } else {
        setTranslationResult("This is a simulated translation of your voice input.");
      }
    }, 3000);

    // In a real application, you would:
    // 1. Start recording audio from the microphone
    // 2. Send the audio data to your API
    // 3. Receive and display the response
  };

  const RecordButton: React.FC<{ mode: "transcription" | "translation" }> = ({ mode }) => (
    <Button onClick={() => startRecording(mode)} disabled={isRecording} className="h-32 w-32 rounded-full">
      {isRecording ? <Loader2 className="h-16 w-16 animate-spin" /> : <Mic className="h-16 w-16" />}
    </Button>
  );

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="transcription">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transcription">Audio Transcription</TabsTrigger>
          <TabsTrigger value="translation">Audio Translation</TabsTrigger>
        </TabsList>

        <TabsContent value="transcription">
          <Card>
            <CardHeader>
              <CardTitle>Voice Recognition with Audio Transcription</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <RecordButton mode="transcription" />
              <p>Click the microphone to start recording</p>
              <Textarea
                placeholder="Transcription will appear here..."
                value={transcriptionResult}
                readOnly
                className="h-32 w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="translation">
          <Card>
            <CardHeader>
              <CardTitle>Voice Recognition with Audio Translation</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <RecordButton mode="translation" />
              <p>Click the microphone to start recording</p>
              <Textarea
                placeholder="Translation will appear here..."
                value={translationResult}
                readOnly
                className="h-32 w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VoiceRecognitionUI;
