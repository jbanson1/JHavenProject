/**
 * Sends an enquiry by email through Resend's HTTP API (free tier: 100 emails a day).
 * If RESEND_API_KEY isn't set, the enquiry is written to the server log instead,
 * so the demo works with no setup at all.
 */
import { site } from "@/site.config";
import type { Enquiry } from "./validate";

export type DeliveryResult = { delivered: boolean; via: "email" | "log" };

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function enquiryRows(e: Enquiry): [string, string][] {
  const rows: [string, string][] = [
    ["Enquiry type", e.type === "landlord" ? "Landlord (property)" : "Guest (stay)"],
    ["Name", e.name],
    ["Email", e.email],
    ["Phone", e.phone],
  ];
  if (e.type === "landlord") {
    rows.push(["Area / postcode", e.area], ["Property type", e.propertyType], ["Bedrooms", e.bedrooms]);
  } else {
    rows.push(["Dates", e.dates], ["Guests", e.guests], ["Preferred area", e.area]);
  }
  rows.push(["Message", e.message]);
  return rows.filter(([, v]) => v !== "");
}

export function enquirySubject(e: Enquiry): string {
  return e.type === "landlord"
    ? `New landlord enquiry: ${e.area || "property"} (${e.name})`
    : `New guest enquiry from ${e.name}`;
}

export async function sendEnquiry(e: Enquiry): Promise<DeliveryResult> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const rows = enquiryRows(e);

  if (!key || !to) {
    console.info("[contact] RESEND_API_KEY/CONTACT_TO_EMAIL not set; enquiry logged only:\n" +
      rows.map(([k, v]) => `  ${k}: ${v}`).join("\n"));
    return { delivered: false, via: "log" };
  }

  const html = `<h2 style="font-family:Georgia,serif">${escapeHtml(enquirySubject(e))}</h2>
<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="color:#666;vertical-align:top"><b>${escapeHtml(k)}</b></td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`).join("\n")}
</table>
<p style="font-family:Arial,sans-serif;font-size:12px;color:#888">Sent from the ${escapeHtml(site.name)} website contact form. Reply to this email to answer ${escapeHtml(e.name)} directly.</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || `${site.name} website <onboarding@resend.dev>`,
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: e.email,
      subject: enquirySubject(e),
      html,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  return { delivered: true, via: "email" };
}
