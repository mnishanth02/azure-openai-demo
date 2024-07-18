import { NextRequest, NextResponse } from "next/server";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

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

  return NextResponse.json({ text: result.text });
}
