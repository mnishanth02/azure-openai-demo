import { NextRequest, NextResponse } from "next/server";

import { ScheduleFormValues } from "@/app/(main)/interview/_lib/components/resume/useResumeScheduler";

import { db } from "@/db/db";
import { resumeInterview, resumeQuestion, resumeTopic } from "@/db/schema";

export async function POST(request: NextRequest) {
  const jsonReq = (await request.json()) as ScheduleFormValues;

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
