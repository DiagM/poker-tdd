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
    const cards = ["7♠", "7♦", "7♣", "7♥", "2♠"];

    const result = evaluateHand(cards);

    expect(result.category).toBe("Four of a kind");
  });

  it("detects a straight flush", () => {
    const cards = ["10♥", "J♥", "Q♥", "K♥", "A♥"];

    const result = evaluateHand(cards);

    expect(result.category).toBe("Straight Flush");
  });

  it("resolves four of a kind tie with kicker", () => {
    const player1 = ["7♠", "7♦", "7♣", "7♥", "A♠"];
    const player2 = ["7♠", "7♦", "7♣", "7♥", "K♠"];

    const result1 = evaluateHand(player1);
    const result2 = evaluateHand(player2);

    expect(result1.category).toBe("Four of a kind");
    expect(result2.category).toBe("Four of a kind");

    // highest kicker wins
    expect(result1.chosen5[4]).toBe("A♠");
    expect(result2.chosen5[4]).toBe("K♠");
  });
  // tie-breaker tests for other categories
  it("resolves full house tie by trip then pair", () => {
    const stronger = ["K♠", "K♦", "K♣", "Q♥", "Q♠"]; // trips K, pair Q
    const weaker = ["J♠", "J♦", "J♣", "A♥", "A♠"]; // trips J, pair A

    const r1 = evaluateHand(stronger);
    const r2 = evaluateHand(weaker);

    expect(r1.category).toBe("Full House");
    expect(r2.category).toBe("Full House");

    // trip rank governs, so first card in chosen5 should reflect the trip
    expect(r1.chosen5[0]).toMatch(/^K/);
    expect(r2.chosen5[0]).toMatch(/^J/);
  });

  it("resolves three of a kind tie with kickers", () => {
    const high = ["Q♠", "Q♦", "Q♣", "9♥", "7♠"];
    const low = ["Q♠", "Q♦", "Q♣", "9♥", "6♠"];

    const r1 = evaluateHand(high);
    const r2 = evaluateHand(low);

    expect(r1.category).toBe("Three of a kind");
    expect(r2.category).toBe("Three of a kind");

    // kicker comparison at index 3 and 4
    expect(r1.chosen5[3]).toBe("9♥");
    expect(r1.chosen5[4]).toBe("7♠");
    expect(r2.chosen5[4]).toBe("6♠");
  });

  it("resolves two pair tie with high pair then low then kicker", () => {
    const winner = ["K♠", "K♦", "9♣", "9♥", "2♠"];
    const loser = ["K♠", "K♦", "9♣", "9♥", "3♠"]; // kicker smaller than winner

    const r1 = evaluateHand(winner);
    const r2 = evaluateHand(loser);

    expect(r1.category).toBe("Two Pair");
    expect(r2.category).toBe("Two Pair");
    expect(r1.chosen5[0]).toMatch(/^K/);
    expect(r1.chosen5[2]).toMatch(/^9/);
    expect(r2.chosen5[4]).toBe("3♠");
  });

  it("resolves one pair tie with pair then kickers", () => {
    const winner = ["A♠", "A♦", "K♣", "Q♥", "J♠"];
    const loser = ["A♠", "A♦", "K♣", "Q♥", "10♠"];

    const r1 = evaluateHand(winner);
    const r2 = evaluateHand(loser);

    expect(r1.category).toBe("One Pair");
    expect(r2.category).toBe("One Pair");
    expect(r1.chosen5[0]).toMatch(/^A/);
    expect(r1.chosen5[1]).toMatch(/^A/);
    expect(r1.chosen5[4]).toBe("J♠");
    expect(r2.chosen5[4]).toBe("10♠");
  });

  it("resolves high card/flush tie by descending five cards", () => {
    const highCard1 = ["A♠", "K♦", "7♣", "4♥", "3♠"];
    const highCard2 = ["A♠", "K♦", "7♣", "4♥", "2♠"];

    const r1 = evaluateHand(highCard1);
    const r2 = evaluateHand(highCard2);

    expect(r1.category).toBe("High Card");
    expect(r2.category).toBe("High Card");
    expect(r1.chosen5[4]).toBe("3♠");
    expect(r2.chosen5[4]).toBe("2♠");
  });

  it("resolves straight/straight flush tie by highest card", () => {
    const s1 = ["9♠", "10♠", "J♠", "Q♠", "K♠"];
    const s2 = ["8♠", "9♠", "10♠", "J♠", "Q♠"];

    const r1 = evaluateHand(s1);
    const r2 = evaluateHand(s2);

    expect(r1.category).toBe("Straight Flush");
    expect(r2.category).toBe("Straight Flush");
    expect(r1.chosen5[0]).toMatch(/^K/);
    expect(r2.chosen5[0]).toMatch(/^Q/);
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
