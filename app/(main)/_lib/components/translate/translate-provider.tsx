"use client";

import React, { FC, ReactNode } from "react";
import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { TranslationLanguages } from "../../types";
import TranslateForm from "./translate-form";
import { useTranslateForm } from "./useTranslateForm";

interface TranslateProviderProps {
  //   children: ReactNode;
  languages: TranslationLanguages;
}

const TranslateProvider: FC<TranslateProviderProps> = ({ languages }) => {
  const { methods, onHandleSubmit, isPending } = useTranslateForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={onHandleSubmit} className="flex flex-col">
        {/* {children} */}
        <TranslateForm languages={languages} />
        <Button type="submit" disabled={isPending} className="mt-5 flex w-36 self-center">
          {isPending ? "Translating..." : "Translate"}
        </Button>
      </form>
    </FormProvider>
  );
};

export default TranslateProvider;
