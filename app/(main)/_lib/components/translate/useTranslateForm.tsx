"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { TranslateFormSchema, TranslateFormType } from "../../schema";
import { useTranslate } from "./useTranslate";

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

  const { mutate, isPending } = useTranslate();

  const onSubmit = (values: TranslateFormType) => {
    mutate(values, {
      onSuccess: (data) => {
        // onClose();
      },
    });
    // console.log(values);
  };

  const onHandleSubmit = methods.handleSubmit(onSubmit);

  return {
    methods,
    onHandleSubmit,
    isPending,
  };
};
