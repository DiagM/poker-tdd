import { describe, it, expect } from "vitest";
import { evaluateHand,parseCard } from "../src/poker.js";

//evaluate hand tests
describe("Hand evaluation", () => {
  it("detects high card", () => {
    const cards = ["A♠", "K♦", "7♣", "4♥", "2♠"];

    const result = evaluateHand(cards);

    expect(result.category).toBe("High Card");
    expect(result.chosen5.length).toBe(5);
  });
    it("detects one pair", () => {
    const cards = ["A♠","A♦","7♣","4♥","2♠"];

    const result = evaluateHand(cards);

    expect(result.category).toBe("One Pair");
  });
  it("detects two pair", () => {
  const cards = ["A♠","A♦","K♣","K♥","2♠"]

  const result = evaluateHand(cards)

  expect(result.category).toBe("Two Pair")
})
});

//card parsing tests
describe("Card parsing", () => {

  it("parses an Ace of spades", () => {

    const card = parseCard("A♠")

    expect(card.rank).toBe(14)
    expect(card.suit).toBe("♠")

  })

})