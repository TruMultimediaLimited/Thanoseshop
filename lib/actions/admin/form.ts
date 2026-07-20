/**
 * FormData.get() returns null for a field that simply isn't present in the
 * submitted form — not just for one that was submitted empty. Any input
 * rendered conditionally (a toggle-gated field, a tab panel, etc.) hits this
 * the moment it's not in the DOM at submit time. Zod's optional-string
 * schemas (`z.string().optional().or(z.literal(""))`) accept undefined or
 * "", but not null, so an unguarded formData.get() feeding straight into
 * safeParse() fails with a generic "Invalid input" the moment that happens.
 * Every admin form parser should read string fields through this instead.
 */
export function formString(formData: FormData, key: string): string {
  return formData.get(key)?.toString() ?? "";
}
