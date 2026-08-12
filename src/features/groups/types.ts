import * as z from "zod";
import { en } from "@/shared/lib/i18n/dictionaries/en";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

export type GroupMember = {
  id: string;
  groupId: string;
  userId: string | null;
  displayName: string;
  role: "admin" | "member";
  colorIndex: number;
  status: "active";
  createdAt: string;
};

export function createGroupSchemaFor(dict: Dictionary) {
  return z.object({
    name: z.string().min(1, dict.setup.validation.nameRequired),
  });
}

/** Default English schema, used for server-side re-validation in Server Actions. */
export const createGroupSchema = createGroupSchemaFor(en);

export type CreateGroupValues = z.infer<typeof createGroupSchema>;
