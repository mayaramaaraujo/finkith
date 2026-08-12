import type { Database } from "@/shared/lib/supabase/database.types";
import type { GroupMember } from "@/features/groups/types";

export const GROUP_MEMBER_COLUMNS =
  "id, group_id, user_id, display_name, role, color_index, status, created_at" as const;

type GroupMemberRow = Database["public"]["Tables"]["group_members"]["Row"];

export function mapGroupMemberRow(row: GroupMemberRow): GroupMember {
  return {
    id: row.id,
    groupId: row.group_id,
    userId: row.user_id,
    displayName: row.display_name,
    role: row.role as "admin" | "member",
    colorIndex: row.color_index,
    status: row.status as "active",
    createdAt: row.created_at,
  };
}
