import React from "react";

import { LANGUAGE_ENDPOINT } from "@/lib/constants";

import TranslateProvider from "../_lib/components/translate/translate-provider";
import { TranslationLanguages } from "../_lib/types";

const TranslatePage = async () => {
  const response = await fetch(LANGUAGE_ENDPOINT, {
    next: {
      revalidate: 60 * 60 * 24, //  cache for 24 hours
    },
  });
  const languages = (await response.json()) as TranslationLanguages;

  return <TranslateProvider languages={languages} />;
};

export default TranslatePage;
