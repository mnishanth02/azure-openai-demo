import { NextRequest, NextResponse } from "next/server";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import { ChatRequestMessage } from "@azure/openai/rest";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/db";
import {
  certifications,
  Certifications,
  personalInfo,
  projects,
  Projects,
  resumeAnswer,
  resumeInterview,
  resumeQuestion,
  skills,
  workExperience,
  WorkExperience,
} from "@/db/schema";
import { env } from "@/env";

const client = new OpenAIClient(env.AZURE_INTERVIEW_ENDPOINT, new AzureKeyCredential(env.AZRE_INTERVIEW_API_KEY));
const QUESTIONS_PER_INTERVIEW = 5;

async function getResumeData(resumeId: number) {
  try {
    const [resumeData] = await db
      .select({
        summary: personalInfo.summary,
        skills: skills.skills,
        workExperience: sql<WorkExperience[]>`
        COALESCE(
          NULLIF(jsonb_agg(
            jsonb_build_object(
              'company', ${workExperience.company},
              'position', ${workExperience.position},
              'responsibilities', ${workExperience.responsibilities}
            )
          ) FILTER (WHERE ${workExperience.company} IS NOT NULL), '[]'::jsonb),
          '[]'::jsonb
        )`.as("workExperience"),
        certifications: sql<Certifications[]>`
        COALESCE(
          NULLIF(jsonb_agg(
            jsonb_build_object(
              'name', ${certifications.name}
            )
          ) FILTER (WHERE ${certifications.name} IS NOT NULL AND ${certifications.name} != ''), '[]'::jsonb),
          '[]'::jsonb
        )`.as("certifications"),
        projects: sql<Projects[]>`
        COALESCE(
          NULLIF(jsonb_agg(
            jsonb_build_object(
              'name', ${projects.name},
              'description', ${projects.description},
              'technologies', ${projects.technologies},
              'role', ${projects.role}
            )
          ) FILTER (WHERE ${projects.name} IS NOT NULL AND ${projects.name} != ''
                      AND ${projects.technologies} IS NOT NULL AND ${projects.technologies} != ''), '[]'::jsonb),
          '[]'::jsonb
        )`.as("projects"),
      })
      .from(personalInfo)
      .leftJoin(skills, eq(personalInfo.id, skills.resumeId))
      .leftJoin(workExperience, eq(personalInfo.id, workExperience.resumeId))
      .leftJoin(certifications, eq(personalInfo.id, certifications.resumeId))
      .leftJoin(projects, eq(personalInfo.id, projects.resumeId))
      .where(eq(personalInfo.id, resumeId))
      .groupBy(personalInfo.id, skills.skills);

    return resumeData;
  } catch (error) {
    console.error("Error fetching resume data:", error);
    throw error;
  }
}

async function getInterviewData(interviewId: number) {
  try {
    const [interviewData] = await db
      .select({
        jobDescription: resumeInterview.jobDescription,
      })
      .from(resumeInterview)
      .where(eq(resumeInterview.id, interviewId));

    return interviewData;
  } catch (error) {
    console.error("Error fetching interview data:", error);
    throw error;
  }
}

