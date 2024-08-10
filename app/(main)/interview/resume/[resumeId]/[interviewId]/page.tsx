import { sql } from "drizzle-orm";

import { db } from "@/db/db";
import StartInterviewForm from "../../../_lib/components/resume/start-interview-form";
import { InterviewData } from "../../../_lib/components/resume/useResumeInterviewStart";

interface PageProps {
  params: {
    resumeId: string;
    interviewId: string;
  };
}

async function getInterviewData(interviewId: number, resumeId: number): Promise<InterviewData> {
  const result = await db.execute(sql`
      SELECT
        ri.job_description AS "interviewDescription",
        ri.status AS "interviewStatus",
        rq.id AS "questionId",
        rq.question AS "question",
        pi.name AS "personalInfoName",
        pi.email AS "personalInfoEmail"
      FROM
        resume_interview ri
      LEFT JOIN
        resume_question rq ON ri.id = rq.interview_id
      INNER JOIN
        personal_info pi ON ri.resume_id = pi.id
      WHERE
        ri.id = ${interviewId} AND ri.resume_id = ${resumeId}
    `);

  // Process the result to group questions
  const processedResult: InterviewData = {
    interviewDescription: "",
    interviewStatus: "",
    questions: [],
    personalInfo: {
      name: "",
      email: "",
    },
  };

  if (Array.isArray(result.rows)) {
    for (const row of result.rows) {
      if (!processedResult.interviewDescription && row.interviewDescription) {
        processedResult.interviewDescription = row.interviewDescription as string;
        processedResult.interviewStatus = row.interviewStatus as string;
      }
      if (row.questionId && row.question) {
        processedResult.questions.push({
          questionId: row.questionId as number,
          question: row.question as string,
        });
      }
      if (!processedResult.personalInfo.name && row.personalInfoName) {
        processedResult.personalInfo.name = row.personalInfoName as string;
      }
      if (!processedResult.personalInfo.email && row.personalInfoEmail) {
        processedResult.personalInfo.email = row.personalInfoEmail as string;
      }
    }
  } else {
    console.error("Unexpected result structure:", result);
    throw new Error("Unexpected result structure from database query");
  }

  return processedResult;
}

const ResumeInterviewStartPage = async ({ params }: PageProps) => {
  const { resumeId, interviewId } = params;

  const interviewData = await getInterviewData(+interviewId, +resumeId);
  return <StartInterviewForm interviewData={interviewData} resumeId={resumeId} interviewId={interviewId} />;
};

export default ResumeInterviewStartPage;
