import { z } from "zod";

export const TranslateFormSchema = z.object({
  input: z.string(),
  inputLanguage: z.string(),
  outputLanguage: z.string(),
  output: z.string(),
});

export type TranslateFormType = z.infer<typeof TranslateFormSchema>;
