import { NextResponse, type NextRequest } from "next/server";
import { validateEnquiry } from "@/lib/validate";
import { checkSpam } from "@/lib/spam";
import { sendEnquiry } from "@/lib/email";
import { emailDomainAcceptsMail } from "@/lib/email-check";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { site } from "@/site.config";

export const runtime = "nodejs";

/**
 * Every outcome writes one log line, so a submission can always be traced in
 * the runtime logs. Rejections record which check failed and which fields,
 * never what the visitor typed.
 */
function logRejection(reason: string, detail = "") {
  console.warn(`[contact] rejected (${reason})${detail ? `: ${detail}` : ""}`);
}

/**
 * Three submissions per ten minutes per IP (as on JMB Digital Forge). Enough for
 * a genuine visitor who resends after a typo; tight enough that a loop can't
 * drain the email quota.
 */
const RATE_LIMIT = { limit: 3, windowMs: 10 * 60 * 1000 };

export async function POST(req: NextRequest) {
  // Checked before parsing the body or doing any DNS or network work, so a
  // flood costs as little as possible.
  // If this line is missing for a test, the browser never sent the form at all.
  console.info("[contact] submission received");
  const ip = clientIp(req.headers);
  const { allowed, retryAfter } = rateLimit(ip, RATE_LIMIT);
  if (!allowed) {
    logRejection("rate limit", `retry after ${retryAfter}s`);
    return NextResponse.json(
      { ok: false, error: `Too many messages from this connection. Please wait a few minutes, or email us at ${site.contact.email}.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    logRejection("invalid request body");
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const result = validateEnquiry(body);
  if (!result.ok) {
    const { form, ...fieldErrors } = result.errors;
    if (form) logRejection("validation", form);
    else logRejection("validation", `fields ${Object.keys(fieldErrors).join(", ")}`);
    return NextResponse.json(
      form ? { ok: false, error: form } : { ok: false, errors: fieldErrors },
      { status: form ? 400 : 422 },
    );
  }
  const { enquiry } = result;

  const verdict = checkSpam({ ...result.spam, message: enquiry.message });
  if (verdict.spam) {
    // Pretend it worked so senders get no signal, but log it in full so a
    // genuine enquiry caught by mistake can still be answered by hand.
    console.warn(`[contact] dropped as spam (${verdict.reason}):`, JSON.stringify(enquiry));
    return NextResponse.json({ ok: true });
  }

  // Rejects typos and invented domains that pass the format check. Fails open
  // on DNS trouble (and after 3 seconds), so a real enquiry is never lost to it.
  if (!(await emailDomainAcceptsMail(enquiry.email))) {
    const domain = enquiry.email.slice(enquiry.email.lastIndexOf("@") + 1);
    logRejection("email domain has no mail server", domain);
    return NextResponse.json(
      { ok: false, errors: { email: `We could not find a mail server for "${domain}". Please check the address.` } },
      { status: 422 },
    );
  }

  try {
    await sendEnquiry(enquiry);
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return NextResponse.json(
      { ok: false, error: `Sorry, your message couldn't be sent right now. Please email us at ${site.contact.email}.` },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
