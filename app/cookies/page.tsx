import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { Email, LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie notice",
  description: `How the ${site.name} website uses cookies and similar technologies.`,
};

export default function Cookies() {
  return (
    <LegalPage title="Cookie notice" intro="This website does not set cookies to track you, measure visits or show you adverts.">
      <h2>What cookies are</h2>
      <p>
        Cookies are small text files a website stores on your device. Similar technologies, such as local storage, can also store or read information in your browser.
      </p>

      <h2>What this website uses</h2>
      <p>
        We do not set any cookies, and we do not use analytics, advertising or social-media tracking tools. Our fonts and images are served from our own website, so loading a page does not send your details to font or image services.
      </p>
      <p>
        Our hosting provider may use strictly necessary technical measures to deliver pages securely and protect the site from attacks. These do not identify you for marketing and do not need your consent.
      </p>

      <h2>Links to other websites</h2>
      <p>
        If you follow a link from our site to another website, such as a booking platform, that website may set its own cookies. Its own cookie policy applies.
      </p>

      <h2>If this changes</h2>
      <p>
        If we ever add analytics or other non-essential cookies, we will update this notice and ask for your consent before they are used.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can view, block or delete cookies in your browser settings. For more about how we handle personal information, see our <Link href="/privacy">privacy notice</Link>. Questions about this notice can be sent to <Email />.
      </p>
    </LegalPage>
  );
}
