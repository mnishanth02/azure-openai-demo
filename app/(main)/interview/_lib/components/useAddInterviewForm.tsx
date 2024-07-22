"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { InterviewFormSchema, InterviewFormSchemaType } from "@/app/(main)/_lib/schema";

const getInterviewQuestions = async (data: InterviewFormSchemaType) => {
  const response = await fetch("/api/interview", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return await response.json();
};

export const useAddInterviewForm = () => {
  const methods = useForm<InterviewFormSchemaType>({
    resolver: zodResolver(InterviewFormSchema),
    defaultValues: {
      role: "",
      description: "",
      experence: "",
    },
    mode: "onChange",
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation<any, Error, InterviewFormSchemaType>({
    mutationFn: getInterviewQuestions,
  });

  const onSubmit = (values: InterviewFormSchemaType) => {
    console.log("Sub Form ->", values);

    mutate(values, {
      onSuccess: (data) => {
        router.push("/interview/mock/" + data.response.mockId);
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
