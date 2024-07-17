import React, { useState } from "react";
import { Loader2, Mic } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

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

import { TranslateFormType } from "../../schema";
import { TranslationLanguages } from "../../types";

type Props = {
  languages: TranslationLanguages;
};
const TranslateForm = ({ languages }: Props) => {
  const {
    control,
    formState: { errors, defaultValues },
  } = useFormContext<TranslateFormType>();

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
    <div className="container mx-auto mt-6 max-w-6xl p-2">
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
                <Button variant="outline" size="icon" type="button" onClick={handleVoiceInput} disabled={isRecording}>
                  {isRecording ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Controller
                name="input"
                control={control}
                defaultValue={defaultValues?.input}
                render={({ field }) => (
                  <Textarea {...field} placeholder="Enter text to translate..." className="min-h-80 w-full" />
                )}
              />
              {/* <Textarea
                placeholder="Enter text to translate..."
                value={inputText}
                onChange={handleTextInput}
                className="mb-2 min-h-64 w-full"
              /> */}
              {/* <Button onClick={handleTranslate} disabled={isTranslating || !inputText.trim()} className="mt-5 w-full">
                {isTranslating ? "Translating..." : "Translate"}
              </Button> */}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
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

          {/* Right Section - Output */}
          <Card className="col-span-1 min-h-[400px]">
            <CardContent className="p-4">
              <h2 className="mb-3 text-lg font-semibold">Translation</h2>
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
