"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BEDROOM_OPTIONS, PROPERTY_TYPES, type EnquiryType } from "@/lib/validate";
import { site } from "@/site.config";
import { IconCheck } from "./Icons";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({ initialType = "landlord", allowSwitch = true }: { initialType?: EnquiryType; allowSwitch?: boolean }) {
  const [type, setType] = useState<EnquiryType>(initialType);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const startedAt = useRef<number>(0);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    setFormError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type, startedAt: startedAt.current }),
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
        <div className="icon-badge"><IconCheck /></div>
        <h3>Thank you, we&apos;ve got your message</h3>
        <p style={{ color: "var(--muted)" }}>
          {type === "landlord"
            ? "We'll be in touch within one working day to arrange a time to talk about your property."
            : "We'll get back to you within one working day with available homes and prices."}
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
      {allowSwitch && (
        <div className="segmented" role="group" aria-label="I am a">
          <button type="button" aria-pressed={type === "landlord"} onClick={() => setType("landlord")}>I&apos;m a landlord</button>
          <button type="button" aria-pressed={type === "guest"} onClick={() => setType("guest")}>I&apos;m looking to stay</button>
        </div>
      )}

      {formError && <div className="alert alert--error" role="alert">{formError}</div>}

      <div className="form-row">
        <div className="field">
          <label htmlFor="f-name">Your name</label>
          <input {...field("name")} autoComplete="name" required maxLength={100} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor="f-email">Email</label>
          <input {...field("email")} type="email" autoComplete="email" required maxLength={200} />
          {err("email")}
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="f-phone">Phone <span className="optional">(optional)</span></label>
          <input {...field("phone")} type="tel" autoComplete="tel" maxLength={30} />
          {err("phone")}
        </div>
        <div className="field">
          <label htmlFor="f-area">
            {type === "landlord" ? "Property area or postcode" : <>Preferred area <span className="optional">(optional)</span></>}
          </label>
          <input {...field("area")} required={type === "landlord"} maxLength={100} placeholder={type === "landlord" ? "e.g. Walthamstow, E17" : "e.g. near Canary Wharf"} />
          {err("area")}
        </div>
      </div>

      {type === "landlord" ? (
        <div className="form-row">
          <div className="field">
            <label htmlFor="f-propertyType">Property type</label>
            <select {...field("propertyType")} defaultValue="">
              <option value="" disabled>Choose one</option>
              {PROPERTY_TYPES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-bedrooms">Bedrooms</label>
            <select {...field("bedrooms")} defaultValue="">
              <option value="" disabled>Choose one</option>
              {BEDROOM_OPTIONS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
      ) : (
        <div className="form-row">
          <div className="field">
            <label htmlFor="f-dates">Dates <span className="optional">(optional)</span></label>
            <input {...field("dates")} maxLength={100} placeholder="e.g. 12–17 March" />
          </div>
          <div className="field">
            <label htmlFor="f-guests">Number of guests <span className="optional">(optional)</span></label>
            <input {...field("guests")} inputMode="numeric" maxLength={20} />
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="f-message">Message</label>
        <textarea
          {...field("message")}
          required
          maxLength={3000}
          placeholder={type === "landlord"
            ? "Tell us a little about the property: when it's available, its condition, anything we should know."
            : "Tell us about your trip: purpose, who's coming, anything you need."}
        />
        {err("message")}
      </div>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : type === "landlord" ? "Request my free appraisal" : "Send enquiry"}
      </button>
      <p className="form-note">
        We only use your details to reply to this enquiry. See our <Link href="/privacy">privacy notice</Link>.
      </p>
    </form>
  );
}
