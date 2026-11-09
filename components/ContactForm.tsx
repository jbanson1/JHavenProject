"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BEDROOM_OPTIONS, PROPERTY_TYPES } from "@/lib/validate";
import { site } from "@/site.config";
import { IconArrow, IconCheck } from "./Icons";

type Status = "idle" | "sending" | "sent" | "error";

/** Landlord appraisal form. Guests are sent to Airbnb instead (see AirbnbCard). */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [prefill, setPrefill] = useState({ area: "", bedrooms: "" });
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
    setStatus("sending");
    setErrors({});
    setFormError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "landlord", startedAt: startedAt.current }),
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
        <p className="form-note">Takes about a minute. No obligation.</p>
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
          <label htmlFor="f-area">Property area or postcode</label>
          <input {...field("area")} key={`area-${prefill.area}`} defaultValue={prefill.area} required maxLength={100} placeholder="e.g. Walthamstow, E17" />
          {err("area")}
        </div>
      </div>

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
          <select {...field("bedrooms")} key={`bed-${prefill.bedrooms}`} defaultValue={prefill.bedrooms}>
            <option value="" disabled>Choose one</option>
            {BEDROOM_OPTIONS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-message">Message</label>
        <textarea
          {...field("message")}
          required
          maxLength={3000}
          placeholder="Tell us a little about the property: when it's available, its condition, anything we should know."
        />
        {err("message")}
      </div>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : <>Request my free appraisal <IconArrow /></>}
      </button>
      <p className="form-note">
        We only use your details to reply to this enquiry. See our <Link href="/privacy">privacy notice</Link>.
      </p>
    </form>
  );
}
