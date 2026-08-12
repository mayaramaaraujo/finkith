import type { PostgrestError } from "@supabase/supabase-js";

/**
 * A query's result, or a thrown error.
 *
 * PostgREST reports failure by setting `error` and leaving `data` null, and
 * `data ?? []` flattens that into an empty list — so a database that's down
 * renders as "No bills yet" rather than as a problem, and the reader is
 * invited to re-enter everything they already have. Throwing hands the
 * failure to the nearest `error.tsx`, which says so and offers a retry.
 *
 * `query` names the call site; it reaches the server log and the error
 * digest, never the screen.
 */
export function unwrap<T>(result: { data: T; error: PostgrestError | null }, query: string): T {
  if (result.error) {
    throw new Error(`Supabase query failed (${query}): ${result.error.message}`, {
      cause: result.error,
    });
  }

  return result.data;
}
