import { z } from "zod";

export const announcementSchema = z.object({
  message: z.string().trim().min(2, "Enter the announcement text."),
  linkUrl: z.string().trim().optional().or(z.literal("")),
  isActive: z.coerce.boolean().default(true),
  startsAt: z.string().trim().optional().or(z.literal("")),
  endsAt: z.string().trim().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
});
export type AnnouncementInput = z.infer<typeof announcementSchema>;
