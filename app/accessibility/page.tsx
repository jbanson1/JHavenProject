import type { Metadata } from "next";
import { site } from "@/site.config";
import { Email, LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description: `How we make the ${site.name} website usable for as many people as possible.`,
};

export default function Accessibility() {
  return (
    <LegalPage title="Accessibility statement" intro={<>We want the {site.name} website to be usable by as many people as possible, including people who use screen readers, keyboard navigation, magnification or other assistive technology.</>}>
      <h2>Our approach</h2>
      <p>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. In particular, the site:</p>
      <ul>
        <li>can be used with a keyboard alone, with a visible focus outline and a &ldquo;skip to content&rdquo; link;</li>
        <li>uses clear headings, labelled form fields and error messages that are linked to the field they describe;</li>
        <li>has text and colour combinations chosen for readable contrast;</li>
        <li>adapts to small screens and to text enlarged up to 200%;</li>
        <li>reduces movement for visitors whose device is set to reduce motion.</li>
      </ul>

      <h2>Known limitations</h2>
      <p>
        Some photographs are decorative and are not described to screen readers. We have not yet had the site independently audited, and some parts may not meet every requirement. We review accessibility whenever we change the site.
      </p>

      <h2>Tell us about a problem</h2>
      <p>
        If you have difficulty using any part of the site, or need information in a different format, email <Email /> with the page address and a description of the problem. We will reply within five working days and do our best to help.
      </p>
    </LegalPage>
  );
}
