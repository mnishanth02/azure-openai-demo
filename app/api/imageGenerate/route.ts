import { NextRequest, NextResponse } from "next/server";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

import { env } from "@/env";

export async function POST(request: NextRequest) {
  const prompt = await request.json();

  if (!prompt) {
    NextResponse.json({ error: "Please provide a prompt" }, { status: 400 });
  }

  const size = "1024x1024";

  const n = 1;

  const client = new OpenAIClient(env.AZURE_ENDPOINT_EUS, new AzureKeyCredential(env.AZURE_API_KEY_EUS));
  const results = await client.getImages(env.AZURE_DEPLOYMENT_NAME_IMAGE, prompt, { n, size });

  const images = results.data.map((img) => img.url);
  console.log("Images->>", images);

  return NextResponse.json({ response: images }, { status: 200 });
}
