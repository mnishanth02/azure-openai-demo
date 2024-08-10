import { FC } from "react";
import { sql } from "drizzle-orm";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import GoHome from "@/app/(main)/interview/_lib/components/go-home";

import { db } from "@/db/db";

interface ResumeFeedbackPageProps {
  params: {
    resumeId: string;
    interviewId: string;
  };
}

interface InterviewDetails {
  jobDescription: string;
  interviewStatus: string;
  totalQuestions: number;
  questionId: number;
  question: string;
  questionOrder: number;
  userAnswer: string;
  feedback: string;
  rating: number;
}

async function getInterviewDetails(resumeId: number, interviewId: number) {
  const result = await db.execute(sql`
        SELECT
          ri.job_description AS "jobDescription",
          ri.status AS "interviewStatus",
          ri.total_questions AS "totalQuestions",
          rq.id AS "questionId",
          rq.question AS "question",
          rq.question_order AS "questionOrder",
          ra.user_answer AS "userAnswer",
          ra.feedback AS "feedback",
          ra.rating AS "rating"
        FROM
          resume_interview ri
        INNER JOIN
          resume_question rq ON ri.id = rq.interview_id
        LEFT JOIN
          resume_answer ra ON rq.id = ra.question_id
        WHERE
          ri.id = ${interviewId} AND ri.resume_id = ${resumeId}
        ORDER BY
          rq.question_order ASC
      `);

  const interviewDetails: InterviewDetails[] = [];

  if (Array.isArray(result.rows)) {
    for (const row of result.rows) {
      const interviewDetail: InterviewDetails = {
        jobDescription: row.jobDescription as string,
        interviewStatus: row.interviewStatus as string,
        totalQuestions: row.totalQuestions as number,
        questionId: row.questionId as number,
        question: row.question as string,
        questionOrder: row.questionOrder as number,
        userAnswer: row.userAnswer as string,
        feedback: row.feedback as string,
        rating: row.rating as number,
      };

      interviewDetails.push(interviewDetail);
    }
  }

  return interviewDetails;
}

const ResumeFeedbackPage: FC<ResumeFeedbackPageProps> = async ({ params }) => {
  const { resumeId, interviewId } = params;

  const feedbackDataList = await getInterviewDetails(+resumeId, +interviewId);

  function calculateAverageRating(): number {
    if (feedbackDataList.length === 0) return 0;

    const totalRating = feedbackDataList.reduce((sum, feedback) => {
      const rating = Number(feedback.rating);
      if (isNaN(rating) || rating < 0) {
        return sum;
      }
      return sum + rating;
    }, 0);

    const averageRating = totalRating / feedbackDataList.length;
    return averageRating;
  }
  return (
    <div className="mx-auto max-w-5xl">
      <div className="p-10">
        {feedbackDataList.length === 0 ? (
          <h2 className="text-xl font-bold">No Interview Feedback Found</h2>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-green-500">Congratulations! </h2>
            <h3 className="text-2xl font-bold">Here is you interview feedback</h3>
            <h3 className="my-3 text-lg text-secondary-foreground">
              Your overall interview rating <strong>{calculateAverageRating()}/10</strong>
            </h3>

            <h4 className="text-sm text-secondary-foreground/80">
              Find below interview questions with correct answer, your answer and feedback for improvement.
            </h4>
            {feedbackDataList.map((feedback) => (
              <Collapsible key={feedback.questionId} className="mt-7">
                <CollapsibleTrigger className="my-2 flex w-full justify-between rounded-lg bg-secondary/80 p-2 text-left">
                  {feedback.question}
                  <div className={cn("ml-2 w-9 p-0", buttonVariants({ variant: "ghost", size: "icon" }))}>
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="">
                  <div className="ml-5 flex flex-col gap-2">
                    <h2 className="rounded-lg border p-2">
                      <strong>Rating : </strong> {feedback.rating}
                    </h2>
                    <h2 className="rounded-lg border bg-red-200 p-2 text-sm dark:bg-red-800">
                      <strong>Your Answer : </strong> {feedback.userAnswer}
                    </h2>
                    {/* <h2 className="rounded-lg border bg-green-200 p-2 text-sm dark:bg-green-800">
                      <strong>Correct Answer : </strong> {feedback.}
                    </h2> */}
                    <h2 className="rounded-lg border bg-blue-200 p-2 text-sm dark:bg-blue-800">
                      <strong>Feedback : </strong> {feedback.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </>
        )}

        <GoHome />
      </div>
    </div>
  );
};

export default ResumeFeedbackPage;
