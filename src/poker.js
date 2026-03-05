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

function isStraight(ranks){

  const unique = [...new Set(ranks)].sort((a,b)=>a-b)

  if(unique.length !== 5){
    return false
  }

  for(let i=0;i<4;i++){
    if(unique[i+1] !== unique[i] + 1){
      return false
    }
  }

  return true
}

export function evaluateHand(cards){

  const parsed = cards.map(parseCard)

  const ranks = parsed.map(c=>c.rank)

  const counts = {}

  for(const r of ranks){
    counts[r]=(counts[r]||0)+1
  }

  const values = Object.values(counts)

  const pairCount = values.filter(v => v === 2).length
  const hasThree = values.includes(3)

  if(isStraight(ranks)){
  return {
    category:"Straight",
    chosen5:[...cards]
    }
}

  if(hasThree){
    return {
      category:"Three of a kind",
      chosen5:[...cards]
    }
  }

  if(pairCount === 2){
    return {
      category:"Two Pair",
      chosen5:[...cards]
    }
  }

  if(pairCount === 1){
    return {
      category:"One Pair",
      chosen5:[...cards]
    }
  }

  return {
    category:"High Card",
    chosen5:[...cards]
  }

}