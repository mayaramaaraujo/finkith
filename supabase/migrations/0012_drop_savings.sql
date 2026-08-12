-- The savings feature is dropped.
--
-- `savings_entries` and `groups.savings_initial_balance` were created directly
-- in the Supabase dashboard and never had a migration, so they existed only on
-- the deployed database — invisible to this history, and never read or written
-- by any client.
--
-- `if exists` is load-bearing rather than defensive: a database built from
-- these migrations alone never had either object, so an unguarded drop would
-- fail on every fresh environment.
--
-- Data being discarded, recorded here so it survives in git if savings ever
-- come back: `savings_entries` is empty, and every group's
-- `savings_initial_balance` is 0.00 except "Casa Possamai"
-- (6cf283ad-f368-48e5-94f9-6f4c25d926f1), which holds 1000.00.

drop table if exists public.savings_entries;

alter table public.groups drop column if exists savings_initial_balance;
