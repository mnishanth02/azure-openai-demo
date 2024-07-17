"use server";

import axios from "axios";
import { v4 } from "uuid";

import { env } from "@/env";
import { TranslateFormType } from "../../schema";

const key = env.AZURE_TEXT_TRANSLATION_KEY;
const endpoint = env.AZURE_TEXT_TRANSLATION;
const location = env.AZURE_TEXT_LOCATION;

export async function translate(formData: TranslateFormType) {
  // console.log("same endpoint ->", endpoint);

  const response = await axios.post("endpotn", formData, {
    baseURL: "as",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      // location required if you're using a multi-service or regional (not global) resource.
      "Ocp-Apim-Subscription-Region": location,
      "Content-type": "application/json",
      "X-ClientTraceId": v4().toString(),
    },
    params: {
      "api-version": "3.0",
      from: "en",
      to: "fr,zu",
    },
  });

  return formData;
}
