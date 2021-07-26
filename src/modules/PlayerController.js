import PubSub from 'pubsub-js'
import TOPIC from './topics'
import { memoryCard } from './memoryCard'
import { Game } from './Game'

function addPlayerToGame (name, imageSrc, type) {
  let player = type.call(null, name, imageSrc, Game.players.length + 1)
  Game.players.push(player)
  _placePlayer(player)
}

function _placePlayer (player) {
  if (!canAddNewPlayer()) return

  let validCards = getEmptyCards()
  for (let card of validCards) {
    if (addPlayerByCard(player, card)) return true
  }

  return false
}

function canAddNewPlayer () {
  let players = memoryCard.getCards().filter(card => card.player).length
  return players < memoryCard.getPlayersLength()
}

function getEmptyCards () {
  let maxPlayers = memoryCard.getCards().length
  let positionGap = Math.round(maxPlayers / memoryCard.getPlayersLength())
  let positions = []
  for (let i = 0; i < maxPlayers; i += positionGap) {
    let card = memoryCard.getCards()[i]
    if (!card.hasPlayer()) {
      positions.push(i)
    }
  }
  return positions
}

function addPlayerByCard (player, cardPosition) {
  if (!isValidCardToAddPlayer(cardPosition)) return false
  let card = memoryCard.getCard(cardPosition)
  PubSub.publishSync(TOPIC.BUILD_PLAYER, { card, player })
  return true
}

function isValidCardToAddPlayer (cardPosition) {
  let card = memoryCard.getCards()[cardPosition]
  return !card || !card.player
}

export { addPlayerToGame }
