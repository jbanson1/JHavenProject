import { describe, expect, it } from "vitest";
import { checkSpam, isGibberish, MIN_FILL_MS } from "@/lib/spam";

const NOW = 1_800_000_000_000;
const human = { honeypot: "", startedAt: NOW - 60_000, name: "Sam Patel", now: NOW };

describe("isGibberish", () => {
  it.each([
    "Hi, I have a two bedroom flat in Croydon, CR0 2AB, that is currently empty. Could you call me about the guaranteed rent scheme?",
    "I own a 3-bed house near Stratford station and my tenants leave in March. What would you pay per month?",
    "Looking for somewhere to stay for 5 nights in June for a work trip, 2 adults. Do you have anything near Canary Wharf?",
    "Please call me back.",
    "Interested! My HMO in Leyton has planning permission already.",
    "We're thinking about letting our late mum's flat. Is rent-to-rent something you'd consider for a leasehold property?",
  ])("lets a real enquiry through: %s", (msg) => {
    expect(isGibberish(msg)).toBe(false);
  });

  it.each([
    "asdkjh qwpoeiru zxmcnvb lkjhgf",
    "sdfghjkl wertyuio xcvbnm qwrtpsdf ghjkl",
    "ghfjdk djfhgk vbnmc xdfgt bnhyu mkiol frtgh",
    "!!!!! 12345 ????",
    "blorp fizzwank qorpt zindle vuxom trapple gonk",
  ])("drops nonsense: %s", (msg) => {
    expect(isGibberish(msg)).toBe(true);
  });
});

describe("checkSpam", () => {
  const message = "Hello, I have a flat in Hackney I would like to discuss with you.";

  it("passes a normal enquiry", () => {
    expect(checkSpam({ ...human, message })).toEqual({ spam: false });
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
