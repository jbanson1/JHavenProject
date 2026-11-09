import type { Metadata } from "next";
import { site } from "@/site.config";
import { ContactForm } from "@/components/ContactForm";
import { IconClock, IconMail, IconPhone, IconPin } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Get a free, no-obligation guaranteed rent appraisal for your property, or enquire about a stay with ${site.name}.`,
};

export default function Contact() {
  return (
    <section className="section section--sand">
      <div className="container contact-grid">
        <div>
          <span className="pill-label">Contact</span>
          <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>Let&apos;s talk about your property</h1>
          <p className="lead">
            Tell us a little about your property and we&apos;ll get back to you within one working day to arrange a free, no-obligation appraisal.
          </p>
          <ul className="contact-list">
            <li>
              <span className="icon-badge"><IconMail /></span>
              <span><small>Email</small><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></span>
            </li>
            {site.contact.phone && (
              <li>
                <span className="icon-badge"><IconPhone /></span>
                <span><small>Phone</small><a href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>{site.contact.phone}</a></span>
              </li>
            )}
            <li>
              <span className="icon-badge"><IconClock /></span>
              <span><small>Hours</small>{site.contact.hours}</span>
            </li>
            <li>
              <span className="icon-badge"><IconPin /></span>
              <span><small>Areas</small>{site.areas.join(", ")}</span>
            </li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
