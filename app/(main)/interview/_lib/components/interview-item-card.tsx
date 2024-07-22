import { FC } from "react";
import Link from "next/link";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import { SelectMockInterviewType } from "@/db/schema";

interface InterviewItemCardProps {
  mockInterview: SelectMockInterviewType;
}

const InterviewItemCard: FC<InterviewItemCardProps> = ({ mockInterview }) => {
  return (
    <div className="rounded-lg border p-3 shadow-sm">
      <h3 className="font-bold text-primary">{mockInterview?.jobPosition}</h3>
      <h3 className="texy-sm text-secondary-foreground">{mockInterview?.jobExperence} Years of Experence</h3>
      <h3 className="text-xs text-secondary-foreground/80">Created At: {format(mockInterview?.createdAt, "PPP")}</h3>
      <div className="mt-3 flex justify-between gap-5">
        <Link
          href={`/interview/mock/${mockInterview.mockId}/feedback`}
          className={cn("w-full", buttonVariants({ size: "sm", variant: "outline" }))}
        >
          Feedback
        </Link>
        <Link
          href={`/interview/mock/${mockInterview.mockId}/start`}
          className={cn("w-full", buttonVariants({ size: "sm" }))}
        >
          Retake Interview
        </Link>
      </div>
    </div>
  );
};

export default InterviewItemCard;
