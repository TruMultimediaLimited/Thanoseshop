import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().trim().min(3, "Enter a question."),
  answer: z.string().trim().min(3, "Enter an answer."),
  productId: z.string().uuid().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.coerce.boolean().default(true),
});
export type FaqInput = z.infer<typeof faqSchema>;
