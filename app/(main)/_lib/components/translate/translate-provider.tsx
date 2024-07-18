"use client";

import React, { FC } from "react";
import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { TranslationLanguages } from "../../types";
import TranslateForm from "./translate-form";
import { useTranslateForm } from "./useTranslateForm";

interface TranslateProviderProps {
  languages: TranslationLanguages;
}

const TranslateProvider: FC<TranslateProviderProps> = ({ languages }) => {
  const { methods, onHandleSubmit, isTranscribeAudioPending, isTranslatePending, onUploadAudio } = useTranslateForm();

  const handleReset = () => {
    methods.reset({ input: "", output: "", inputLanguage: "auto", outputLanguage: "es" }, {});
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={onHandleSubmit} className="flex flex-col">
        <TranslateForm
          languages={languages}
          isTranscribeAudioPending={isTranscribeAudioPending}
          onUploadAudio={onUploadAudio}
        />
        <div className="flex items-center justify-center gap-2">
          <Button type="submit" disabled={isTranslatePending} className="mt-5 flex w-32 self-center">
            {isTranslatePending ? "Translating..." : "Translate"}
          </Button>
          <Button type="button" variant={"outline"} className="mt-5 flex w-32 self-center" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default TranslateProvider;
