import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InterviewFormSchemaType } from "@/app/(main)/_lib/schema";

type Props = {};

export const mimeType = "audio/webm";
const AddInterviewForm = ({}: Props) => {
  const {
    formState: { defaultValues },
    control,
  } = useFormContext<InterviewFormSchemaType>();

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div>
        <Label>Job Role/Job Position</Label>
        <Controller
          name="role"
          control={control}
          defaultValue={defaultValues?.role}
          render={({ field }) => <Input {...field} placeholder="Ex. Full Stack Developer" className="" />}
        />
      </div>
      <div>
        <Label>Job Description/ Tech Stack (In Short)</Label>
        <Controller
          name="description"
          control={control}
          defaultValue={defaultValues?.description}
          render={({ field }) => (
            <Textarea {...field} placeholder="Ex. React, Angular, NodeJs, Postgress" className="min-h-28 w-full" />
          )}
        />
      </div>
      <div>
        <Label>Years of Experence</Label>
        <Controller
          name="experence"
          control={control}
          defaultValue={defaultValues?.experence}
          render={({ field }) => <Input type="number" {...field} placeholder="Ex. Full Stack Developer" className="" />}
        />
      </div>
    </div>
  );
};

export default AddInterviewForm;
