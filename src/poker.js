const rankMap = {
  "2":2,"3":3,"4":4,"5":5,"6":6,
  "7":7,"8":8,"9":9,"10":10,
  "J":11,"Q":12,"K":13,"A":14
}

export function parseCard(card){

  const suit = card.slice(-1)
  const rankStr = card.slice(0,-1)

  return {
    rank: rankMap[rankStr],
    suit
  }

}

export function evaluateHand(cards){

  return {
    category:"High Card",
    chosen5:[...cards]
  }

}