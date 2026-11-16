/**
 * Contact-form emails, sent through Resend's HTTP API (free tier: 100 emails a day).
 *
 * 1. The enquiry, to site.contact.email (info@inhavenest.com), with reply-to set
 *    to the landlord so answering is one click.
 * 2. A thank-you to the landlord, saying we'll be in touch soon, with reply-to
 *    set to info@inhavenest.com.
 *
 * CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL env vars override recipient and sender.
 * If RESEND_API_KEY isn't set, the enquiry is written to the server log instead.
 */
import { site } from "@/site.config";
import type { Enquiry } from "./validate";

export type DeliveryResult = { delivered: boolean; via: "email" | "log"; acknowledged: boolean };

type Email = { subject: string; html: string; text: string };

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function sender() {
  return process.env.CONTACT_FROM_EMAIL || site.contact.emailFrom;
}

/**
 * Resend's shared test sender (onboarding@resend.dev) can only deliver to the
 * Resend account's own address, so thank-you emails to landlords are only sent
 * once the sender is on a domain verified in Resend (e.g. inhavenest.com).
 */
export function canEmailVisitors(from = sender()) {
  return !/@resend\.dev>?\s*$/i.test(from);
}

export function enquiryRows(e: Enquiry): [string, string][] {
  const rows: [string, string][] = [
    ["Name", e.name],
    ["Email", e.email],
    ["Phone", e.phone],
    ["Area / postcode", e.area],
    ["Property type", e.propertyType],
    ["Bedrooms", e.bedrooms],
    ["Message", e.message],
  ];
  return rows.filter(([, v]) => v !== "");
}

export function enquirySubject(e: Enquiry): string {
  return `New landlord enquiry from ${e.name}${e.area ? ` (${e.area})` : ""}`;
}

/** First word of the name only, so the greeting can't carry a sentence of someone else's text. */
function firstName(name: string) {
  return name.split(/\s+/)[0].slice(0, 40);
}

/** "3-bedroom house", "studio flat / apartment" etc. Both values come from fixed lists. */
function propertyLabel(e: Enquiry) {
  const type = e.propertyType.toLowerCase();
  if (e.bedrooms === "Studio") return type === "studio" ? "studio" : `studio ${type}`;
  return `${e.bedrooms}-bedroom ${type}`;
}

/**
 * The thank-you email to the landlord.
 *
 * Only their first name and the two dropdown answers are echoed back. Nothing
 * else they typed is included, so the form can't be used to send someone
 * else's words to a third party's inbox from our address.
 */
export function acknowledgementEmail(e: Enquiry): Email {
  const name = firstName(e.name);
  const property = propertyLabel(e);
  const subject = `Thanks for getting in touch with ${site.name}`;

  const text = `Hi ${name},

Thank you for getting in touch about your ${property}. We've received your details and will be in contact within one working day to arrange a time to talk.

There's nothing more you need to do for now. If anything changes in the meantime, or you'd like to add anything, just reply to this email.

Kind regards,
The ${site.name} team
${site.contact.email}`;

  const p = 'style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#15212d;"';
  const html = `<!doctype html>
<html lang="en-GB">
<body style="margin:0;padding:0;background:#f5f3ee;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;font-family:Arial,Helvetica,sans-serif;">
        <tr><td style="padding:28px 32px 0;font-size:22px;font-weight:bold;color:#1f4266;">${escapeHtml(site.name)}</td></tr>
        <tr><td style="padding:24px 32px 8px;">
          <p ${p}>Hi ${escapeHtml(name)},</p>
          <p ${p}>Thank you for getting in touch about your ${escapeHtml(property)}. We&rsquo;ve received your details and will be in contact <strong>within one working day</strong> to arrange a time to talk.</p>
          <p ${p}>There&rsquo;s nothing more you need to do for now. If anything changes in the meantime, or you&rsquo;d like to add anything, just reply to this email.</p>
          <p style="margin:24px 0 0;font-size:16px;line-height:1.6;color:#15212d;">Kind regards,<br>The ${escapeHtml(site.name)} team</p>
        </td></tr>
        <tr><td style="padding:24px 32px 28px;">
          <hr style="border:none;border-top:1px solid #e5e2db;margin:0 0 16px;">
          <p style="margin:0;font-size:13px;line-height:1.5;color:#5d6874;">${escapeHtml(site.name)} &middot; <a href="mailto:${site.contact.email}" style="color:#1f4266;">${site.contact.email}</a><br>
          You&rsquo;re receiving this because you sent an enquiry through our website.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

function enquiryEmail(e: Enquiry): Email {
  const rows = enquiryRows(e);
  const html = `<h2 style="font-family:Georgia,serif">${escapeHtml(enquirySubject(e))}</h2>
<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="color:#666;vertical-align:top"><b>${escapeHtml(k)}</b></td><td style="white-space:pre-wrap">${k === "Phone" && e.phoneE164 ? `<a href="tel:${e.phoneE164}">${escapeHtml(v)}</a>` : escapeHtml(v)}</td></tr>`).join("\n")}
</table>
<p style="font-family:Arial,sans-serif;font-size:12px;color:#888">Sent from the ${escapeHtml(site.name)} website contact form. Reply to this email to answer ${escapeHtml(e.name)} directly.</p>`;
  return { subject: enquirySubject(e), html, text: rows.map(([k, v]) => `${k}: ${v}`).join("\n") };
}

async function send(key: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.ok ? null : `Resend responded ${res.status}: ${(await res.text()).slice(0, 300)}`;
}

export async function sendEnquiry(e: Enquiry): Promise<DeliveryResult> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || site.contact.email;
  const asText = enquiryRows(e).map(([k, v]) => `  ${k}: ${v}`).join("\n");

  if (!key) {
    console.info(`[contact] RESEND_API_KEY not set; enquiry logged only:\n${asText}`);
    return { delivered: false, via: "log", acknowledged: false };
  }

  const from = sender();
  const enquiry = enquiryEmail(e);
  const thanks = canEmailVisitors(from) ? acknowledgementEmail(e) : null;

  const [enquiryError, thanksError] = await Promise.all([
    send(key, { from, to: to.split(",").map((s) => s.trim()).filter(Boolean), reply_to: e.email, ...enquiry }),
    thanks ? send(key, { from, to: [e.email], reply_to: site.contact.email, ...thanks }) : Promise.resolve(null),
  ]);

  if (enquiryError) {
    // Keep the enquiry in the logs so it isn't lost if email delivery is misconfigured.
    console.error(`[contact] email delivery failed; enquiry details:\n${asText}`);
    throw new Error(enquiryError);
  }
  // The enquiry arrived, so a failed thank-you is logged rather than shown as an error.
  if (thanksError) console.error(`[contact] thank-you email failed: ${thanksError}`);

  // One line per delivered enquiry, so a test can be confirmed from the runtime logs.
  console.info(`[contact] enquiry emailed to ${to}; thank-you ${thanks ? (thanksError ? "failed" : "sent") : "not sent (unverified sender)"}`);
  return { delivered: true, via: "email", acknowledged: Boolean(thanks && !thanksError) };
}
