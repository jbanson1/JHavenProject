/**
 * Server-side validation for the contact form. Never trust the browser.
 *
 * The rules are the JMB Digital Forge contact form's (type pinning, hard
 * length caps, the Forge email pattern, libphonenumber phone checks), applied
 * to this form's fields:
 *   Required: name, email, property type, bedrooms.
 *   Optional: area, phone (validated against its country when given), message.
 *
 * The email domain's mail records are checked separately in the route
 * (lib/email-check.ts), since that needs a DNS lookup.
 */
import { isWellFormedEmail } from "./email-check";
import { normalisePhone } from "./phone-server";
import { DEFAULT_COUNTRY, findCountry } from "./countries";
import { BEDROOM_OPTIONS, PROPERTY_TYPES } from "./options";

/** A landlord's appraisal request. */
export type Enquiry = {
  name: string;
  email: string;
  /** International format for display, e.g. "+44 7911 123456". Empty when not given. */
  phone: string;
  /** E.164, e.g. "+447911123456", for tel: links. Empty when not given. */
  phoneE164: string;
  message: string;
  area: string;
  propertyType: string;
  bedrooms: string;
};

/** Fields the form sends that are only used for spam checks. */
export type SpamFields = { honeypot: string; startedAt: number | null };

export type ValidationResult =
  | { ok: true; enquiry: Enquiry; spam: SpamFields }
  | { ok: false; errors: Record<string, string> };

export { BEDROOM_OPTIONS, PROPERTY_TYPES };

/**
 * Caps on every free-text field. Over-long input is refused, not truncated,
 * so nothing a sender wrote is silently cut off (Forge behaviour).
 */
export const LIMITS = { name: 100, email: 254, phone: 32, message: 5000, short: 100 } as const;

const TEXT_FIELDS = ["name", "email", "phone", "phoneCountry", "message", "area", "propertyType", "bedrooms"] as const;

function clean(v: string): string {
  // Strip control characters (blocks header injection in the email) and trim.
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

export function validateEnquiry(body: unknown): ValidationResult {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  // Everything arriving here is unknown JSON, so each field is pinned to the
  // type it is used as before any of it is trusted.
  for (const f of TEXT_FIELDS) {
    if (b[f] !== undefined && b[f] !== null && typeof b[f] !== "string") {
      return { ok: false, errors: { form: "Those details were not in the expected format." } };
    }
  }
  const raw = (f: (typeof TEXT_FIELDS)[number]) => clean((b[f] as string | undefined) ?? "");

  const name = raw("name").replace(/[\r\n]+/g, " ");
  const email = raw("email").replace(/[\r\n]+/g, "");
  const phoneInput = raw("phone");
  const phoneCountry = raw("phoneCountry") || DEFAULT_COUNTRY;
  const message = raw("message");
  const area = raw("area");
  const propertyType = raw("propertyType");
  const bedrooms = raw("bedrooms");

  if (
    name.length > LIMITS.name || email.length > LIMITS.email || phoneInput.length > LIMITS.phone ||
    message.length > LIMITS.message || area.length > LIMITS.short
  ) {
    return { ok: false, errors: { form: "That message is longer than we can accept. Please shorten it and try again." } };
  }

  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = "Please tell us your name.";
  if (!email) errors.email = "Please enter your email address.";
  else if (!isWellFormedEmail(email)) errors.email = "That email address does not look right. Please check and try again.";

  let phone = "";
  let phoneE164 = "";
  if (phoneInput) {
    const result = normalisePhone(phoneInput, phoneCountry);
    if (result.ok) {
      phone = result.display;
      phoneE164 = result.e164;
    } else if (result.reason === "country") {
      errors.phone = "Please choose a country for your phone number.";
    } else {
      const country = findCountry(phoneCountry);
      errors.phone = `That phone number does not look right${country ? ` for ${country.name}` : ""}. Please check it, or leave it blank.`;
    }
  }

  if (!(PROPERTY_TYPES as readonly string[]).includes(propertyType)) errors.propertyType = "Please choose the property type.";
  if (!(BEDROOM_OPTIONS as readonly string[]).includes(bedrooms)) errors.bedrooms = "Please choose the number of bedrooms.";

  if (Object.keys(errors).length) return { ok: false, errors };

  const startedAt = typeof b.startedAt === "number" && Number.isFinite(b.startedAt) ? b.startedAt : null;
  return {
    ok: true,
    enquiry: { name, email, phone, phoneE164, message, area, propertyType, bedrooms },
    // Only the hp_ref field counts. The old "company" honeypot is ignored because
    // browser autofill fills fields with that name.
    spam: { honeypot: typeof b.hp_ref === "string" ? b.hp_ref : "", startedAt },
  };
}
