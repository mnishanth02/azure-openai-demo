import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export interface InterviewQuestion {
  questionId: number;
  question: string;
}

type NextQuestionProps = {
  questionId: number;
  answer: string;
  resumeId: string;
  interviewId: string;
};

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

const fetchNextQuestion = async (dataa: NextQuestionProps): Promise<InterviewQuestion> => {
  const resumeId = dataa.resumeId;
  const interviewId = dataa.interviewId;
  const questionId = dataa.questionId;
  const answer = dataa.answer;

  const response = await fetch("/api/resume-interview/next-question", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeId, interviewId, questionId, answer }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch next question");
  }

  return await response.json();
};

export const useResumeInterviewStart = (initialData: InterviewData) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<InterviewQuestion[]>(initialData.questions);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { resumeId, interviewId } = useParams();
  console.log("Params", resumeId, interviewId);

  const methods = useForm<InterviewFormValues>({
    resolver: zodResolver(InterviewFormSchema),
    defaultValues: {
      answer: "",
    },
    mode: "onChange",
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation<InterviewQuestion, Error, { questionId: number; answer: string }>({
    mutationFn: ({ questionId, answer }) =>
      fetchNextQuestion({ answer, questionId, interviewId: interviewId as string, resumeId: resumeId as string }),
    onSuccess: (newQuestion) => {
      console.log("Success Response ->>", JSON.stringify(newQuestion));

      setQuestions((prev) => [...prev, newQuestion]);
      setCurrentQuestionIndex((prev) => prev + 1);
      methods.reset({ answer: "" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: InterviewFormValues) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setAnswers((prev) => ({ ...prev, [currentQuestion.questionId]: values.answer }));

    if (currentQuestionIndex === questions.length - 1) {
      mutate({ questionId: currentQuestion.questionId, answer: values.answer });
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      methods.reset({ answer: "" });
    }
  };

  const onHandleSubmit = methods.handleSubmit(onSubmit);

  const navigateQuestion = (direction: "prev" | "next") => {
    if (direction === "prev" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (direction === "next" && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
    methods.setValue("answer", answers[questions[currentQuestionIndex].questionId] || "");
  };

  return {
    methods,
    onHandleSubmit,
    isPending,
    currentQuestionIndex,
    questions,
    navigateQuestion,
    interviewData: initialData,
  };
};
