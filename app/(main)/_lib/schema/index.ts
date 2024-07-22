import { z } from "zod";

export const TranslateFormSchema = z.object({
  input: z.string(),
  inputLanguage: z.string(),
  outputLanguage: z.string(),
  output: z.any(),
});
export const ImageFormSchema = z.object({
  prompt: z.string(),
});
export const InterviewFormSchema = z.object({
  role: z.string(),
  description: z.string(),
  experence: z.string(),
});

export type TranslateFormType = z.infer<typeof TranslateFormSchema>;
export type ImageFormSchemaType = z.infer<typeof ImageFormSchema>;
export type InterviewFormSchemaType = z.infer<typeof InterviewFormSchema>;
