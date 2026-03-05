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
  it("detects four of a kind", () => {
  const cards = ["7♠","7♦","7♣","7♥","2♠"]

  const result = evaluateHand(cards)

  expect(result.category).toBe("Four of a kind")
})

it("detects a straight flush", () => {
  const cards = ["10♥","J♥","Q♥","K♥","A♥"]

  const result = evaluateHand(cards)

  expect(result.category).toBe("Straight Flush")
})

it("resolves four of a kind tie with kicker", () => {
  const player1 = ["7♠","7♦","7♣","7♥","A♠"]
  const player2 = ["7♠","7♦","7♣","7♥","K♠"]

  const result1 = evaluateHand(player1)
  const result2 = evaluateHand(player2)

  expect(result1.category).toBe("Four of a kind")
  expect(result2.category).toBe("Four of a kind")

  // highest kicker wins
  expect(result1.chosen5[4]).toBe("A♠")
  expect(result2.chosen5[4]).toBe("K♠")
})
});

//card parsing tests
describe("Card parsing", () => {
  it("parses an Ace of spades", () => {
    const card = parseCard("A♠");

    expect(card.rank).toBe(14);
    expect(card.suit).toBe("♠");
  });
});
