import { describe, it, expect } from "vitest";
import { evaluateHand } from "../src/poker.js";

describe("Hand evaluation", () => {
  it("detects high card", () => {
    const cards = ["A♠", "K♦", "7♣", "4♥", "2♠"];

    const result = evaluateHand(cards);

    expect(result.category).toBe("High Card");
    expect(result.chosen5.length).toBe(5);
  });
});
