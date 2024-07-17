"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { TranslateFormSchema, TranslateFormType } from "../../schema";
import { transcribeAudio, translate } from "./translate-action";

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

  const { mutate, isPending } = useMutation<any, Error, TranslateFormType>({
    mutationFn: translate,
  });
  const { mutate: transcribeAudioMutate, isPending: transcribeAudioPending } = useMutation<any, Error, Blob>({
    mutationFn: transcribeAudio,
  });

  const onSubmit = (values: TranslateFormType) => {
    mutate(values, {
      onSuccess: (data) => {
        methods.setValue("output", data.output);
      },
    });
  };
  const onUploadAudio = (file: Blob) => {
    console.log("INtial File->>", file);

    transcribeAudioMutate(file, {
      onSuccess: (data) => {
        console.log("Data in success->", data);

        toast.success("Transcribed");
        // methods.setValue("output", data?.text); // validate the data.text
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
    isPending,
    onUploadAudio,
  };
};
