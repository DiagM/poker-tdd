export function evaluateHand(cards) {
  return {
    category: "High Card",
    chosen5: [...cards],
  };
}
