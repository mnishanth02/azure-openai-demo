import { NextRequest, NextResponse } from "next/server";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import { ChatRequestMessage } from "@azure/openai/rest";
import { v4 } from "uuid";

import { db } from "@/db/db";
import { MockInterview } from "@/db/schema";
import { env } from "@/env";

export async function POST(request: NextRequest) {
  const prompt = await request.json();

  console.log("Prompt->", prompt);

  if (!prompt) {
    return NextResponse.json({ error: "Please provide a prompt" }, { status: 400 });
  }

  const client = new OpenAIClient(env.AZURE_ENDPOINT, new AzureKeyCredential(env.AZURE_API_KEY));

  //    get chat completion from Azure OpenAI
  const messages: ChatRequestMessage[] = [
    {
      role: "system",
      content:
        "You are an AI Technical Interview panel assistant ask questions based on user's applying Role, Job Description, and experence",
    },
    {
      role: "user",
      content: `Job Position: ${prompt.role}. Job Description: ${prompt.description}. Experence: ${prompt.experence}. Depends on this information please give us 2 interview question with answer. Give me details in this format, array of object {"Question" : string; "Answer": string} in the JSON format and  no additional content`,
    },
  ];

  const completions = await client.getChatCompletions(env.AZURE_DEPLOYMENT_COMPLETION_NAME, messages, {
    maxTokens: 500,
  });

  const response = completions.choices[0].message?.content as string;
  console.log("mockJsonResponse->", response);

  const mockJsonResponse = response.replace("```json", "").replace("```", "");

  //    insert interview question to DB
  if (!mockJsonResponse) {
    return NextResponse.json({ error: "Error While creating resposne from AI" }, { status: 500 });
  }

  const [dbResponse] = await db
    .insert(MockInterview)
    .values({
      mockId: v4().toString(),
      jsonMockResponse: mockJsonResponse,
      jobPosition: prompt.role,
      jobDesc: prompt.description,
      jobExperence: prompt.experence,
    })
    .returning({ mockId: MockInterview.mockId });

  return NextResponse.json({ response: dbResponse });
}
