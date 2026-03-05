const rankMap = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

export function parseCard(card) {
  const suit = card.slice(-1);
  const rankStr = card.slice(0, -1);

  return {
    rank: rankMap[rankStr],
    suit,
  };
}

function isStraight(ranks) {
  const unique = [...new Set(ranks)].sort((a, b) => a - b);

  if (unique.length !== 5) {
    return false;
  }

  for (let i = 0; i < 4; i++) {
    if (unique[i + 1] !== unique[i] + 1) {
      return false;
    }
  }

  return true;
}

function isFlush(cards) {
  const suits = cards.map((c) => parseCard(c).suit);
  return new Set(suits).size === 1;
}

function chooseBest5(cards, category) {
  const parsed = cards.map(parseCard);

  // compute counts once for all categories
  const counts = {};
  for (const c of parsed) {
    counts[c.rank] = (counts[c.rank] || 0) + 1;
  }

  switch (category) {
    case "Four of a kind": {
      const quadRank = Number(Object.keys(counts).find((r) => counts[r] === 4));
      const quadCards = parsed.filter((c) => c.rank === quadRank);
      const kicker = parsed
        .filter((c) => c.rank !== quadRank)
        .sort((a, b) => b.rank - a.rank)[0];
      return [
        ...quadCards.map((c) => rankToStr(c.rank) + c.suit),
        `${rankToStr(kicker.rank)}${kicker.suit}`,
      ];
    }

    case "Full House": {
      const threeRank = Number(
        Object.keys(counts).find((r) => counts[r] === 3),
      );
      const pairRank = Number(Object.keys(counts).find((r) => counts[r] === 2));
      const threeCards = parsed.filter((c) => c.rank === threeRank);
      const pairCards = parsed.filter((c) => c.rank === pairRank);
      return [
        ...threeCards.map((c) => rankToStr(c.rank) + c.suit),
        ...pairCards.map((c) => rankToStr(c.rank) + c.suit),
      ];
    }

    case "Three of a kind": {
      const threeRank = Number(
        Object.keys(counts).find((r) => counts[r] === 3),
      );
      const threeCards = parsed.filter((c) => c.rank === threeRank);
      const kickers = parsed
        .filter((c) => c.rank !== threeRank)
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 2);
      return [
        ...threeCards.map((c) => rankToStr(c.rank) + c.suit),
        ...kickers.map((c) => rankToStr(c.rank) + c.suit),
      ];
    }

    case "Two Pair": {
      const pairRanks = Object.entries(counts)
        .filter(([rank, count]) => count === 2)
        .map(([rank]) => Number(rank))
        .sort((a, b) => b - a);
      const pairCards = [];
      for (const r of pairRanks) {
        pairCards.push(...parsed.filter((c) => c.rank === r));
      }
      const kicker = parsed
        .filter((c) => !pairRanks.includes(c.rank))
        .sort((a, b) => b.rank - a.rank)[0];
      return [
        ...pairCards.map((c) => rankToStr(c.rank) + c.suit),
        `${rankToStr(kicker.rank)}${kicker.suit}`,
      ];
    }

    case "One Pair": {
      const pairRank = Number(Object.keys(counts).find((r) => counts[r] === 2));
      const pairCards = parsed.filter((c) => c.rank === pairRank);
      const kickers = parsed
        .filter((c) => c.rank !== pairRank)
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 3);
      return [
        ...pairCards.map((c) => rankToStr(c.rank) + c.suit),
        ...kickers.map((c) => rankToStr(c.rank) + c.suit),
      ];
    }

    default:
      // straight/flush/straight flush or high card - just return the top five
      return parsed
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 5)
        .map((c) => rankToStr(c.rank) + c.suit);
  }
}
function rankToStr(rank) {
  for (const [k, v] of Object.entries(rankMap)) {
    if (v === rank) return k;
  }
}

export function evaluateHand(cards) {
  const parsed = cards.map(parseCard);

  const ranks = parsed.map((c) => c.rank);

  const counts = {};

  for (const r of ranks) {
    counts[r] = (counts[r] || 0) + 1;
  }

  const values = Object.values(counts);

  const pairCount = values.filter((v) => v === 2).length;
  const hasThree = values.includes(3);
  let category;

  if (isFlush(cards) && isStraight(ranks)) {
    category = "Straight Flush";
  } else if (isFlush(cards)) {
    category = "Flush";
  } else if (isStraight(ranks)) {
    category = "Straight";
  } else if (values.includes(4)) {
    category = "Four of a kind";
  } else if (hasThree && pairCount >= 1) {
    category = "Full House";
  } else if (hasThree) {
    category = "Three of a kind";
  } else if (pairCount === 2) {
    category = "Two Pair";
  } else if (pairCount === 1) {
    category = "One Pair";
  } else {
    category = "High Card";
  }

  const chosen5 = chooseBest5(cards, category);
  return { category, chosen5 };
}
