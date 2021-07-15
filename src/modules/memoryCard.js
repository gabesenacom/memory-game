import {Card} from './card'

export const cardListDOM = document.getElementById("card-list")
export const flippableCardListDOM = document.getElementById("flippable-card-list")

export const memoryCard = (() => {
  const NUM_PLAYERS = 4

  const cards = []
  let flippableCards = []

  function addCard(card) {
    cards.push(card)
    card.build()
  }

  function addFlippableCard(card) {
    flippableCards.push(card)
    card.build()
  }

  function addPlayer(player, position) {
    let card = getCard(position)
    card.buildPlayer(player)
  }

  function removeFlippableCard(card) {
    flippableCards = flippableCards.filter((refCard) => refCard != card)
    card.getDOM().remove()
  }

  function getCard(position) {
    return cards[position]
  }

  function getFlippableCard(position) {
    return flippableCards[position]
  }

  function getFlippableCards() {
    return flippableCards
  }

  function getCards() {
    return cards
  }

  // TEST ONLY
  fillPositions()
  
  function fillPositions() {
    
    for(let i = 0; i < 10; i++) {
      let card = Card(`https://wpicsum.photos/10${i}`, cardListDOM, i)
      addCard(card)
    }
  }

  return {getCards, getFlippableCards, addPlayer, addFlippableCard, addCard, NUM_PLAYERS, removeFlippableCard}
})()

export function addPlayer(player) {
  if(!canAddNewPlayer()) return
  
  let validCards = getEmptyCards()
  for(let card of validCards) {
    if(addPlayerByCard(player, card))
      return true
  }
  return false
}

function canAddNewPlayer() {
  let players = memoryCard.getCards().filter((card) => card.player).length
  return players < memoryCard.NUM_PLAYERS
}

function getEmptyCards() {
  let maxPlayers = memoryCard.getCards().length
  let positionGap = Math.round(maxPlayers / memoryCard.NUM_PLAYERS)
  let positions = []
  for(let i = 0; i < maxPlayers; i += positionGap) {
    let card = memoryCard.getCards()[i]
    if(!card.hasPlayer()) {
      positions.push(i)
    }
  }
  return positions
}

function addPlayerByCard(player, cardPosition) {
  if(!isValidCardToAddPlayer(cardPosition)) return false
  
  memoryCard.addPlayer(player, cardPosition)
  return true
}

function isValidCardToAddPlayer( cardPosition) {
  let card = memoryCard.getCards()[cardPosition]
  return !card || !card.player
}