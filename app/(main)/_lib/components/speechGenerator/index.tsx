"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const TextToSpeechUI: React.FC = () => {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleGenerateSpeech = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);

    try {
      // This is a placeholder. Replace with actual API call to your text-to-speech service.
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulating an audio file URL returned from the API
      // In a real scenario, this would be the URL to the generated audio file
      const fakeAudioUrl = "https://example.com/generated-speech.mp3";
      setAudioUrl(fakeAudioUrl);
    } catch (error) {
      console.error("Error generating speech:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Text-to-Speech Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your text here"
            value={text}
            onChange={handleTextChange}
            rows={5}
            className="w-full"
          />
          <Button onClick={handleGenerateSpeech} disabled={isGenerating || !text.trim()} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Speech...
              </>
            ) : (
              "Generate Speech"
            )}
          </Button>
        </CardContent>
      </Card>

      {audioUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Speech</CardTitle>
          </CardHeader>
          <CardContent>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextToSpeechUI;
