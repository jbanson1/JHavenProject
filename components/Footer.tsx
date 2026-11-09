import Link from "next/link";
import { site } from "@/site.config";
import { Mark } from "./Icons";

export function Footer() {
  const social = Object.entries(site.social).filter(([, url]) => url);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="wordmark">
              <Mark className="wordmark__mark" />
              {site.name}
            </Link>
            <p style={{ maxWidth: 380 }}>{site.tagline}</p>
            <p style={{ margin: 0 }}>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              {site.contact.phone && (
                <>
                  <br />
                  <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>{site.contact.phone}</a>
                </>
              )}
            </p>
          </div>
          <div>
            <div className="footer-title">Explore</div>
            <ul className="footer-links">
              <li><Link href="/landlords">For landlords</Link></li>
              <li><Link href="/landlords#faq">Landlord FAQ</Link></li>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/stay">Accommodation enquiry</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-title">Areas</div>
            <ul className="footer-links">
              {site.areas.map((a) => <li key={a}>{a}</li>)}
              {site.futureAreas.map((a) => <li key={a}>{a} (coming soon)</li>)}
            </ul>
            {social.length > 0 && (
              <>
                <div className="footer-title" style={{ marginTop: 24 }}>Follow</div>
                <ul className="footer-links">
                  {social.map(([name, url]) => (
                    <li key={name}><a href={url} rel="noopener noreferrer" target="_blank" style={{ textTransform: "capitalize" }}>{name}</a></li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.legal.companyName}
            {site.legal.companyNumber && ` · ${site.legal.companyNumber}`}
          </span>
          <Link href="/privacy">Privacy notice</Link>
        </div>
      </div>
    </footer>
  );
}
