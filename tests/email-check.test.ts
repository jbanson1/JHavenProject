import { describe, expect, it } from "vitest";
import { domainAcceptsMail, isWellFormedEmail, type MailResolver } from "@/lib/email-check";

const err = (code: string) => Object.assign(new Error(code), { code });
const resolver = (r: Partial<Record<keyof MailResolver, () => Promise<unknown[]>>>): MailResolver => ({
  resolveMx: r.resolveMx ?? (async () => { throw err("ENODATA"); }),
  resolve4: r.resolve4 ?? (async () => { throw err("ENODATA"); }),
  resolve6: r.resolve6 ?? (async () => { throw err("ENODATA"); }),
});

describe("isWellFormedEmail", () => {
  it.each(["sam@example.com", "sam.o'neil+lettings@sub.example.co.uk", "a@b.io"])("accepts %s", (e) => {
    expect(isWellFormedEmail(e)).toBe(true);
  });
  it.each(["sam@example", "@example.com", "sam@-example.com", "sam@example..com", "sam example@x.com", `${"a".repeat(65)}@x.com`])(
    "rejects %s",
    (e) => expect(isWellFormedEmail(e)).toBe(false),
  );
});

describe("domainAcceptsMail", () => {
  it("accepts a domain with MX records", async () => {
    expect(await domainAcceptsMail("x.com", resolver({ resolveMx: async () => [{ exchange: "mx.x.com" }] }))).toBe(true);
  });
  it("falls back to an address record when there is no MX", async () => {
    expect(await domainAcceptsMail("x.com", resolver({ resolve4: async () => ["1.2.3.4"] }))).toBe(true);
  });
  it("rejects a domain that authoritatively has no mail or address records", async () => {
    expect(await domainAcceptsMail("nope.invalid", resolver({ resolveMx: async () => { throw err("ENOTFOUND"); } }))).toBe(false);
  });
  it("fails open on DNS trouble (timeouts, SERVFAIL)", async () => {
    expect(await domainAcceptsMail("x.com", resolver({ resolveMx: async () => { throw err("ETIMEOUT"); } }))).toBe(true);
  });
});
