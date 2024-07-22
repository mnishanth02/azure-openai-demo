import { NextRequest, NextResponse } from "next/server";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import { ChatRequestMessage } from "@azure/openai/rest";

import { db } from "@/db/db";
import { UserAnswer } from "@/db/schema";
import { env } from "@/env";

export async function POST(request: NextRequest) {
  const reqObj = await request.json();

  console.log("reqObj->", reqObj);

  const prompt = reqObj.feedbackPrompt;
  const mockId = reqObj.mockId;
  const question = reqObj.question;
  const correctAns = reqObj.correctAns;
  const userAns = reqObj.userAns;

  if (!prompt) {
    return NextResponse.json({ error: "Please provide a User Answer " }, { status: 400 });
  }

  const client = new OpenAIClient(env.AZURE_ENDPOINT, new AzureKeyCredential(env.AZURE_API_KEY));

  //    get chat completion from Azure OpenAI
  const messages: ChatRequestMessage[] = [
    {
      role: "system",
      content:
        "You are an AI Technical Interview panel assistant who reviews user answer with the question asked and provide rating and feedback in a JSON format. rating in number out of 10",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const completions = await client.getChatCompletions(env.AZURE_DEPLOYMENT_COMPLETION_NAME, messages, {
    maxTokens: 500,
  });

  const response = completions.choices[0].message?.content as string;

  const feedbackResponse = response.replace("```json", "").replace("```", "");

  const jsonFeedbackResponse = JSON.parse(feedbackResponse);
  console.log("jsonFeedbackResponse->>", jsonFeedbackResponse);
  if (!feedbackResponse) {
    return NextResponse.json({ error: "Error While creating resposne from AI" }, { status: 500 });
  }

  const [dbResponse] = await db
    .insert(UserAnswer)
    .values({
      mockIdRef: mockId,
      question,
      correctAns,
      userAns,
      feedback: jsonFeedbackResponse?.feedback,
      rating: jsonFeedbackResponse?.rating,
    })
    .returning({ mockId: UserAnswer.mockIdRef });

  return NextResponse.json({ response: dbResponse });
}
