"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export interface InterviewQuestion {
  questionId: number;
  question: string;
}

export interface InterviewData {
  interviewDescription: string;
  interviewStatus: string;
  questions: InterviewQuestion[];
  personalInfo: {
    name: string;
    email: string;
  };
}

const InterviewFormSchema = z.object({
  answer: z.string().min(1, { message: "Answer is required" }),
});

export type InterviewFormValues = z.infer<typeof InterviewFormSchema>;

const getInterviewQuestions = async (data: InterviewFormValues) => {
  const response = await fetch("/api/resume-interview/schedule", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return await response.json();
};

export const useResumeInterviewStart = () => {
  const methods = useForm<InterviewFormValues>({
    resolver: zodResolver(InterviewFormSchema),
    defaultValues: {
      answer: "",
    },
    mode: "onChange",
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation<any, Error, InterviewFormValues>({
    mutationFn: getInterviewQuestions,
  });

  const onSubmit = (values: InterviewFormValues) => {
    console.log("Sub Form ->", values);

    // mutate(values, {
    //   onSuccess: (data) => {
    //     console.log("API Respionse -<>", data);
    //     const resumeId = data.resumeId;
    //     const interviewId = data.interviewId;

    //     // router.push("/interview/resume/mock/" + data.response.mockId);
    //     router.push(`/interview/resume/${resumeId}/${interviewId}`);
    //   },
    //   onError: (data) => {
    //     toast.error(data.message);
    //   },
    // });
  };

  const onHandleSubmit = methods.handleSubmit(onSubmit);

  return {
    methods,
    onHandleSubmit,
    isPending,
  };
};
