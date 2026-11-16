import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { validateEnquiry } from "@/lib/validate";
import { __resetRateLimit } from "@/lib/rate-limit";
import { emailDomainAcceptsMail } from "@/lib/email-check";
import { POST } from "@/app/api/contact/route";

// The route checks the email domain's mail records; keep tests off the network.
vi.mock("@/lib/email-check", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/email-check")>()),
  emailDomainAcceptsMail: vi.fn(async () => true),
}));

const good = {
  name: "Sam Patel",
  email: "sam@example.com",
  phone: "07911 123456",
  area: "Walthamstow, E17",
  propertyType: "House",
  bedrooms: "3",
  message: "Hi, my tenants leave in March and I would like to hear about your guaranteed rent offer.",
  company: "",
};

function post(body: unknown, ip = "1.2.3.4") {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

describe("validateEnquiry", () => {
  it("accepts a complete landlord enquiry", () => {
    const r = validateEnquiry({ ...good, startedAt: 1 });
    expect(r.ok).toBe(true);
  });

  it("reports missing and malformed fields", () => {
    const r = validateEnquiry({ name: "", email: "nope", phone: "abc", area: "", message: "hi" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["bedrooms", "email", "name", "phone", "propertyType"]);
  });

  it("requires a property type and bedrooms from the list", () => {
    const r = validateEnquiry({ ...good, propertyType: "Castle", bedrooms: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["bedrooms", "propertyType"]);
  });

  it("does not require an area or a message", () => {
    const r = validateEnquiry({ ...good, area: "", message: "" });
    expect(r.ok).toBe(true);
  });

  it("normalises a UK phone number using the country picker", () => {
    const r = validateEnquiry({ ...good, phone: "07911 123456", phoneCountry: "GB" });
    expect(r.ok && r.enquiry.phone).toBe("+44 7911 123456");
    expect(r.ok && r.enquiry.phoneE164).toBe("+447911123456");
  });

  it("validates against the chosen country (e.g. Jamaica)", () => {
    const jm = validateEnquiry({ ...good, phone: "876 555 1234", phoneCountry: "JM" });
    expect(jm.ok && jm.enquiry.phoneE164).toBe("+18765551234");
    const bad = validateEnquiry({ ...good, phone: "01234", phoneCountry: "GB" });
    expect(!bad.ok && bad.errors.phone).toContain("United Kingdom");
  });

  it("refuses non-string fields and over-long input instead of truncating", () => {
    const typed = validateEnquiry({ ...good, name: 42 });
    expect(!typed.ok && typed.errors.form).toBeTruthy();
    const long = validateEnquiry({ ...good, message: "word ".repeat(1200) });
    expect(!long.ok && long.errors.form).toContain("longer than we can accept");
  });

  it("uses the stricter email format check", () => {
    for (const email of ["sam@example", "sam@@example.com", "sam@exa mple.com", "sam,x@example.com"]) {
      const r = validateEnquiry({ ...good, email });
      expect(!r.ok && r.errors.email, email).toBeTruthy();
    }
  });

  it("strips newlines from name and email (no header injection)", () => {
    const r = validateEnquiry({ ...good, name: "Sam\r\nBcc: x@y.z", email: "sam@example.com" });
    expect(r.ok && r.enquiry.name).toBe("Sam Bcc: x@y.z");
  });
});

describe("POST /api/contact", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    __resetRateLimit();
    delete process.env.RESEND_API_KEY;
    logSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(emailDomainAcceptsMail).mockResolvedValue(true);
  });
  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  const delivered = () => logSpy.mock.calls.some((c: unknown[]) => String(c[0]).includes("enquiry logged only"));
  const dropped = () => warnSpy.mock.calls.some((c: unknown[]) => String(c[0]).includes("dropped as spam"));

  it("delivers a genuine enquiry (logged when email isn't configured)", async () => {
    const res = await post({ ...good, startedAt: Date.now() - 30_000 });
    const out = await POST(res);
    expect(out.status).toBe(200);
    expect(delivered()).toBe(true);
  });

  it("delivers an enquiry with no message (message is optional)", async () => {
    const out = await POST(post({ ...good, message: "", area: "", startedAt: Date.now() - 30_000 }));
    expect(out.status).toBe(200);
    expect(delivered()).toBe(true);
  });

  it("silently drops gibberish but still returns ok", async () => {
    const out = await POST(post({ ...good, message: "asdkjh qwpoeiru zxmcnvb lkjhgf", startedAt: Date.now() - 30_000 }));
    expect(out.status).toBe(200);
    expect(await out.json()).toEqual({ ok: true });
    expect(dropped()).toBe(true);
    expect(delivered()).toBe(false);
  });

  it("silently drops honeypot submissions", async () => {
    const out = await POST(post({ ...good, company: "Spam Inc", startedAt: Date.now() - 30_000 }));
    expect(out.status).toBe(200);
    expect(delivered()).toBe(false);
  });

  it("returns field errors for invalid input", async () => {
    const out = await POST(post({ ...good, email: "bad", startedAt: Date.now() - 30_000 }));
    expect(out.status).toBe(422);
    expect((await out.json()).errors.email).toBeTruthy();
  });

  it("rate limits to 3 submissions per 10 minutes per IP, with Retry-After", async () => {
    const body = { ...good, startedAt: Date.now() - 30_000 };
    for (let i = 0; i < 3; i++) expect((await POST(post(body, "9.9.9.9"))).status).toBe(200);
    const blocked = await POST(post(body, "9.9.9.9"));
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("Retry-After"))).toBeGreaterThan(0);
  });

  it("rejects an email whose domain can't receive mail", async () => {
    vi.mocked(emailDomainAcceptsMail).mockResolvedValue(false);
    const out = await POST(post({ ...good, email: "sam@no-such-domain-xyz.co.uk", startedAt: Date.now() - 30_000 }));
    expect(out.status).toBe(422);
    expect((await out.json()).errors.email).toContain("no-such-domain-xyz.co.uk");
    expect(delivered()).toBe(false);
  });

  it("drops repetitive filler (Forge writing check) but returns ok", async () => {
    const out = await POST(post({ ...good, message: "test test test test test test test", startedAt: Date.now() - 30_000 }));
    expect(await out.json()).toEqual({ ok: true });
    expect(dropped()).toBe(true);
  });

  it("emails info@inhavenest.com by default once a Resend key is set", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: "1" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const out = await POST(post({ ...good, startedAt: Date.now() - 30_000 }));
    expect(out.status).toBe(200);
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const sent = JSON.parse(String(init.body));
    expect(sent.to).toEqual(["info@inhavenest.com"]);
    expect(sent.from).toContain("onboarding@resend.dev");
  });

  it("keeps the enquiry in the logs and tells the visitor when sending fails", async () => {
    process.env.RESEND_API_KEY = "re_test";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("domain not verified", { status: 403 })));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const out = await POST(post({ ...good, startedAt: Date.now() - 30_000 }));
    expect(out.status).toBe(502);
    expect(errSpy.mock.calls.some((c: unknown[]) => String(c[0]).includes("Sam Patel"))).toBe(true);
    errSpy.mockRestore();
  });

  it("sends through Resend when configured", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.CONTACT_TO_EMAIL = "owner@example.com";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: "1" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const out = await POST(post({ ...good, startedAt: Date.now() - 30_000 }));
    expect(out.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    const sent = JSON.parse(String(init.body));
    expect(sent.to).toEqual(["owner@example.com"]);
    expect(sent.reply_to).toBe("sam@example.com");
    expect(sent.subject).toContain("Walthamstow");
    delete process.env.CONTACT_TO_EMAIL;
  });
});

