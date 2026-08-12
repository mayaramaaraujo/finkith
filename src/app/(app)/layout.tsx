import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import { GROUP_MEMBER_COLUMNS, mapGroupMemberRow } from "@/features/groups/lib";
import { CATEGORY_COLUMNS, mapCategoryRow } from "@/features/categories/lib";
import { AppChrome } from "./_components/AppChrome";
import { unwrap } from "@/shared/lib/supabase/unwrap";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const currentGroup = await getCurrentGroup();

  if (!currentGroup) {
    redirect("/setup");
  }

  const supabase = await createClient();
  const [membersRes, categoriesRes] = await Promise.all([
    supabase
      .from("group_members")
      .select(GROUP_MEMBER_COLUMNS)
      .eq("group_id", currentGroup.groupId)
      .eq("status", "active")
      .order("created_at", { ascending: true }),
    supabase.from("categories").select(CATEGORY_COLUMNS).eq("group_id", currentGroup.groupId),
  ]);

  const members = (unwrap(membersRes, "layout members") ?? []).map(mapGroupMemberRow);
  const categories = (unwrap(categoriesRes, "layout categories") ?? []).map(mapCategoryRow);

  return (
    <AppChrome
      groupName={currentGroup.groupName}
      members={members}
      currentMemberId={currentGroup.memberId}
      currency={currentGroup.currency}
      categories={categories}
    >
      {children}
    </AppChrome>
  );
}
