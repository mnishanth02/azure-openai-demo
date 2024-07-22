"use client";

import { FC, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

import { SelectMockInterviewType } from "@/db/schema";
import AnswerSection from "./answer-section";
import QuestionSection, { QuestionAnswerT } from "./question-section";

interface StartInterviewProps {
  mockDetails: SelectMockInterviewType;
}

const StartInterview: FC<StartInterviewProps> = ({ mockDetails }) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  console.log("jsonMockResp->", mockDetails?.jsonMockResponse);

  const jsonMockResp = JSON.parse(mockDetails?.jsonMockResponse) as QuestionAnswerT[];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <QuestionSection mockInterviewQuestions={jsonMockResp} activeQuestionIndex={activeQuestionIndex} />
        <AnswerSection
          mockInterviewQuestions={jsonMockResp}
          activeQuestionIndex={activeQuestionIndex}
          mockId={mockDetails.mockId}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && (
          <Button variant={"secondary"} onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
            Previos Question
          </Button>
        )}
        {activeQuestionIndex !== jsonMockResp?.length - 1 && (
          <Button variant={"secondary"} onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
            Next Question
          </Button>
        )}
        {activeQuestionIndex === jsonMockResp?.length - 1 && (
          <Link href={`/interview/mock/${mockDetails.mockId}/feedback`} className={cn(buttonVariants())}>
            {" "}
            End Interview
          </Link>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
