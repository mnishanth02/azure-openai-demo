import { NextRequest, NextResponse } from "next/server";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import { ChatRequestMessage } from "@azure/openai/rest";
import { v4 } from "uuid";

import { env } from "@/env";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("audio") as File;

  console.log("File in server route ->>", file);

  if (file.size === 0) {
    return NextResponse.json({ sender: "", response: "No audio file provided" }, { status: 404 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const audio = new Uint8Array(arrayBuffer);
  const client = new OpenAIClient(env.AZURE_ENDPOINT, new AzureKeyCredential(env.AZURE_API_KEY));

  const result = await client.getAudioTranscription(env.AZURE_DEPLOYMENT_NAME, audio);
  console.log(`Transcription - ${result.text}`);

  //    get chat completion from Azure OpenAI
  const messages: ChatRequestMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant. You will answer questions and reply I cannot answer that if you dont know the answer and try to surfe the answers from internet and make sure its verified",
    },
    {
      role: "user",
      content: result.text,
    },
  ];

  const completions = await client.getChatCompletions(env.AZURE_DEPLOYMENT_COMPLETION_NAME, messages, {
    maxTokens: 128,
  });
  const response = completions.choices[0].message?.content;

  return NextResponse.json({ sender: result.text, response, id: v4().toString() });
}
