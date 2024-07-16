"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AudioFormData {
  audioFile: FileList;
}

interface AudioProcessingUIProps {
  onTranscriptionSubmit: (file: File) => Promise<string>;
  onTranslationSubmit: (file: File) => Promise<string>;
}

const AudioProcessingForm: React.FC<{
  onSubmit: SubmitHandler<AudioFormData>;
  isProcessing: boolean;
  buttonText: string;
}> = ({ onSubmit, isProcessing, buttonText }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AudioFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input type="file" {...register("audioFile", { required: "Audio file is required" })} accept="audio/*" />
      {errors.audioFile && <p className="text-red-500">{errors.audioFile.message}</p>}
      <Button type="submit" disabled={isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
};

const AudioProcessingUI: React.FC<AudioProcessingUIProps> = ({ onTranscriptionSubmit, onTranslationSubmit }) => {
  const [transcriptionResult, setTranscriptionResult] = React.useState<string>("");
  const [translationResult, setTranslationResult] = React.useState<string>("");
  const [isTranscribing, setIsTranscribing] = React.useState<boolean>(false);
  const [isTranslating, setIsTranslating] = React.useState<boolean>(false);

  const handleTranscriptionSubmit: SubmitHandler<AudioFormData> = async (data) => {
    setIsTranscribing(true);
    try {
      const result = await onTranscriptionSubmit(data.audioFile[0]);
      setTranscriptionResult(result);
    } catch (error) {
      console.error("Transcription error:", error);
      setTranscriptionResult("Error occurred during transcription");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleTranslationSubmit: SubmitHandler<AudioFormData> = async (data) => {
    setIsTranslating(true);
    try {
      const result = await onTranslationSubmit(data.audioFile[0]);
      setTranslationResult(result);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslationResult("Error occurred during translation");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Tabs defaultValue="transcription" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="transcription">Transcription</TabsTrigger>
        <TabsTrigger value="translation">Translation</TabsTrigger>
      </TabsList>
      <TabsContent value="transcription">
        <Card>
          <CardContent className="space-y-4 pt-4">
            <AudioProcessingForm
              onSubmit={handleTranscriptionSubmit}
              isProcessing={isTranscribing}
              buttonText="Transcribe Audio"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Transcription Result:</h3>
              <p>{transcriptionResult || "No transcription yet"}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="translation">
        <Card>
          <CardContent className="space-y-4 pt-4">
            <AudioProcessingForm
              onSubmit={handleTranslationSubmit}
              isProcessing={isTranslating}
              buttonText="Translate Audio"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Translation Result:</h3>
              <p>{translationResult || "No translation yet"}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AudioProcessingUI;
