import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

/**
 * Anything this app can fail with: a PostgrestError from a query, an AuthError
 * from Supabase Auth, or a plain Error from the network layer. All three carry
 * a `message`; only the first two carry a `code`.
 */
export interface AppError {
  message: string;
  code?: string | null;
}

/**
 * The messages our own `security definer` functions raise, matched verbatim.
 *
 * They are literals in supabase/migrations/0005_join_group.sql, so this is a
 * hard coupling — but Postgres surfaces a RAISE as the generic P0001, which
 * says nothing about *which* rule fired. Changing a message there means
 * changing it here; giving those raises their own SQLSTATEs would break the
 * coupling properly, and is worth doing if a third case ever appears.
 */
const RAISED = {
  alreadyInGroup: "already in a group",
  invalidInvite: "Invalid or expired invite link",
  notAuthenticated: "Not authenticated",
} as const;

/** Postgres SQLSTATEs the client can actually provoke. */
const SQLSTATE = {
  uniqueViolation: "23505",
  checkViolation: "23514",
  foreignKeyViolation: "23503",
  insufficientPrivilege: "42501",
} as const;

function isOffline(error: AppError): boolean {
  // Supabase wraps a dead connection as AuthRetryableFetchError; undici and
  // the browser both phrase the underlying failure as some form of "fetch".
  return /failed to fetch|fetch failed|network|load failed/i.test(error.message);
}

/**
 * A message worth showing a user, for any failure the app can produce.
 *
 * Nothing a database or auth server says is fit to display as-is: it arrives
 * in English regardless of the reader's language, and it describes the schema
 * rather than what the person did. Everything recognised gets translated
 * copy; everything else falls back to the generic message, so an unexpected
 * failure still reads as a sentence instead of leaking internals.
 */
export function describeError(error: AppError | null | undefined, dict: Dictionary): string {
  if (!error) return dict.errors.generic;

  if (isOffline(error)) return dict.errors.offline;

  switch (error.code) {
    case SQLSTATE.uniqueViolation:
      return dict.errors.duplicateName;
    case SQLSTATE.insufficientPrivilege:
      return dict.errors.notAllowed;
    case SQLSTATE.checkViolation:
    case SQLSTATE.foreignKeyViolation:
      return dict.errors.invalidData;

    // Supabase Auth codes — stable identifiers, unlike its messages.
    case "invalid_credentials":
      return dict.errors.invalidCredentials;
    case "email_not_confirmed":
      return dict.errors.emailNotConfirmed;
    case "user_already_exists":
    case "email_exists":
      return dict.errors.emailAlreadyRegistered;
    case "weak_password":
      return dict.errors.weakPassword;
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return dict.errors.tooManyRequests;
  }

  // RLS rejections arrive as a message rather than 42501 on some paths.
  if (/row-level security/i.test(error.message)) return dict.errors.notAllowed;

  if (error.message.includes(RAISED.alreadyInGroup)) return dict.errors.alreadyInGroup;
  if (error.message.includes(RAISED.invalidInvite)) return dict.errors.invalidInvite;
  if (error.message.includes(RAISED.notAuthenticated)) return dict.errors.notAuthenticated;

  return dict.errors.generic;
}