describe("thank-you email to the landlord", () => {
  beforeEach(() => {
    __resetRateLimit();
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    process.env.RESEND_API_KEY = "re_test";
  });
  afterEach(() => {
    delete process.env.CONTACT_FROM_EMAIL;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("is not sent while the sender is Resend's shared test address", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    expect((await POST(post({ ...good, startedAt: Date.now() - 30_000 }))).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("is sent to the landlord from a verified domain, echoing only their first name", async () => {
    process.env.CONTACT_FROM_EMAIL = "Haven website <website@inhavenest.com>";
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    expect((await POST(post({ ...good, startedAt: Date.now() - 30_000 }))).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const bodies = fetchMock.mock.calls.map((c) => JSON.parse(String((c as unknown as [string, RequestInit])[1].body)));
    const thanks = bodies.find((b) => b.to[0] === "sam@example.com")!;
    expect(thanks.subject).toBe("Thanks for getting in touch with Haven");
    expect(thanks.reply_to).toBe("info@inhavenest.com");
    expect(thanks.text).toContain("Hi Sam,");
    expect(thanks.text).toContain("3-bedroom house");
    expect(thanks.text).not.toContain("Patel");
    expect(thanks.text).not.toContain(good.message);
  });

  it("doesn't fail the enquiry if only the thank-you fails", async () => {
    process.env.CONTACT_FROM_EMAIL = "Haven website <website@inhavenest.com>";
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async (_u: string, init: RequestInit) =>
      JSON.parse(String(init.body)).to[0] === "sam@example.com" ? new Response("nope", { status: 422 }) : new Response("{}", { status: 200 })));
    expect((await POST(post({ ...good, startedAt: Date.now() - 30_000 }))).status).toBe(200);
    expect(errSpy.mock.calls.some((c: unknown[]) => String(c[0]).includes("thank-you email failed"))).toBe(true);
  });
});
