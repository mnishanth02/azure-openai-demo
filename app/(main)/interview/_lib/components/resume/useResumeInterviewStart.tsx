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

interface ApiResponse {
  newQuestionId?: number;
  question?: string;
  currentQuestionNumber?: number;
  isLastQuestion: boolean;
  message?: string;
}

const fetchNextQuestion = async (data: NextQuestionProps): Promise<ApiResponse> => {
  const { resumeId, interviewId, questionId, answer } = data;

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
  const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);
  const { resumeId, interviewId } = useParams();

  const methods = useForm<InterviewFormValues>({
    resolver: zodResolver(InterviewFormSchema),
    defaultValues: {
      answer: "",
    },
    mode: "onChange",
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation<ApiResponse, Error, { questionId: number; answer: string }>({
    mutationFn: ({ questionId, answer }) =>
      fetchNextQuestion({ answer, questionId, interviewId: interviewId as string, resumeId: resumeId as string }),
    onSuccess: (response) => {
      console.log("Success Response ->>", JSON.stringify(response));

      if (response.isLastQuestion) {
        setIsInterviewCompleted(true);
        toast.success(response.message || "Interview completed");
        // You might want to navigate to a completion page or show a completion modal
        // router.push(`/interview-completed/${interviewId}`);
      } else if (response.newQuestionId && response.question) {
        setQuestions((prev) => [...prev, { questionId: response.newQuestionId!, question: response.question! }]);
        setCurrentQuestionIndex((prev) => prev + 1);
      }
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

    mutate({ questionId: currentQuestion.questionId, answer: values.answer });
  };

  const onHandleSubmit = methods.handleSubmit(onSubmit);

  const navigateQuestion = (direction: "prev" | "next") => {
    if (direction === "prev" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => {
        const updatedQuestionIndex = prev - 1;
        methods.setValue("answer", answers[questions[updatedQuestionIndex].questionId] || "");
        return updatedQuestionIndex;
      });
    } else if (direction === "next" && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => {
        const updatedQuestionIndex = prev + 1;
        methods.setValue("answer", answers[questions[updatedQuestionIndex].questionId] || "");
        return updatedQuestionIndex;
      });
    }
  };

  return {
    methods,
    onHandleSubmit,
    isPending,
    currentQuestionIndex,
    questions,
    navigateQuestion,
    interviewData: initialData,
    isInterviewCompleted,
  };
};
