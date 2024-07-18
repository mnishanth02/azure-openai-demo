import React, { useEffect, useRef, useState } from "react";
import { AudioLines, Mic, MicOff, Volume2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { TranslationLanguages } from "../../types";

type Props = {
  languages: TranslationLanguages;
  isTranscribeAudioPending: boolean;
  onUploadAudio: (file: File) => void;
};

export const mimeType = "audio/webm";
const TranslateForm = ({ languages, isTranscribeAudioPending, onUploadAudio }: Props) => {
  const {
    formState: { defaultValues },
    getValues,
    watch,
    control,
  } = useFormContext();

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioChunk, setAudioChunk] = useState<Blob[]>([]);
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<"recording" | "inactive">("inactive");

  useEffect(() => {
    getMicrophonePermission();
  }, []);
  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        setPermission(true);
        setStream(streamData);
      } catch (error: any) {
        toast.error(`Microphone - ${error.message}`);
      }
    } else {
      alert("Your browser does not support the MediaRecorder API");
    }
  };

  const handlePlayAudio = async () => {
    const synth = window.speechSynthesis;

    const output = getValues("output");
    if (!output || !synth) return;

    const wordsToSay = new SpeechSynthesisUtterance(output);
    synth.speak(wordsToSay);
  };

  const startRecording = async () => {
    if (stream === null || isTranscribeAudioPending) return;

    setRecordingStatus("recording");

    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localAudioChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;

      localAudioChunks.push(event.data);
    };
    setAudioChunk(localAudioChunks);
  };
  const stopReording = async () => {
    if (mediaRecorder.current === null || isTranscribeAudioPending) return;
    mediaRecorder.current.stop();
    setRecordingStatus("inactive");

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunk, { type: mimeType });
      const file = new File([audioBlob], mimeType, { type: mimeType });
      onUploadAudio(file);
      setAudioChunk([]);
    };
  };

  return (
    <div className="container mx-auto mt-6 max-w-6xl p-2">
      <section className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold">Translation Service</h2>
        <p className="text-lg text-secondary-foreground/60">Translate text between multiple languages with ease.</p>
      </section>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left Section - Input */}
        <div className="flex flex-col gap-2">
          <Controller
            name={"inputLanguage"}
            control={control}
            defaultValue={defaultValues?.inputLanguage}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>want us to figure it out?</SelectLabel>
                    <SelectItem key="auto" value="auto">
                      Auto-Detection
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    {Object.entries(languages.translation).map(([key, value]) => {
                      return (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Card className="col-span-1 min-h-[400px]">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Input</h2>
                {!permission && (
                  <Button variant="outline" size="sm" type="button" onClick={getMicrophonePermission}>
                    <MicOff className="mr-2 h-4 w-4 text-red-500" /> Get Microphone
                  </Button>
                )}
                {permission && recordingStatus === "inactive" && (
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    disabled={isTranscribeAudioPending}
                    onClick={startRecording}
                  >
                    <Mic className="mr-2 h-4 w-4" /> Speak
                  </Button>
                )}
                {recordingStatus === "recording" && (
                  <Button variant="outline" size="sm" type="button" className="bg-red-500" onClick={stopReording}>
                    <AudioLines className="mr-2 h-4 w-4" /> Stop
                  </Button>
                )}
              </div>
              <Controller
                name="input"
                control={control}
                defaultValue={defaultValues?.input}
                render={({ field }) => (
                  <Textarea {...field} placeholder="Enter text to translate..." className="min-h-80 w-full" />
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-start md:justify-end">
            <Controller
              name={"outputLanguage"}
              control={control}
              defaultValue={defaultValues?.outputLanguage}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>want us to figure it out?</SelectLabel>
                      <SelectItem key="auto" value="auto">
                        Auto-Detection
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Languages</SelectLabel>
                      {Object.entries(languages.translation).map(([key, value]) => {
                        return (
                          <SelectItem key={key} value={key}>
                            {value.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Card className="col-span-1 min-h-[400px]">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Translation</h2>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={handlePlayAudio}
                  disabled={!watch("output")}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <Controller
                name="output"
                control={control}
                defaultValue={defaultValues?.input}
                render={({ field }) => (
                  <Textarea {...field} placeholder="Translation will appear here..." className="min-h-80 w-full" />
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TranslateForm;
