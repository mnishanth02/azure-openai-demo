"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export type MessageT = {
  sender: string;
  response: string;
  id: string;
};
const transcript = async (file: Blob) => {
  const formData = new FormData();
  formData.append("audio", file);

  const response = await fetch("/api/transcript", {
    method: "POST",
    body: formData,
  });

  return await response.json();
};

export const useAssistantForm = () => {
  const [messages, setMessages] = useState<MessageT[]>([]);
  const [message, setMessage] = useState<MessageT>();

  const { mutate: transcriptMutate, isPending } = useMutation<MessageT, Error, Blob>({
    mutationFn: transcript,
  });

  const onUploadAudio = (file: Blob) => {
    console.log("File from uploadAudio >", file);

    transcriptMutate(file, {
      onSuccess: (data) => {
        console.log("Data in success->", data.response);
        setMessage(data);
        setMessages((prevMsg) => [
          ...prevMsg,
          {
            id: data.id,
            response: data.response,
            sender: data.sender,
          },
        ]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return {
    isPending,
    onUploadAudio,
    messages,
    message,
  };
};
