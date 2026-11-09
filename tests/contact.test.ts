import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { validateEnquiry } from "@/lib/validate";
import { resetRateLimit } from "@/lib/rateLimit";
import { POST } from "@/app/api/contact/route";

const good = {
  type: "landlord",
  name: "Sam Patel",
  email: "sam@example.com",
  phone: "07700 900123",
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
    const r = validateEnquiry({ type: "landlord", name: "", email: "nope", phone: "abc", area: "", message: "hi" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["area", "email", "message", "name", "phone"]);
  });

  it("does not require an area for guests", () => {
    const r = validateEnquiry({ ...good, type: "guest", area: "" });
    expect(r.ok).toBe(true);
  });

  it("strips newlines from name and email (no header injection)", () => {
    const r = validateEnquiry({ ...good, name: "Sam\r\nBcc: x@y.z", email: "sam@example.com" });
    expect(r.ok && r.enquiry.name).toBe("Sam Bcc: x@y.z");
  });
});

describe("POST /api/contact", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    resetRateLimit();
    delete process.env.RESEND_API_KEY;
    logSpy = vi.spyOn(console, "info").mockImplementation(() => {});
  });
  afterEach(() => {
    logSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  const delivered = () => logSpy.mock.calls.some((c: unknown[]) => String(c[0]).includes("enquiry logged only"));
  const dropped = () => logSpy.mock.calls.some((c: unknown[]) => String(c[0]).includes("dropped as spam"));

  it("delivers a genuine enquiry (logged when email isn't configured)", async () => {
    const res = await post({ ...good, startedAt: Date.now() - 30_000 });
    const out = await POST(res);
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

  it("rate limits repeated submissions from one IP", async () => {
    const body = { ...good, startedAt: Date.now() - 30_000 };
    for (let i = 0; i < 5; i++) expect((await POST(post(body, "9.9.9.9"))).status).toBe(200);
    expect((await POST(post(body, "9.9.9.9"))).status).toBe(429);
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
