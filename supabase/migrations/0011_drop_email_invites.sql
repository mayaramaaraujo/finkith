-- Invite-by-email was never finished: nothing ever wrote `invited_email` or
-- created a row with status 'invited', so the placeholder-member state was
-- unreachable — as was the group_members_insert policy added in 0001 (and
-- narrowed in 0010) whose only purpose was to let an active member create one.
-- Invites work by link (`invite_code` + join_group_by_code), which needs none
-- of this.
--
-- `status` itself stays: is_active_group_member/is_group_admin and every
-- membership query filter on it, and narrowing the check to the one value
-- those paths accept removes the dead state without rewriting the RLS helpers
-- the whole security model rests on.

drop policy "group_members_insert" on group_members;

-- No insert policy replaces it: the only two ways a membership is created are
-- create_group_with_owner and join_group_by_code, both security definer, both
-- running as the table owner and so unaffected by RLS. A client insert into
-- group_members is never legitimate.

alter table group_members drop column invited_email;

update group_members set status = 'active' where status <> 'active';

alter table group_members
  drop constraint group_members_status_check,
  add constraint group_members_status_check check (status = 'active');
