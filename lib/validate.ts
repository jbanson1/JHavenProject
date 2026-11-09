/** Server-side validation for the contact form. Never trust the browser. */

export type EnquiryType = "landlord" | "guest";

export type Enquiry = {
  type: EnquiryType;
  name: string;
  email: string;
  phone: string;
  message: string;
  /** Landlord fields */
  area: string;
  propertyType: string;
  bedrooms: string;
  /** Guest fields */
  dates: string;
  guests: string;
};

/** Fields the form sends that are only used for spam checks. */
export type SpamFields = { honeypot: string; startedAt: number | null };

export type ValidationResult =
  | { ok: true; enquiry: Enquiry; spam: SpamFields }
  | { ok: false; errors: Record<string, string> };

export const PROPERTY_TYPES = ["Flat / apartment", "House", "HMO", "Studio", "Other"] as const;
export const BEDROOM_OPTIONS = ["Studio", "1", "2", "3", "4", "5+"] as const;

const LIMITS = { name: 100, email: 200, phone: 30, message: 3000, short: 100 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s-]{7,30}$/;

function str(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  // Collapse control characters (blocks header injection in the email) and trim.
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

export function validateEnquiry(body: unknown): ValidationResult {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const type: EnquiryType = b.type === "guest" ? "guest" : "landlord";
  const name = str(b.name, LIMITS.name).replace(/[\r\n]+/g, " ");
  const email = str(b.email, LIMITS.email).replace(/[\r\n]+/g, "");
  const phone = str(b.phone, LIMITS.phone);
  const message = str(b.message, LIMITS.message);
  const area = str(b.area, LIMITS.short);
  const propertyType = str(b.propertyType, LIMITS.short);
  const bedrooms = str(b.bedrooms, LIMITS.short);
  const dates = str(b.dates, LIMITS.short);
  const guests = str(b.guests, LIMITS.short);

  if (name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (phone && !PHONE_RE.test(phone)) errors.phone = "Please enter a valid phone number, or leave it blank.";
  if (type === "landlord" && area.length < 2) errors.area = "Which area or postcode is the property in?";
  if (message.length < 10) errors.message = "Please add a short message (at least 10 characters).";

  if (Object.keys(errors).length) return { ok: false, errors };

  const startedAt = typeof b.startedAt === "number" && Number.isFinite(b.startedAt) ? b.startedAt : null;
  return {
    ok: true,
    enquiry: { type, name, email, phone, message, area, propertyType, bedrooms, dates, guests },
    spam: { honeypot: typeof b.company === "string" ? b.company : "", startedAt },
  };
}
