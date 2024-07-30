"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const scheduleFormSchema = z.object({
  resumeId: z.string(),
  jd: z.string().min(1, "Job Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

const getInterviewQuestions = async (data: ScheduleFormValues) => {
  const response = await fetch("/api/resume-interview/schedule", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return await response.json();
};

export const useResumeScheduler = () => {
  const methods = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      date: "",
      jd: "",
      time: "",
    },
    mode: "onChange",
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation<any, Error, ScheduleFormValues>({
    mutationFn: getInterviewQuestions,
  });

  const onSubmit = (values: ScheduleFormValues) => {
    console.log("Sub Form ->", values);

    mutate(values, {
      onSuccess: (data) => {
        console.log("API Respionse -<>", data);
        const resumeId = data.resumeId;
        const interviewId = data.interviewId;

        // router.push("/interview/resume/mock/" + data.response.mockId);
        router.push(`/interview/resume/${resumeId}/${interviewId}`);
      },
      onError: (data) => {
        toast.error(data.message);
      },
    });
  };

  const onHandleSubmit = methods.handleSubmit(onSubmit);

  return {
    methods,
    onHandleSubmit,
    isPending,
  };
};
