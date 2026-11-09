import type { Metadata } from "next";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How ${site.name} uses the personal information you share through this website.`,
};

// Template privacy notice for the demo. Have it reviewed before launch, and add
// the registered company details and ICO registration number once available.
export default function Privacy() {
  return (
    <section className="section">
      <div className="container prose">
        <span className="pill-label">Legal</span>
        <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>Privacy notice</h1>
        <p className="lead">This notice explains what personal information we collect through this website, why, and your rights.</p>

        <h2>Who we are</h2>
        <p>
          {site.legal.companyName}
          {site.legal.companyNumber && `, ${site.legal.companyNumber}`}. You can contact us at{" "}
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
        </p>

        <h2>What we collect</h2>
        <p>When you send an enquiry, we collect the details you enter: your name, email address, phone number (if given), property or stay details, and your message.</p>

        <h2>Why we use it</h2>
        <ul>
          <li>To reply to your enquiry and discuss your property or stay (our legitimate interest in responding to you, or steps you ask us to take before entering a contract).</li>
          <li>To keep a record of our correspondence.</li>
        </ul>
        <p>We do not sell your information or use it for unrelated marketing.</p>

        <h2>Who we share it with</h2>
        <p>Enquiries are delivered to our inbox by an email service provider acting on our behalf, and the website is hosted by a cloud provider. Both process data only on our instructions.</p>

        <h2>How long we keep it</h2>
        <p>We keep enquiries for up to 24 months, unless we enter into an agreement with you, in which case we keep records for as long as the law requires.</p>

        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or delete the information we hold about you, or object to how we use it, by emailing us. If you&apos;re unhappy with how we handle your data, you can complain to the Information Commissioner&apos;s Office (ico.org.uk).
        </p>

        <h2>Cookies</h2>
        <p>This website does not use tracking or advertising cookies.</p>
      </div>
    </section>
  );
}
