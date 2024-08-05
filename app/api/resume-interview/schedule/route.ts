import { NextRequest, NextResponse } from "next/server";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import { ChatRequestMessage } from "@azure/openai/rest";
import { eq, sql } from "drizzle-orm";

import { ScheduleFormValues } from "@/app/(main)/interview/_lib/components/resume/useResumeScheduler";

import { db } from "@/db/db";
import {
  Certifications,
  certifications,
  education,
  languages,
  personalInfo,
  Projects,
  projects,
  resumeInterview,
  resumeQuestion,
  resumeTopic,
  skills,
  WorkExperience,
  workExperience,
} from "@/db/schema";
import { env } from "@/env";

const client = new OpenAIClient(env.AZURE_INTERVIEW_ENDPOINT, new AzureKeyCredential(env.AZRE_INTERVIEW_API_KEY));

export async function POST(request: NextRequest) {
  const jsonReq = (await request.json()) as ScheduleFormValues;

  //   console.log("jsonReq->", jsonReq);

  if (!jsonReq || !jsonReq.resumeId || !jsonReq.jd) {
    return NextResponse.json({ error: "Missing required data to start the interview" }, { status: 400 });
  }

  const [interviewRes] = await db
    .insert(resumeInterview)
    .values({
      resumeId: +jsonReq.resumeId,
      jobDescription: jsonReq.jd,
      status: "new",
    })
    .returning({ interviewId: resumeInterview.id });

  const [newTopic] = await db
    .insert(resumeTopic)
    .values({
      interviewId: interviewRes.interviewId,
      topicName: "Previous Experence",
      topicOrder: 1,
    })
    .returning();

  await db.insert(resumeQuestion).values({
    interviewId: interviewRes.interviewId,
    question:
      "Can you tell me about a project or initiative you led or contributed to that you're particularly proud of ?",
    questionOrder: 1,
    topicId: newTopic.id,
  });

  return NextResponse.json({
    resumeId: jsonReq.resumeId,
    interviewId: interviewRes.interviewId,
  });
}
