"use client";

import React, { FC } from "react";
import { FormProvider } from "react-hook-form";

import ImageForm from "./image-form";
import { useImageForm } from "./useImageForm";

interface ImageProviderProps {}

const ImageProvider: FC<ImageProviderProps> = ({}) => {
  const { methods, onHandleSubmit, isPending, images } = useImageForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={onHandleSubmit} className="flex flex-col">
        <ImageForm isPending={isPending} images={images} />
      </form>
    </FormProvider>
  );
};

export default ImageProvider;
