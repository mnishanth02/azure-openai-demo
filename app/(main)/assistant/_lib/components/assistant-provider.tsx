"use client";

import React, { FC, useState } from "react";
import { SettingsIcon } from "lucide-react";

import AssistantForm from "./assistant-form";
import Recorder from "./recorder";
import { useAssistantForm } from "./useAssistantForm";
import VoiceSysthesiser from "./voice-synthesiser";

interface AssistantProviderProps {}

const AssistantProvider: FC<AssistantProviderProps> = ({}) => {
  const { isPending, messages, message, onUploadAudio } = useAssistantForm();
  const [displaySettings, setDisplaySettings] = useState(false);
  return (
    <div className="mx-auto mb-5 flex h-[calc(88vh)] max-w-4xl flex-col bg-secondary">
      <div className="self-end px-5 pt-4">
        <SettingsIcon
          onClick={() => setDisplaySettings(!displaySettings)}
          className="cursor-pointer text-secondary-foreground/50 hover:text-secondary-foreground dark:hover:text-accent-foreground"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <AssistantForm messages={messages} isPending={isPending} />
      </div>
      <div className="fixed bottom-0 left-1/2 mb-10 flex w-full -translate-x-1/2 flex-col items-center justify-center backdrop-blur-md transition-all">
        <Recorder onUploadAudio={onUploadAudio} isPending={isPending} />
        <VoiceSysthesiser displaySettings={displaySettings} state={message} />
      </div>
    </div>
  );
};

export default AssistantProvider;
