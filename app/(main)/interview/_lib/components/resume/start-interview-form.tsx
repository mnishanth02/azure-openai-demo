"use client";

import React, { useState } from "react";
import { Mic } from "lucide-react";
import { Controller, FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/common/loader";

import { InterviewData, useResumeInterviewStart } from "./useResumeInterviewStart";

type Props = {
  interviewData: InterviewData;
};

export default function StartInterviewForm({ interviewData }: Props) {
  const [isRecording, setIsRecording] = useState(false);

  const {
    methods,
    onHandleSubmit,
    isPending,
    currentQuestionIndex,
    questions,
    navigateQuestion,
    interviewData: updatedInterviewData,
  } = useResumeInterviewStart(interviewData);

  const { control, watch } = methods;

  const currentAnswer = watch("answer");

  const handleRecord = () => {
    setIsRecording(!isRecording);
    // Implement actual recording logic here
  };

  if (!updatedInterviewData || questions.length === 0) {
    return <Loader />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="mx-auto mt-20 max-w-5xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Hi, {updatedInterviewData.personalInfo.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <Card className="min-h-72 bg-secondary">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold underline underline-offset-4">
                Question {currentQuestionIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 py-2">
              <p className="text-secondary-foreground">{currentQuestion.question}</p>
            </CardContent>
          </Card>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigateQuestion("prev")} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateQuestion("next")}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <CardContent>
            <FormProvider {...methods}>
              <form onSubmit={onHandleSubmit} className="space-y-4">
                <Controller
                  name="answer"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Your response..." className="min-h-72 w-full" />
                  )}
                />

                <div className="flex items-center justify-between">
                  <Button type="submit" disabled={isPending || !currentAnswer}>
                    {isPending ? "Processing..." : "Submit & Next"}
                  </Button>
                  <Button
                    type="button"
                    variant={isRecording ? "destructive" : "default"}
                    onClick={handleRecord}
                    disabled={isPending}
                    className="flex items-center"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    {isRecording ? "Stop" : "Record"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </div>
      </CardContent>
    </Card>
  );
}
