import { NextResponse, type NextRequest } from "next/server";
import { validateEnquiry } from "@/lib/validate";
import { checkSpam } from "@/lib/spam";
import { sendEnquiry } from "@/lib/email";
import { rateLimited } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages from your connection. Please try again in a few minutes, or email us." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const result = validateEnquiry(body);
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });

  const verdict = checkSpam({ ...result.spam, name: result.enquiry.name, message: result.enquiry.message });
  if (verdict.spam) {
    // Pretend it worked so bots get no signal; just note it in the log.
    console.info(`[contact] dropped as spam (${verdict.reason}) from ${ip}`);
    return NextResponse.json({ ok: true });
  }

  try {
    await sendEnquiry(result.enquiry);
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return NextResponse.json(
      { ok: false, error: "Sorry, your message couldn't be sent right now. Please email us instead." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
