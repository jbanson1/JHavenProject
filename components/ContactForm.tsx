"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BEDROOM_OPTIONS, PROPERTY_TYPES } from "@/lib/options";
import { COUNTRIES, DEFAULT_COUNTRY, findCountry } from "@/lib/countries";
import { isPlausiblePhone, sanitisePhoneInput } from "@/lib/phone";
import { site } from "@/site.config";

type Status = "idle" | "sending" | "sent" | "error";

/** Landlord appraisal form. Required: name, email, property type, bedrooms. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [prefill, setPrefill] = useState({ area: "", bedrooms: "" });
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<string>(DEFAULT_COUNTRY);
  const dialCode = findCountry(phoneCountry)?.dial ?? "";

  function clearError(name: string) {
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  }

  /**
   * Keeps the field to what a phone number can contain while leaving the
   * grouping people type (from JMB Digital Forge). The server re-derives and
   * validates the number anyway, so this is for legibility, not for trust.
   */
  function onPhoneChange(value: string) {
    setPhone(value.replace(/[^\d+()\s.-]/g, ""));
    clearError("phone");
  }

  /** Only a digit-count check; the server checks the country's numbering plan. */
  function onPhoneBlur() {
    if (phone && !isPlausiblePhone(phone)) {
      setErrors((prev) => ({ ...prev, phone: "That does not look like enough digits for a phone number." }));
    }
  }
  const startedAt = useRef<number>(0);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    // Carry over the answers from the home page's quick appraisal card.
    const q = new URLSearchParams(window.location.search);
    const bedrooms = q.get("bedrooms") ?? "";
    setPrefill({
      area: (q.get("area") ?? "").slice(0, 100),
      bedrooms: (BEDROOM_OPTIONS as readonly string[]).includes(bedrooms) ? bedrooms : "",
    });
  }, []);
  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError("");
    if (phone && !isPlausiblePhone(phone)) {
      setErrors({ phone: "Please check the phone number, or leave it blank." });
      return;
    }
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, phone: phone ? sanitisePhoneInput(phone) : "", phoneCountry, startedAt: startedAt.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("sent");
        return;
      }
      if (json.errors) setErrors(json.errors);
      setFormError(json.error ?? (json.errors ? "Please check the highlighted fields." : "Something went wrong. Please try again."));
      setStatus("error");
    } catch {
      setFormError(`We couldn't send your message. Please check your connection, or email ${site.contact.email}.`);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card form-success" ref={successRef} tabIndex={-1} role="status">
        <h3>Thank you, we&apos;ve got your message</h3>
        <p style={{ color: "var(--muted)" }}>
          We&apos;ll be in touch within one working day to arrange a time to talk about your property.
        </p>
      </div>
    );
  }

  const field = (name: string) => ({
    id: `f-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `e-${name}` : undefined,
  });
  const err = (name: string) => errors[name] && <span className="field-error" id={`e-${name}`}>{errors[name]}</span>;

  return (
    <form className="card form" onSubmit={onSubmit} noValidate>
      <div>
        <h2 style={{ fontSize: "1.5rem", marginBottom: 4 }}>Request a free appraisal</h2>
        <p className="form-note">No obligation. We reply within one working day.</p>
      </div>

      {formError && <div className="alert alert--error" role="alert">{formError}</div>}

      <div className="form-row">
        <div className="field">
          <label htmlFor="f-name">Your name</label>
          <input {...field("name")} autoComplete="name" required maxLength={100} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor="f-email">Email</label>
          <input {...field("email")} type="email" autoComplete="email" required maxLength={254} />
          {err("email")}
        </div>
      </div>

      <div className="form-row form-row--phone">
        <div className="field">
          <label htmlFor="f-phoneCountry">Country</label>
          <select id="f-phoneCountry" value={phoneCountry} onChange={(e) => { setPhoneCountry(e.target.value); clearError("phone"); }}>
            {COUNTRIES.map((c) => (
              <option key={c.iso} value={c.iso}>{c.name} (+{c.dial})</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-phone">Phone <span className="optional">(optional)</span></label>
          <div className="phone-field">
            <span className="phone-field__dial" aria-hidden="true">+{dialCode}</span>
            <input
              id="f-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              maxLength={32}
              placeholder="7911 123456"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              onBlur={onPhoneBlur}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "e-phone" : undefined}
            />
          </div>
          {err("phone")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-area">Area or postcode <span className="optional">(optional)</span></label>
        <input {...field("area")} key={`area-${prefill.area}`} defaultValue={prefill.area} maxLength={100} placeholder="e.g. Walthamstow, E17" />
        {err("area")}
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="f-propertyType">Property type</label>
          <select {...field("propertyType")} defaultValue="" required>
            <option value="" disabled>Choose one</option>
            {PROPERTY_TYPES.map((p) => <option key={p}>{p}</option>)}
          </select>
          {err("propertyType")}
        </div>
        <div className="field">
          <label htmlFor="f-bedrooms">Bedrooms</label>
          <select {...field("bedrooms")} key={`bed-${prefill.bedrooms}`} defaultValue={prefill.bedrooms} required>
            <option value="" disabled>Choose one</option>
            {BEDROOM_OPTIONS.map((b) => <option key={b}>{b}</option>)}
          </select>
          {err("bedrooms")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-message">Message <span className="optional">(optional)</span></label>
        <textarea
          {...field("message")}
          maxLength={5000}
          placeholder="Tell us a little about the property: when it's available, its condition, anything we should know."
        />
        {err("message")}
      </div>

      {/* Honeypot: hidden from people, irresistible to bots. Deliberately given a
          name and label browsers don't autofill (a field called "company" was being
          filled by Chrome autofill, so real enquiries were dropped as spam). */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="f-hp">Leave this field empty</label>
        <input id="f-hp" name="hp_ref" type="text" tabIndex={-1} autoComplete="off" data-1p-ignore="true" data-lpignore="true" data-bwignore="true" data-form-type="other" />
      </div>

      <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send"}
      </button>
      <p className="form-note">
        We only use your details to reply to this enquiry. See our <Link href="/privacy">privacy notice</Link>.
      </p>
    </form>
  );
}