async function getPreviousQuestions(interviewId: number) {
  try {
    const previousQuestions = await db
      .select({
        id: resumeQuestion.id,
        question: resumeQuestion.question,
        answer: resumeAnswer.userAnswer,
        feedback: resumeAnswer.feedback,
        rating: resumeAnswer.rating,
      })
      .from(resumeQuestion)
      .leftJoin(resumeAnswer, eq(resumeQuestion.id, resumeAnswer.questionId))
      .where(eq(resumeQuestion.interviewId, interviewId))
      .orderBy(resumeQuestion.questionOrder);

    return previousQuestions;
  } catch (error) {
    console.error("Error fetching previous questions:", error);
    throw error;
  }
}
function generatePrompt(
  resumeData: any,
  jobDescription: string,
  previousQuestions: any[],
  currentQuestionNumber: number,
  isLastQuestion: boolean
): ChatRequestMessage[] {
  return [
    {
      role: "system",
      content: `
        You are an AI Technical Interview panel assistant. Your task is to conduct a technical interview based on the candidate's resume and the job description. Follow these guidelines:

        1. Ask relevant technical questions based on the candidate's experience and the job requirements.
        2. Ensure questions become progressively more challenging as the interview progresses.
        3. Maintain a natural conversation flow and provide feedback on the candidate's answers.
        4. Rate the candidate's previous answer on a scale of 1 to 10, with 10 being the best.
        5. Format your response as a JSON object with the following structure:
        {
            "feedback": "Detailed feedback on the previous answer",
            "rating": "Numerical rating of the previous answer from 1 to 10",
            ${isLastQuestion ? "" : '"question": "The next interview question"'}
        }
        6. Ensure the feedback is constructive and the rating is fair based on the technical accuracy and completeness of the answer.
        7. You are currently on question ${currentQuestionNumber} of ${QUESTIONS_PER_INTERVIEW}.
        ${isLastQuestion ? "8. This is the last question of the interview. Provide a comprehensive feedback on the answer." : ""}
      `,
    },
    {
      role: "user",
      content: `Resume: ${JSON.stringify(resumeData)}
        Job Description: ${jobDescription}
        Current Question Number: ${currentQuestionNumber}
        Previous Questions and Answers: ${JSON.stringify(previousQuestions)}

        Please provide feedback on the previous answer, a rating out of 10, ${isLastQuestion ? "and a comprehensive final feedback." : "and the next interview question based on the above information."}`,
    },
  ];
}

export async function POST(request: NextRequest) {
  const jsonReq = await request.json();
  console.log("jsonReq->", jsonReq);

  if (!jsonReq || !jsonReq.resumeId || !jsonReq.interviewId || !jsonReq.questionId) {
    return NextResponse.json({ error: "Missing required data" }, { status: 400 });
  }

  const { resumeId, interviewId, questionId, answer } = jsonReq;

  try {
    // Get resume data
    const resumeData = await getResumeData(+resumeId);

    // Get interview data (job description)
    const interviewData = await getInterviewData(+interviewId);

    // Get current question data
    const [currentQuestion] = await db
      .select({
        questionOrder: resumeQuestion.questionOrder,
      })
      .from(resumeQuestion)
      .where(eq(resumeQuestion.id, +questionId));

    const isLastQuestion = currentQuestion.questionOrder === QUESTIONS_PER_INTERVIEW;

    // Get previous questions and answers
    const previousQuestions = await getPreviousQuestions(+interviewId);

    // Save the user's answer to the database
    await db.insert(resumeAnswer).values({
      questionId: +questionId,
      userAnswer: answer,
    });

    // Generate the prompt
    const messages = generatePrompt(
      resumeData,
      interviewData.jobDescription,
      previousQuestions,
      currentQuestion.questionOrder,
      isLastQuestion
    );

    // Get response from GPT
    const completions = await client.getChatCompletions(env.AZURE_INTERVIEW_DEPLOYMENT_NAME, messages, {
      maxTokens: 500,
    });

    const response = completions.choices[0].message?.content;
    console.log("response->", JSON.stringify(response));

    // Parse the response
    const parsedResponse = JSON.parse(response as string);

    // Update the answer with feedback and rating
    await db
      .update(resumeAnswer)
      .set({
        feedback: parsedResponse.feedback,
        rating: parsedResponse.rating ? parsedResponse.rating.toString() : null,
      })
      .where(eq(resumeAnswer.questionId, +questionId));

    if (isLastQuestion) {
      // Update the interview status to completed
      await db
        .update(resumeInterview)
        .set({
          status: "completed",
          endTime: new Date(),
        })
        .where(eq(resumeInterview.id, +interviewId));

      return NextResponse.json({
        message: "Interview completed",
        isLastQuestion: true,
      });
    } else {
      // Save the new question to the database
      const [newQuestion] = await db
        .insert(resumeQuestion)
        .values({
          interviewId: +interviewId,
          question: parsedResponse.question,
          questionOrder: currentQuestion.questionOrder + 1,
        })
        .returning();

      return NextResponse.json({
        newQuestionId: newQuestion.id,
        currentQuestionNumber: currentQuestion.questionOrder + 1,
        isLastQuestion: currentQuestion.questionOrder + 1 === QUESTIONS_PER_INTERVIEW,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
