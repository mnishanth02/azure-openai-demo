"use client";

import React, { useEffect, useState } from "react";
import { Mic } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/common/loader";

import { InterviewData, InterviewQuestion, useResumeInterviewStart } from "./useResumeInterviewStart";

const fetchNextQuestion = async (questionId: number, answer: string): Promise<InterviewQuestion> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    questionId: questionId + 1,
    question: `This is question ${questionId + 1}. The previous answer was: ${answer}`,
  };
};

type Props = {
  interviewData: InterviewData;
};
export default function StartInterviewForm({ interviewData: initialInterviewData }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<InterviewQuestion[]>(initialInterviewData.questions);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { methods, onHandleSubmit, isPending } = useResumeInterviewStart();

  const { setValue, watch } = methods;

  const currentAnswer = watch("answer");

  useEffect(() => {
    if (answeredQuestions[currentQuestionIndex]) {
      setValue("answer", answers[answeredQuestions[currentQuestionIndex].questionId] || "");
    }
  }, [currentQuestionIndex, answeredQuestions, answers, setValue]);

  const onSubmit = async (data: any) => {
    if (!answeredQuestions[currentQuestionIndex]) return;

    setIsProcessing(true);
    try {
      const currentQuestionId = answeredQuestions[currentQuestionIndex].questionId;
      setAnswers((prev) => ({ ...prev, [currentQuestionId]: data.answer }));

      if (currentQuestionIndex === answeredQuestions.length - 1) {
        const nextQuestion = await fetchNextQuestion(currentQuestionId, data.answer);
        setAnsweredQuestions((prev) => [...prev, nextQuestion]);
      }

      setCurrentQuestionIndex((prev) => prev + 1);
      setValue("answer", "");
    } catch (error) {
      console.error("Error processing answer:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    // Implement actual recording logic here
  };

  const navigateQuestion = (direction: "prev" | "next") => {
    if (direction === "prev" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (direction === "next" && currentQuestionIndex < answeredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  if (!initialInterviewData || answeredQuestions.length === 0) {
    return <Loader />;
  }

  const currentQuestion = answeredQuestions[currentQuestionIndex];

  return (
    <Card className="mx-auto mt-20 max-w-5xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Hi, {initialInterviewData?.personalInfo.name}</CardTitle>
        {/* <p className="text-muted-foreground">{initialInterviewData?.interviewDescription}</p> */}
      </CardHeader>
      <CardContent className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <Card className="min-h-72 bg-secondary">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold underline underline-offset-4">
                Question {currentQuestion.questionId}
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
              disabled={currentQuestionIndex === answeredQuestions.length - 1}
            >
              Next
            </Button>
          </div>
        </div>

        {/*  Right side section */}
        <div className="space-y-4">
          <CardContent className="">
            <FormProvider {...methods}>
              <form onSubmit={onHandleSubmit} className="space-y-4">
                <Controller
                  name="answer"
                  control={methods.control}
                  defaultValue={methods.formState.defaultValues?.answer}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Your response..." className="min-h-72 w-full" />
                  )}
                />

                <div className="flex items-center justify-between">
                  <Button type="submit" disabled={isProcessing || !currentAnswer}>
                    {isProcessing ? "Processing..." : "Submit & Next"}
                  </Button>
                  <Button
                    type="button"
                    variant={isRecording ? "destructive" : "default"}
                    onClick={handleRecord}
                    disabled={isProcessing}
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
