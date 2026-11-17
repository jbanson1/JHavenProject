import type { ReactNode } from "react";
import Link from "next/link";
import { site } from "@/site.config";

/** Date the legal pages were last reviewed. Update it whenever their wording changes. */
export const LEGAL_UPDATED = "17 November 2026";

export const legalLinks = [
  { href: "/terms", label: "Website terms" },
  { href: "/privacy", label: "Privacy notice" },
  { href: "/cookies", label: "Cookie notice" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/business-information", label: "Business information" },
];

/** Shared layout for the legal pages (adapted from the JMB Digital Forge site). */
export function LegalPage({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <section className="section">
      <div className="container prose">
        <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>{title}</h1>
        <p className="legal-updated">Last updated: {LEGAL_UPDATED}</p>
        <p className="lead">{intro}</p>
        {children}
        <nav className="legal-nav" aria-label="Legal pages">
          {legalLinks.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

/** "Inhavenest Ltd, a company registered in England and Wales (company no. …)" */
export function CompanyLine() {
  const l = site.legal;
  return (
    <>
      {l.companyName}
      {l.companyNumber && `, a company registered in ${l.registeredIn} (company no. ${l.companyNumber})`}
      {l.registeredOffice && `, with its registered office at ${l.registeredOffice}`}
    </>
  );
}

export function Email() {
  return <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>;
}
