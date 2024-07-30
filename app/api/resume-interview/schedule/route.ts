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

  //   const [resumeData] = await db
  //     .select({
  //       id: personalInfo.id,
  //       name: personalInfo.name,
  //       summary: personalInfo.summary,
  //       skills: skills.skills,
  //       education: {
  //         degree: education.degree,
  //         fieldOfStudy: education.fieldOfStudy,
  //       },
  //       workExperience: sql<WorkExperience[]>`
  //     COALESCE(
  //       NULLIF(jsonb_agg(
  //         jsonb_build_object(
  //           'company', ${workExperience.company},
  //           'position', ${workExperience.position},
  //           'responsibilities', ${workExperience.responsibilities}
  //         )
  //       ) FILTER (WHERE ${workExperience.company} IS NOT NULL), '[]'::jsonb),
  //       '[]'::jsonb
  //     )`.as("workExperience"),
  //       certifications: sql<Certifications[]>`
  //     COALESCE(
  //       NULLIF(jsonb_agg(
  //         jsonb_build_object(
  //           'name', ${certifications.name}
  //         )
  //       ) FILTER (WHERE ${certifications.name} IS NOT NULL AND ${certifications.name} != ''), '[]'::jsonb),
  //       '[]'::jsonb
  //     )`.as("certifications"),
  //       projects: sql<Projects[]>`
  //     COALESCE(
  //       NULLIF(jsonb_agg(
  //         jsonb_build_object(
  //           'name', ${projects.name},
  //           'description', ${projects.description},
  //           'technologies', ${projects.technologies},
  //           'role', ${projects.role}
  //         )
  //       ) FILTER (WHERE ${projects.name} IS NOT NULL AND ${projects.name} != ''
  //                   AND ${projects.technologies} IS NOT NULL AND ${projects.technologies} != ''), '[]'::jsonb),
  //       '[]'::jsonb
  //     )`.as("projects"),
  //     })
  //     .from(personalInfo)
  //     .leftJoin(skills, eq(personalInfo.id, skills.resumeId))
  //     .leftJoin(education, eq(personalInfo.id, education.resumeId))
  //     .leftJoin(workExperience, eq(personalInfo.id, workExperience.resumeId))
  //     .leftJoin(certifications, eq(personalInfo.id, certifications.resumeId))
  //     .leftJoin(projects, eq(personalInfo.id, projects.resumeId))
  //     .where(eq(personalInfo.id, +jsonReq.resumeId))
  //     .groupBy(personalInfo.id, skills.skills, education.degree, education.fieldOfStudy);

  //  save the Job description,

  const [interviewRes] = await db
    .insert(resumeInterview)
    .values({
      resumeId: +jsonReq.resumeId,
      jobDescription: jsonReq.jd,
      status: "new",
    })
    .returning({ interviewId: resumeInterview.id });

  await db.insert(resumeQuestion).values({
    interviewId: interviewRes.interviewId,
    question:
      "Can you tell me about a project or initiative you led or contributed to that you're particularly proud of ?",
  });

  return NextResponse.json({
    resumeId: jsonReq.resumeId,
    interviewId: interviewRes.interviewId,
  });

  const resumeData = "";
  //    get chat completion from Azure OpenAI
  const messages: ChatRequestMessage[] = [
    {
      role: "system",
      content:
        "You are an AI Technical Interview panel assistant. Ask questions based on the user's resume and job description. Maintain a natural conversation flow and ask follow-up questions when appropriate.",
    },
    {
      role: "user",
      content: `Resume: ${JSON.stringify(resumeData)}. \n Job Description: ${jsonReq.jd}.\n `,
    },
    {
      role: "user",
      content: `Please provide the first interview question based on the resume and job description in this object format:  {question: string}.`,
    },
  ];

  const completions = await client.getChatCompletions(env.AZURE_INTERVIEW_DEPLOYMENT_NAME, messages, {
    maxTokens: 500,
  });

  const response = completions.choices[0].message?.content as string;
  console.log("response->", response);

  //   const mockJsonResponse = response.replace("```json", "").replace("```", "");

  //   console.log("Response->", resumeData);

  return NextResponse.json({ response });
}
