"use server";

import axios from "axios";
import { v4 } from "uuid";

import { TranslateFormType } from "@/app/(main)/_lib/schema";

import { env } from "@/env";

const key = env.AZURE_TEXT_TRANSLATION_KEY;
const endpoint = env.AZURE_TEXT_TRANSLATION;
const location = env.AZURE_TEXT_LOCATION;

export async function translate(formData: TranslateFormType) {
  const response = await axios({
    baseURL: endpoint,
    url: "/translate",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Ocp-Apim-Subscription-Region": location,
      "Content-type": "application/json",
      "X-ClientTraceId": v4().toString(),
    },
    params: {
      "api-version": "3.0",
      from: formData.inputLanguage === "auto" ? null : formData.inputLanguage,
      to: formData.outputLanguage,
    },
    data: [
      {
        text: formData.input,
      },
    ],
    responseType: "json",
  });

  const data = response.data;
  if (data.error) {
    console.log(`Error ${data.error.code}: ${data.error.message}`);
  }

  return {
    output: data[0].translations[0].text,
  };
}
