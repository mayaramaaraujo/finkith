import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeError } from "@/shared/lib/errors";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import { LOCALES } from "@/shared/lib/i18n/config";

const dict = getDictionary("en");

describe("describeError", () => {
  it("translates the SQLSTATEs a client can provoke", () => {
    assert.equal(
      describeError({ message: "duplicate key value", code: "23505" }, dict),
      dict.errors.duplicateName,
    );
    assert.equal(
      describeError({ message: "permission denied", code: "42501" }, dict),
      dict.errors.notAllowed,
    );
    assert.equal(
      describeError({ message: "violates check constraint", code: "23514" }, dict),
      dict.errors.invalidData,
    );
  });

  it("translates Supabase Auth codes", () => {
    assert.equal(
      describeError({ message: "Invalid login credentials", code: "invalid_credentials" }, dict),
      dict.errors.invalidCredentials,
    );
    assert.equal(
      describeError({ message: "Email not confirmed", code: "email_not_confirmed" }, dict),
      dict.errors.emailNotConfirmed,
    );
    assert.equal(
      describeError({ message: "over rate limit", code: "over_email_send_rate_limit" }, dict),
      dict.errors.tooManyRequests,
    );
  });

  it("recognises what our own database functions raise", () => {
    // Verbatim from supabase/migrations/0005_join_group.sql — if these stop
    // matching, the user gets the generic message instead of the real reason.
    assert.equal(
      describeError({ message: "You're already in a group", code: "P0001" }, dict),
      dict.errors.alreadyInGroup,
    );
    assert.equal(
      describeError({ message: "Invalid or expired invite link", code: "P0001" }, dict),
      dict.errors.invalidInvite,
    );
    assert.equal(
      describeError({ message: "Not authenticated", code: "P0001" }, dict),
      dict.errors.notAuthenticated,
    );
  });

  it("catches an RLS rejection that arrives as prose", () => {
    assert.equal(
      describeError({ message: "new row violates row-level security policy" }, dict),
      dict.errors.notAllowed,
    );
  });

  it("reads a dead connection as being offline", () => {
    assert.equal(describeError({ message: "TypeError: Failed to fetch" }, dict), dict.errors.offline);
    assert.equal(describeError({ message: "fetch failed" }, dict), dict.errors.offline);
  });

  it("never leaks an unrecognised message to the reader", () => {
    const leaky = 'relation "public.bills" does not exist';

    assert.equal(describeError({ message: leaky, code: "42P01" }, dict), dict.errors.generic);
    assert.equal(describeError(null, dict), dict.errors.generic);
    assert.equal(describeError(undefined, dict), dict.errors.generic);
  });

  it("answers in the reader's own language", () => {
    for (const locale of LOCALES) {
      const localeDict = getDictionary(locale);
      const message = describeError({ message: "boom", code: "23505" }, localeDict);

      assert.equal(message, localeDict.errors.duplicateName);
      assert.notEqual(message.trim(), "");
    }
  });
});
