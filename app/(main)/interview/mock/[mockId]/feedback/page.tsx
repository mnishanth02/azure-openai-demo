import { FC } from "react";
import { eq } from "drizzle-orm";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { db } from "@/db/db";
import { UserAnswer } from "@/db/schema";
import GoHome from "../../../_lib/components/go-home";

interface FeedbackPageProps {
  params: { mockId: string };
}

const FeedbackPage: FC<FeedbackPageProps> = async ({ params }) => {
  const feedbackList = await db
    .select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef, params.mockId))
    .orderBy(UserAnswer.id);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="p-10">
        {feedbackList.length === 0 ? (
          <h2 className="text-xl font-bold">No Interview Feedback Found</h2>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-green-500">Congratulations! </h2>
            <h3 className="text-2xl font-bold">Here is you interview feedback</h3>
            <h3 className="my-3 text-lg text-secondary-foreground">
              Your overall interview rating <strong>7/10</strong>
            </h3>

            <h4 className="text-sm text-secondary-foreground/80">
              Find below interview questions with correct answer, your answer and feedback for improvement.
            </h4>
            {feedbackList.map((feedback) => (
              <Collapsible key={feedback.id} className="mt-7">
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
                      <strong>Your Answer : </strong> {feedback.userAns}
                    </h2>
                    <h2 className="rounded-lg border bg-green-200 p-2 text-sm dark:bg-green-800">
                      <strong>Correct Answer : </strong> {feedback.correctAns}
                    </h2>
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

export default FeedbackPage;
