import { Resend } from "resend";

// finkith.com is verified at resend.com/domains, so this sender delivers to
// any recipient.
export const EMAIL_FROM = "Finkith <noreply@finkith.com>";

export const EMAIL_SENDING_ENABLED = true;

let resendClient: Resend | undefined;

// Constructing Resend() throws immediately if RESEND_API_KEY is unset. Every
// server action in groups/api/actions.ts shares one module, so a top-level
// `new Resend(...)` there would crash createGroup/joinGroupByCode/etc. too —
// not just the email-sending action — the moment the key is missing in an
// environment. Building the client lazily, only when sending is enabled and
// actually attempted, keeps that failure scoped to email sending alone.
export function getResendClient() {
  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}
