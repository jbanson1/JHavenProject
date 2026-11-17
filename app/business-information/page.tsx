import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { Email, LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Business information",
  description: `Company details for ${site.legal.companyName}.`,
};

export default function BusinessInformation() {
  const l = site.legal;
  const rows: [string, React.ReactNode][] = [
    ["Company name", l.companyName],
    ["Company number", l.companyNumber],
    ["Registered in", l.registeredIn],
    ["Registered office", l.registeredOffice],
    ["Email", <Email key="e" />],
  ];
  return (
    <LegalPage title="Business information" intro={<>{site.name} is the trading name of {l.companyName}, a private limited company.</>}>
      <dl className="legal-details">
        {rows.filter(([, v]) => v).map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>

      <h2>What we do</h2>
      <p>
        We rent homes from landlords on fixed-term agreements, refurbish and furnish them, and manage them as serviced short and medium stays. Landlords receive a fixed monthly rent set out in a written agreement.
      </p>

      <h2>Contact</h2>
      <p>
        For enquiries about letting your property, please use our <Link href="/contact">contact form</Link>. For anything else, email <Email />.
      </p>
    </LegalPage>
  );
}
