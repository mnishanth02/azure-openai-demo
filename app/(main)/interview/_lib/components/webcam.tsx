"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { Lightbulb, WebcamIcon } from "lucide-react";
import WebcamReact from "react-webcam";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

import { SelectMockInterviewType } from "@/db/schema";

interface WebcamProps {
  mockDetails: SelectMockInterviewType;
}

const Webcam: FC<WebcamProps> = ({ mockDetails }) => {
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 rounded-lg border p-5">
            <h2 className="text-lg">
              <strong>Job Role / Job position : </strong>
              {mockDetails.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description / Job Tech Stack : </strong>
              {mockDetails.jobDesc}
            </h2>

            <h2 className="text-lg">
              <strong>Job Role / Job position : </strong>
              {mockDetails.jobExperence}
            </h2>
          </div>
          <div className="rounded-lg border border-secondary bg-accent p-5">
            <h2 className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
              <Lightbulb /> <strong>Information</strong>
            </h2>
            <h3 className="ml-2 mt-3 text-accent-foreground">
              Enable video webcam and microphone to start your AI generated mock interview. It has 3 questions which you
              can answer and at the end you will get the report on the basis of you answer. NOTE : We never record your
              video, you can disable the access at any time you want.
            </h3>
          </div>
        </div>
        <div>
          {webcamEnabled ? (
            <WebcamReact
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              mirrored
              className="mt-4"
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <WebcamIcon className="mb-7 h-72 w-full rounded-lg border bg-secondary p-20" />
              <Button variant={"outline"} onClick={() => setWebcamEnabled(true)}>
                Enable webcam and microphone
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-10 flex items-end justify-end">
        <Link href={"/interview/mock/" + mockDetails.mockId + "/start"} className={cn(buttonVariants())}>
          Start Interview
        </Link>
      </div>
    </div>
  );
};

export default Webcam;
