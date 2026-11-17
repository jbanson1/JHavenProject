import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { CompanyLine, Email, LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Website terms",
  description: `The terms that apply when you use the ${site.name} website.`,
};

export default function Terms() {
  return (
    <LegalPage title="Website terms" intro={<>These terms apply when you use the {site.name} website. By using the site, you agree to use it lawfully and not to interfere with how it works or its security.</>}>
      <h2>Who we are</h2>
      <p>
        This website is run by <CompanyLine />. In these terms, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean {site.legal.companyName}. You can contact us at <Email />.
      </p>

      <h2>What the website is for</h2>
      <p>
        The site explains our rent-to-rent service, where we rent homes from landlords on fixed-term agreements and manage them as short-stay accommodation. It is for general information only. Nothing on the site is an offer, a quotation, financial or legal advice, or a promise of any particular rent, occupancy or result.
      </p>

      <h2>Appraisals and agreements</h2>
      <p>
        Asking for an appraisal through the site is free and does not commit you or us to anything. Any arrangement for your property, including the rent, the length of the agreement and who is responsible for what, will only be agreed in a separate written agreement that we both sign. If anything on this website differs from that agreement, the agreement applies.
      </p>
      <p>
        Before entering into an agreement you should check that it is allowed under your mortgage, lease, insurance and any local planning rules, and take independent advice if you need it. We will help you with these checks, but they remain your responsibility as the owner.
      </p>

      <h2>Guests and bookings</h2>
      <p>
        Stays in our homes are booked through third-party platforms such as Airbnb and Booking.com, and those bookings are governed by the platform&apos;s own terms and by our house rules for each home. These website terms do not create a booking.
      </p>

      <h2>Accuracy and availability</h2>
      <p>
        We aim to keep the site accurate and available, but we do not promise that it will always be complete, current, uninterrupted or free from errors. Photographs on the site may be illustrative and are not necessarily of homes we manage.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Unless stated otherwise, the website&apos;s text, design, branding and code are owned by or licensed to {site.legal.companyName}. Some photographs are used under the Unsplash licence. You may view the site and share links to it, but you must not copy, republish, sell or adapt its content without our permission.
      </p>

      <h2>Your use of the site</h2>
      <p>
        You must not use the site to send spam or anything unlawful, misleading or harmful, try to gain unauthorised access to it, or disrupt it, for example by sending automated or repeated form submissions. We may block submissions or access that appear to be misuse.
      </p>

      <h2>Links to other websites</h2>
      <p>
        Links to other websites are provided for convenience. We do not control those sites and are not responsible for their content, availability or privacy practices.
      </p>

      <h2>Liability</h2>
      <p>
        Nothing in these terms limits or excludes liability that cannot lawfully be limited or excluded, including liability for death or personal injury caused by negligence, or for fraud or fraudulent misrepresentation. Subject to that, we are not liable for any loss arising from your use of, or reliance on, this informational website, including indirect or consequential loss and loss of income or profit.
      </p>

      <h2>Privacy</h2>
      <p>
        How we use any personal information you send us is explained in our <Link href="/privacy">privacy notice</Link>.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The version on this page, with the date at the top, is the one that applies.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the law of England and Wales, and the courts of England and Wales have jurisdiction, subject to any mandatory rights that apply to you where you live.
      </p>
    </LegalPage>
  );
}
