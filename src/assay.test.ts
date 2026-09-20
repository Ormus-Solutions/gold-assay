import { describe, expect, it } from "vitest";
import { interpretAssay, type AssayAnswers } from "./assay.js";
import { compressDomText } from "./from-dom.js";

describe("interpretAssay", () => {
  it("ships green", () => {
    const a: AssayAnswers = {
      journey_state: { choice: "green" },
      claim_match: { score: 3.2 },
      error_banner: { probability: 0.05 },
      destructive_visible: { probability: 0.1 },
    };
    expect(interpretAssay(a).ship).toBe(true);
  });
});

describe("compressDomText", () => {
  it("drops noise lines", () => {
    const out = compressDomText("Hello\nAccept all\nDashboard");
    expect(out).toContain("Hello");
    expect(out).not.toMatch(/Accept all/i);
  });
});
