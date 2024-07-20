"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ImageFormSchema, ImageFormSchemaType } from "@/app/(main)/_lib/schema";

const imageGenerate = async (data: ImageFormSchemaType) => {
  const response = await fetch("/api/imageGenerate", {
    method: "POST",
    body: JSON.stringify(data.prompt),
  });

  return await response.json();
};

export const useImageForm = () => {
  const [images, setImages] = useState<string[]>([]);
  const methods = useForm<ImageFormSchemaType>({
    resolver: zodResolver(ImageFormSchema),
    defaultValues: {
      prompt: "",
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation<any, Error, ImageFormSchemaType>({
    mutationFn: imageGenerate,
  });

  const onSubmit = (values: ImageFormSchemaType) => {
    setImages([]);
    mutate(values, {
      onSuccess: (data) => {
        console.log("in success->", data.response);

        if (data.response.length > 0) {
          setImages(data.response);
        } else {
          setImages([]);
        }
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
    images,
  };
};
