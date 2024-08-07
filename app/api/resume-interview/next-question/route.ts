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
  resumeTopic,
  skills,
  workExperience,
  WorkExperience,
} from "@/db/schema";
import { env } from "@/env";

const client = new OpenAIClient(env.AZURE_INTERVIEW_ENDPOINT, new AzureKeyCredential(env.AZRE_INTERVIEW_API_KEY));
const QUESTIONS_PER_TOPIC = 3;

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
        totalTopics: resumeInterview.totalTopics,
      })
      .from(resumeInterview)
      .where(eq(resumeInterview.id, interviewId));

    return interviewData;
  } catch (error) {
    console.error("Error fetching interview data:", error);
    throw error;
  }
}

async function getPreviousQuestionsForTopic(interviewId: number, topicId: number) {
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
      .where(and(eq(resumeQuestion.interviewId, interviewId), eq(resumeQuestion.topicId, topicId)))
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
  topicName: string
): ChatRequestMessage[] {
  return [
    {
      role: "system",
      content: `
        You are an AI Technical Interview panel assistant. Your task is to conduct a technical interview based on the candidate's resume and the job description. Follow these guidelines:

        1. Ask relevant technical questions based on the candidate's experience and the job requirements.
        2. For each topic, ask a series of ${QUESTIONS_PER_TOPIC} related questions before moving to a new topic. After  ${QUESTIONS_PER_TOPIC} questions in the same topic pick a new topic based on the Job description and user's skill and update the same in the response as well.
        3. Ensure questions become progressively more challenging within each topic.
        4. Maintain a natural conversation flow and provide feedback on the candidate's answers.
        5. Rate the candidate's previous answer on a scale of 1 to 10, with 10 being the best.
        6. Format your response as a JSON object with the following structure:
        {
            "feedback": "Detailed feedback on the previous answer (only if there was a previous answer)",
            "rating": "Numerical rating of the previous answer from 1 to 10 (only if there was a previous answer)",
            "question": "The next interview question",
            "topic": "The current topic being discussed"
        }
        7. For the first question of a new topic, omit the "feedback" and "rating" fields.
        8. Ensure the feedback is constructive and the rating is fair based on the technical accuracy and completeness of the answer.
        9. You are currently on the topic "${topicName}", Question ${currentQuestionNumber} of this topic.
      `,
    },
    {
      role: "user",
      content: `Resume: ${JSON.stringify(resumeData)}
        Job Description: ${jobDescription}
        Current Topic: ${topicName}
        Current Question Number in Topic: ${currentQuestionNumber}
        Previous Questions and Answers for this Topic: ${JSON.stringify(previousQuestions)}

        Please provide feedback on the previous answer (if applicable), a rating out of 10, and the next interview question based on the above information.`,
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
        topicId: resumeQuestion.topicId,
        questionOrder: resumeQuestion.questionOrder,
      })
      .from(resumeQuestion)
      .where(eq(resumeQuestion.id, +questionId));

    if (!currentQuestion.topicId) {
      return NextResponse.json({ error: "Missing Interview Topic" }, { status: 400 });
    }

    // Get current topic data
    const [currentTopic] = await db
      .select({
        topicName: resumeTopic.topicName,
        topicOrder: resumeTopic.topicOrder,
      })
      .from(resumeTopic)
      .where(eq(resumeTopic.id, currentQuestion.topicId));

    // Check if we've reached the maximum number of topics
    if (currentTopic.topicOrder > interviewData.totalTopics) {
      return NextResponse.json({ message: "Interview completed" }, { status: 200 });
    }

    // Get previous questions and answers for the current topic
    const previousQuestions = await getPreviousQuestionsForTopic(+interviewId, currentQuestion.topicId);

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
      currentTopic.topicName
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

    // Determine if we need to move to a new topic
    const isNewTopic = currentQuestion.questionOrder === QUESTIONS_PER_TOPIC;
    let newTopicId = currentQuestion.topicId;

    if (isNewTopic) {
      const [newTopic] = await db
        .insert(resumeTopic)
        .values({
          interviewId: +interviewId,
          topicName: parsedResponse.topic,
          topicOrder: currentTopic.topicOrder + 1,
        })
        .returning();
      newTopicId = newTopic.id;
    }

    // Save the new question to the database
    const [newQuestion] = await db
      .insert(resumeQuestion)
      .values({
        interviewId: +interviewId,
        topicId: newTopicId,
        question: parsedResponse.question,
        questionOrder: isNewTopic ? 1 : currentQuestion.questionOrder + 1,
      })
      .returning();

    return NextResponse.json({
      ...parsedResponse,
      newQuestionId: newQuestion.id,
      currentTopicNumber: isNewTopic ? currentTopic.topicOrder + 1 : currentTopic.topicOrder,
      currentQuestionInTopic: isNewTopic ? 1 : currentQuestion.questionOrder + 1,
      isLastQuestion:
        currentTopic.topicOrder === interviewData.totalTopics && currentQuestion.questionOrder === QUESTIONS_PER_TOPIC,
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
