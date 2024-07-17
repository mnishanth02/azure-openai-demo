"use server";

import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import axios from "axios";
import { v4 } from "uuid";

import { env } from "@/env";
import { TranslateFormType } from "../../schema";

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

export async function transcribeAudio(file: Blob) {
  console.log("File->><", file);

  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const audio = new Uint8Array(arrayBuffer);

  // const client = new OpenAIClient(env.AZURE_ENDPOINT, new AzureKeyCredential(env.AZURE_API_KEY));

  // const result = await client.getAudioTranscription(env.AZURE_DEPLOYMENT_NAME, audio);
  // console.log(`Transcription - ${result.text}`);

  // return { text: result.text };
  return { text: "Testing Success" };
}
