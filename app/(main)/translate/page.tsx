import { LANGUAGE_ENDPOINT, languages } from "@/lib/constants";

import { TranslationLanguages } from "../_lib/types";
import TranslateProvider from "./_lib/components/translate-provider";

const TranslatePage = () => {
  // const response = await fetch(LANGUAGE_ENDPOINT, {
  //   next: {
  //     revalidate: 60 * 60 * 24, //  cache for 24 hours
  //   },
  // });
  // const languages = (await response.json()) as TranslationLanguages;

  return <TranslateProvider languages={languages as TranslationLanguages} />;
};

export default TranslatePage;
