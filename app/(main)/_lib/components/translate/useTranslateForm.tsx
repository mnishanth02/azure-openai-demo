"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { TranslateFormSchema, TranslateFormType } from "../../schema";
import { translate } from "./translate-action";

const transcribeAudio = async (file: Blob) => {
  const formData = new FormData();
  formData.append("audio", file);

  const response = await fetch("/api/transcribeAudio", {
    method: "POST",
    body: formData,
  });

  return await response.json();
  // return "testing 1234";
};

export const useTranslateForm = () => {
  const methods = useForm<TranslateFormType>({
    resolver: zodResolver(TranslateFormSchema),
    defaultValues: {
      input: "",
      inputLanguage: "auto",
      outputLanguage: "es",
      output: "",
    },
    mode: "onChange",
  });

  const { mutate, isPending: isTranslatePending } = useMutation<any, Error, TranslateFormType>({
    mutationFn: translate,
  });
  const { mutate: transcribeAudioMutate, isPending: isTranscribeAudioPending } = useMutation<any, Error, Blob>({
    mutationFn: transcribeAudio,
  });

  const onSubmit = (values: TranslateFormType) => {
    mutate(values, {
      onSuccess: (data) => {
        methods.setValue("output", data.output, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      },
      onError: (data) => {
        toast.error(data.message);
      },
    });
  };
  const onUploadAudio = (file: Blob) => {
    transcribeAudioMutate(file, {
      onSuccess: (data) => {
        console.log("Data in success->", data);
        if (data?.text) {
          methods.setValue("input", data.text);
        }

        // toast.success("Transcribed");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const onHandleSubmit = methods.handleSubmit(onSubmit);

  return {
    methods,
    onHandleSubmit,
    isTranslatePending,
    onUploadAudio,
    isTranscribeAudioPending,
  };
};
