import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { JoinGroupCard } from "@/features/groups/components/JoinGroupCard";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import { LinkButton } from "@/shared/components/LinkButton";

interface JoinPageProps {
  params: Promise<{ code: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { code } = await params;

  const currentGroup = await getCurrentGroup();
  if (currentGroup) {
    redirect("/home");
  }

  const dict = getDictionary(await getLocale());

  const supabase = await createClient();
  const [{ data: group }, userRes] = await Promise.all([
    supabase.rpc("get_group_by_invite_code", { p_invite_code: code }).maybeSingle(),
    supabase.auth.getUser(),
  ]);

  if (!group) {
    return (
      <AuthShell title={dict.join.notFoundTitle} subtitle={dict.join.notFoundSubtitle} termsNotice={dict.auth.termsNotice}>
        <LinkButton href="/login" className="mt-2 w-full">
          {dict.join.backToSignIn}
        </LinkButton>
      </AuthShell>
    );
  }

  if (!userRes.data.user) {
    return (
      <AuthShell
        title={dict.join.joinGroupTitle(group.name)}
        subtitle={dict.join.signInSubtitle}
        termsNotice={dict.auth.termsNotice}
      >
        <div className="flex flex-col gap-3">
          <LinkButton href={`/login?next=/join/${code}`} className="w-full">
            {dict.join.signIn}
          </LinkButton>
          <LinkButton href={`/signup?next=/join/${code}`} variant="outline" className="w-full">
            {dict.join.createAccount}
          </LinkButton>
        </div>
      </AuthShell>
    );
  }

  return (
    <div
      className="flex flex-1 flex-col px-8 pb-16"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 4rem)" }}
    >
      <JoinGroupCard groupName={group.name} inviteCode={code} />
    </div>
  );
}
