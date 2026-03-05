import { describe, it, expect } from "vitest";
import { evaluateHand, parseCard } from "../src/poker.js";

//evaluate hand tests
describe("Hand evaluation", () => {
  it("detects high card", () => {
    const cards = ["A♠", "K♦", "7♣", "4♥", "2♠"];

    const result = evaluateHand(cards);

    expect(result.category).toBe("High Card");
    expect(result.chosen5.length).toBe(5);
  });
  it("detects one pair", () => {
    const cards = ["A♠", "A♦", "7♣", "4♥", "2♠"];

    const result = evaluateHand(cards);

    expect(result.category).toBe("One Pair");
  });
  it("detects two pair", () => {
    const cards = ["A♠", "A♦", "K♣", "K♥", "2♠"];

    const result = evaluateHand(cards);

    expect(result.category).toBe("Two Pair");
  });

  it("detects three of a kind", () => {
    const cards = ["A♠", "A♦", "A♣", "7♥", "2♠"];

    const result = evaluateHand(cards);

    expect(result.category).toBe("Three of a kind");
  });

  it("detects a straight", () => {
    const cards = ["10♠", "J♦", "Q♣", "K♥", "A♠"];

    const result = evaluateHand(cards);

    expect(result.category).toBe("Straight");
  });

  it("detects a flush", () => {
    const cards = ["A♥", "J♥", "9♥", "4♥", "2♥"];

    const result = evaluateHand(cards);

    expect(result.category).toBe("Flush");
  });

  it("detects a full house", () => {
    const cards = ["K♠", "K♦", "K♣", "Q♥", "Q♠"];

    const result = evaluateHand(cards);

    expect(result.category).toBe("Full House");
  });
});

//card parsing tests
describe("Card parsing", () => {
  it("parses an Ace of spades", () => {
    const card = parseCard("A♠");

    expect(card.rank).toBe(14);
    expect(card.suit).toBe("♠");
  });
});
