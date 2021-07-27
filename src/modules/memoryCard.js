import { Card } from './card'
import './domController'
import PubSub from 'pubsub-js'
import TOPIC from './topics'

export const memoryCard = (() => {
  let playersLength = 0
  const cards = []
  let flippableCards = []

  function setPlayersLength (_playersLength) {
    playersLength = _playersLength
  }

  function getPlayersLength () {
    return playersLength
  }

  function addCard (card) {
    cards.push(card)
    PubSub.publishSync(TOPIC.BUILD_CARD, card)
  }

  function addFlippableCard (card) {
    flippableCards.push(card)
    PubSub.publishSync(TOPIC.BUILD_FLIPPABLE_CARD, card)
  }

  function removeFlippableCard (card) {
    flippableCards = flippableCards.filter(refCard => refCard != card)
    card.getDOM().remove()
  }

  function getCard (position) {
    return cards[position]
  }

  function getCardPosition (card) {
    let index = 0
    for (let cardArray of cards) {
      if (card.getId() == cardArray.getId()) break
      ++index
    }
    return index
  }

  function getCardById(id) {
    return cards.filter(card => card.getId() === id)[0]
  }

  function getCardPlayer (player) {
    let found = cards.filter(
      card => card.getPlayer() && card.getPlayer().id === player.id
    )
    if (found.length > 0) return found[0]
    return null
  }

  function getFlippableCard (position) {
    return flippableCards[position]
  }

  function getFlippableCardById (id) {
    return flippableCards.filter(card => card.getId() === id)[0]
  }

  function getFlippableCards () {
    return flippableCards
  }

  function getCards () {
    return cards
  }

  return {
    getCards,
    getFlippableCards,
    addFlippableCard,
    addCard,
    getPlayersLength,
    setPlayersLength,
    removeFlippableCard,
    getCardById,
    getFlippableCardById,
    getCardPlayer,
    getCardPosition,
    getCard,
    getFlippableCard
  }
})()
