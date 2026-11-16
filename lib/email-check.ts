/**
 * Email address checks, ported from the JMB Digital Forge contact form.
 * SERVER ONLY: uses node:dns.
 */
import { promises as dns } from "node:dns";

/**
 * Deliberately permissive on the local part — the exotic forms RFC 5322 allows
 * are legal addresses and rejecting them loses real enquiries. This catches the
 * malformed rather than the merely unusual.
 */
const EMAIL_PATTERN =
  /^[^\s@,;:<>()[\]\\"]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;

export function isWellFormedEmail(value: string) {
  if (value.length > 254) return false;
  const at = value.lastIndexOf("@");
  if (at < 1 || at > 64) return false;
  return EMAIL_PATTERN.test(value);
}

export function withTimeout<T>(work: Promise<T>, ms: number, fallback: T) {
  return Promise.race([
    work,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export type MailResolver = {
  resolveMx: (domain: string) => Promise<unknown[]>;
  resolve4: (domain: string) => Promise<unknown[]>;
  resolve6: (domain: string) => Promise<unknown[]>;
};

/**
 * Checks the domain can actually receive mail, which rejects typos and invented
 * domains that pass a format check.
 *
 * Fails OPEN: a DNS timeout or SERVFAIL is our problem, not the sender's, and
 * losing a real enquiry is worse than accepting a junk one. Only an
 * authoritative "no such record" rejects.
 */
export async function domainAcceptsMail(domain: string, resolver: MailResolver = dns) {
  const authoritativelyMissing = (error: unknown) => {
    const code = (error as NodeJS.ErrnoException)?.code;
    return code === "ENOTFOUND" || code === "ENODATA";
  };

  try {
    const mx = await resolver.resolveMx(domain);
    if (mx.length > 0) return true;
  } catch (error) {
    if (!authoritativelyMissing(error)) return true;
  }

  // RFC 5321 section 5.1: with no MX, a domain still accepts mail at its
  // address record.
  for (const lookup of [resolver.resolve4, resolver.resolve6]) {
    try {
      const records = await lookup(domain);
      if (records.length > 0) return true;
    } catch (error) {
      if (!authoritativelyMissing(error)) return true;
    }
  }

  return false;
}

/** Domain check with the Forge's 3-second cap; a slow lookup is treated as deliverable. */
export function emailDomainAcceptsMail(email: string, resolver?: MailResolver) {
  const domain = email.slice(email.lastIndexOf("@") + 1);
  return withTimeout(domainAcceptsMail(domain, resolver), 3000, true);
}
