import { z } from "zod";

export const regionSchema = z.object({
  name: z.string().trim().min(2, "Enter a name."),
  code: z.string().trim().min(2, "Enter a code.").toUpperCase(),
  flagIconUrl: z.string().trim().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});
export type RegionInput = z.infer<typeof regionSchema>;
