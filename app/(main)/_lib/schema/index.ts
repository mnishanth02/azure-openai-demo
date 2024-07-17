import { z } from "zod";

export const TranslateFormSchema = z.object({
  input: z.string(),
  inputLanguage: z.string(),
  outputLanguage: z.string(),
  output: z.any(),
});

export type TranslateFormType = z.infer<typeof TranslateFormSchema>;
