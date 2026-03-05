const rankMap = {
  2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10,
  J: 11, Q: 12, K: 13, A: 14,
};

export function parseCard(card) {
  const suit = card.slice(-1);
  const rankStr = card.slice(0, -1);
  return { rank: rankMap[rankStr], suit };
}

function rankToStr(rank) {
  for (const [k, v] of Object.entries(rankMap)) {
    if (v === rank) return k;
  }
}

function isStraight(ranks) {
  const unique = [...new Set(ranks)].sort((a, b) => a - b);
  if (unique.length !== 5) return false;

  let isSeq = true;
  for (let i = 0; i < 4; i++) {
    if (unique[i + 1] !== unique[i] + 1) { isSeq = false; break; }
  }
  if (isSeq) return true;

  // wheel: A-2-3-4-5
  return unique[0] === 2 && unique[1] === 3 && unique[2] === 4 &&
         unique[3] === 5 && unique[4] === 14;
}

function isFlush(cards) {
  const suits = cards.map((c) => parseCard(c).suit);
  return new Set(suits).size === 1;
}

function chooseBest5(cards, category) {
  const parsed = cards.map(parseCard);

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
        rankToStr(kicker.rank) + kicker.suit,
      ];
    }

    case "Full House": {
      const threeRank = Number(Object.keys(counts).find((r) => counts[r] === 3));
      const pairRank = Number(Object.keys(counts).find((r) => counts[r] === 2));
      const threeCards = parsed.filter((c) => c.rank === threeRank);
      const pairCards = parsed.filter((c) => c.rank === pairRank);
      return [
        ...threeCards.map((c) => rankToStr(c.rank) + c.suit),
        ...pairCards.map((c) => rankToStr(c.rank) + c.suit),
      ];
    }

    case "Three of a kind": {
      const threeRank = Number(Object.keys(counts).find((r) => counts[r] === 3));
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
        .filter(([, count]) => count === 2)
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
        rankToStr(kicker.rank) + kicker.suit,
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

    default: {
      // Straight, Flush, Straight Flush, High Card
      const sortedRanks = parsed.map((c) => c.rank).sort((a, b) => a - b);
      const isWheel =
        sortedRanks[0] === 2 && sortedRanks[1] === 3 &&
        sortedRanks[2] === 4 && sortedRanks[3] === 5 &&
        sortedRanks[4] === 14;

      if (isWheel) {
        const ace = parsed.find((c) => c.rank === 14);
        const rest = parsed.filter((c) => c.rank !== 14).sort((a, b) => b.rank - a.rank);
        return [...rest, ace].map((c) => rankToStr(c.rank) + c.suit);
      }

      return parsed
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 5)
        .map((c) => rankToStr(c.rank) + c.suit);
    }
  }
}

function evaluate5(cards) {
  const parsed = cards.map(parseCard);
  const ranks = parsed.map((c) => c.rank);

  const counts = {};
  for (const r of ranks) counts[r] = (counts[r] || 0) + 1;

  const values = Object.values(counts);
  const pairCount = values.filter((v) => v === 2).length;
  const hasThree = values.includes(3);

  let category;
  if (isFlush(cards) && isStraight(ranks)) category = "Straight Flush";
  else if (values.includes(4))             category = "Four of a kind";
  else if (hasThree && pairCount >= 1)     category = "Full House";
  else if (isFlush(cards))                 category = "Flush";
  else if (isStraight(ranks))              category = "Straight";
  else if (hasThree)                       category = "Three of a kind";
  else if (pairCount === 2)                category = "Two Pair";
  else if (pairCount === 1)                category = "One Pair";
  else                                     category = "High Card";

  const chosen5 = chooseBest5(cards, category);
  return { category, chosen5 };
}

function combinations(arr, k) {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, k - 1).map((c) => [first, ...c]);
  const withoutFirst = combinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

function compareHands(a, b) {
  const categoryRank = {
    "Straight Flush": 9, "Four of a kind": 8, "Full House": 7,
    "Flush": 6, "Straight": 5, "Three of a kind": 4,
    "Two Pair": 3, "One Pair": 2, "High Card": 1,
  };
  const diff = categoryRank[a.category] - categoryRank[b.category];
  if (diff !== 0) return diff;

  const ranksA = a.chosen5.map((c) => parseCard(c).rank);
  const ranksB = b.chosen5.map((c) => parseCard(c).rank);
  for (let i = 0; i < ranksA.length; i++) {
    if (ranksA[i] !== ranksB[i]) return ranksA[i] - ranksB[i];
  }
  return 0;
}

export function evaluateHand(cards) {
  if (cards.length === 5) return evaluate5(cards);

  const combos = combinations(cards, 5);
  let best = null;
  for (const combo of combos) {
    const result = evaluate5(combo);
    if (best === null || compareHands(result, best) > 0) {
      best = result;
    }
  }
  return best;
}

export function evaluatePlayerHands(board, players) {
  const results = players.map((p) => {
    const allCards = [...board, ...p.hole];
    const hand = evaluateHand(allCards);
    return { ...p, ...hand };
  });

  let best = null;
  for (const r of results) {
    if (best === null || compareHands(r, best) > 0) best = r;
  }

  const winners = results.filter((r) => compareHands(r, best) === 0);
  return { players: results, winners };
}