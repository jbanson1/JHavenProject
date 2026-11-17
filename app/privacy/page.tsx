import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { CompanyLine, Email, LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How ${site.name} uses the personal information you share through this website.`,
};

// Have this reviewed before relying on it, and add the ICO registration number
// once the data protection fee has been paid.
export default function Privacy() {
  return (
    <LegalPage title="Privacy notice" intro="This notice explains what personal information we collect through this website, how we use it, who we share it with and your rights.">
      <h2>Who we are</h2>
      <p>
        <CompanyLine /> is the controller of the personal information described here. You can contact us about anything in this notice at <Email />.
      </p>

      <h2>What we collect</h2>
      <p>When you send an enquiry through the contact form, we collect:</p>
      <ul>
        <li>your name and email address;</li>
        <li>your phone number and its country, if you give them;</li>
        <li>details of your property: its type, number of bedrooms and, if you give it, its area or postcode;</li>
        <li>anything you write in your message.</li>
      </ul>
      <p>
        When you use the site, our hosting provider also receives basic technical information such as your IP address, browser type and the time of each request. We use your IP address briefly to limit how often the form can be sent from one connection, which helps stop spam. It is held in memory for no more than ten minutes and is not stored with your enquiry.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To reply to your enquiry and arrange a free appraisal, and to send you an email confirming we have received it.</li>
        <li>To discuss, enter into and manage an agreement for your property, if you decide to go ahead.</li>
        <li>To check that the email address you give can receive mail. We look up the mail records of its domain (the part after the @); no other information is shared in that lookup.</li>
        <li>To keep the website secure and protect the form from spam and misuse.</li>
        <li>To keep records of our correspondence and meet our legal and accounting obligations.</li>
      </ul>
      <p>We do not sell your information, and we do not use it for marketing unless you have asked us to.</p>

      <h2>Our lawful bases</h2>
      <p>
        We rely on our legitimate interests in responding to enquiries, running our business and keeping the website secure. Where you ask us to take steps before entering into an agreement with you, we rely on that as the basis instead. Where the law requires your consent, for example for marketing emails, we will ask for it first.
      </p>

      <h2>Who we share it with</h2>
      <p>We use trusted service providers who act on our instructions and only use your information to provide their service to us:</p>
      <ul>
        <li><strong>Vercel</strong> hosts the website and processes the technical request data described above. It keeps short-lived server logs, which can include the details of an enquiry if our spam filter catches it or a technical problem stops it being delivered, so that a genuine enquiry is not lost.</li>
        <li><strong>Resend</strong> delivers enquiry emails to our inbox and sends your confirmation email.</li>
        <li>Our <strong>email provider</strong> stores the enquiries we receive.</li>
      </ul>
      <p>
        We may also share information with professional advisers, or where the law requires it. Some of these providers are based in, or use servers in, the United States or other countries outside the UK. Where that happens, the transfer is protected by safeguards recognised under UK data protection law, such as the UK International Data Transfer Addendum or the UK Extension to the EU-US Data Privacy Framework.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiries for up to 24 months after our last contact with you, unless we enter into an agreement with you. In that case we keep the records we need for the length of the agreement and for six years after it ends, to meet legal, tax and accounting requirements.
      </p>

      <h2>Your rights</h2>
      <p>Under UK data protection law you can ask us to:</p>
      <ul>
        <li>give you a copy of the information we hold about you;</li>
        <li>correct information that is wrong or incomplete;</li>
        <li>delete your information, or restrict how we use it;</li>
        <li>give you the information you provided in a portable format.</li>
      </ul>
      <p>
        You can also object to how we use your information where we rely on legitimate interests. To make a request, email <Email />. We will respond within one month. There is normally no charge.
      </p>

      <h2>Cookies</h2>
      <p>
        This website does not use cookies for tracking, analytics or advertising. See our <Link href="/cookies">cookie notice</Link> for details.
      </p>

      <h2>Complaints</h2>
      <p>
        If you have a concern, please contact us first and we will try to put it right. You also have the right to complain to the Information Commissioner&apos;s Office, the UK data protection regulator, at <a href="https://ico.org.uk/make-a-complaint/" rel="noopener noreferrer">ico.org.uk</a> or on 0303 123 1113.
      </p>

      <h2>Changes to this notice</h2>
      <p>We may update this notice. The current version, with the date at the top, is always on this page.</p>
    </LegalPage>
  );
}
