import { describe, expect, it } from "vitest";
import { checkSpam, MIN_FILL_MS } from "@/lib/spam";
import { looksLikeRealWriting } from "@/lib/message-quality";

const NOW = 1_800_000_000_000;
const human = { honeypot: "", startedAt: NOW - 60_000, now: NOW };

describe("looksLikeRealWriting (from JMB Digital Forge)", () => {
  it.each([
    "Hi, I have a two bedroom flat in Croydon, CR0 2AB, that is currently empty. Could you call me about the guaranteed rent scheme?",
    "I own a 3-bed house near Stratford station and my tenants leave in March. What would you pay per month?",
    "Interested! My HMO in Leyton has planning permission already.",
    "We're thinking about letting our late mum's flat. Is rent-to-rent something you'd consider for a leasehold property?",
    // Names, brands and places a dictionary would miss.
    "Hi it's Oluwaseun from Nkemdirim Lettings, we manage a Zoopla-listed flat in Pimlico for Mrs Krzyzanowski.",
  ])("lets a real enquiry through: %s", (msg) => {
    expect(looksLikeRealWriting(msg)).toBe(true);
  });

  it.each([
    "asdkjh qwpoeiru zxmcnvb lkjhgf",
    "sdfghjkl wertyuio xcvbnm qwrtpsdf ghjkl",
    "ghfjdk djfhgk vbnmc xdfgt bnhyu mkiol frtgh",
    "test test test test test test test",
    "asdkjh askdjh askjdh asdkjh askdjh askjdh asdkjh",
  ])("flags nonsense: %s", (msg) => {
    expect(looksLikeRealWriting(msg)).toBe(false);
  });
});

describe("checkSpam", () => {
  const message = "Hello, I have a flat in Hackney I would like to discuss with you.";

  it("passes a normal enquiry", () => {
    expect(checkSpam({ ...human, message })).toEqual({ spam: false });
  });

  it("passes an empty or very short message (the message is optional)", () => {
    expect(checkSpam({ ...human, message: "" })).toEqual({ spam: false });
    expect(checkSpam({ ...human, message: "Call me" })).toEqual({ spam: false });
  });

  it("drops anything that filled in the honeypot", () => {
    expect(checkSpam({ ...human, message, honeypot: "Acme Ltd" })).toEqual({ spam: true, reason: "honeypot" });
  });

  it("drops forms submitted faster than a person could type", () => {
    expect(checkSpam({ ...human, message, startedAt: NOW - (MIN_FILL_MS - 1) })).toEqual({ spam: true, reason: "too-fast" });
    expect(checkSpam({ ...human, message, startedAt: null })).toEqual({ spam: true, reason: "too-fast" });
  });

  it("drops link-stuffed messages", () => {
    const linky = "Great site! See https://a.example and https://b.example and www.c.example for cheap deals";
    expect(checkSpam({ ...human, message: linky })).toEqual({ spam: true, reason: "links" });
  });

  it("drops gibberish", () => {
    expect(checkSpam({ ...human, message: "qwpoeiru zxmcnvb lkjhgf asdkjh" })).toEqual({ spam: true, reason: "gibberish" });
  });
});
