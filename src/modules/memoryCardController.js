import PubSub from 'pubsub-js'
import TOPIC from './topics'
import { memoryCard } from './memoryCard'
import {StaticCardList, FlippableCardList} from "./CardList"
import cardImages from './cardImages'
import { FlippableCard, Card } from './card'
import './domController'
import { sortRandomArray, getNextItemPositionInArray } from './utils'
import { Game } from './Game'
import { addPlayerToGame } from './PlayerController'
import { ComputerPlayer, Player } from './Player'

function setRandomPlayerTurn () {
  Game.setPlayerTurn(sortRandomArray(Game.players)[0])
}

function getRandomizedCardImages () {
 return sortRandomArray(cardImages)
}

function getNextCardPosition (position) {
  return getNextItemPositionInArray(memoryCard.getCards(), position)
}

function getNextPlayerPosition (position) {
  return getNextItemPositionInArray(Game.players, position)
}

function createCards (flippable) {
  for (let image of getRandomizedCardImages()) {
    let list = flippable
      ? memoryCard.getFlippableCards()
      : memoryCard.getCards()
    let id = list.length + 1
    if (flippable) {
      let card = FlippableCard(image.src, FlippableCardList.dom, id)
      memoryCard.addFlippableCard(card)
    } else {
      let card = Card(image.src, StaticCardList.dom, id)
      memoryCard.addCard(card)
    }
  }
}

function createPlayers (playerList) {
  playerList.forEach(player => {
    let type = player.type ? ComputerPlayer : Player
    addPlayerToGame(player.name, player.icon, type)
  })
}

function init (playerList) {
  memoryCard.setPlayersLength(playerList.length)
  createCards()
  createCards()
  createCards(true)
  createPlayers(playerList)
  PubSub.publish(TOPIC.CREATE_PLAYER_DISPLAY, Game.players)
  setRandomPlayerTurn()
  PubSub.publish(TOPIC.SEND_LOG, {
    type: 1,
    message: `Welcome to Creature Clash! ${Game.getPlayerTurn().name} goes first.`
  })

  let cardPlayerDOM = memoryCard.getCardPlayer(Game.getPlayerTurn()).getDOM()
  setTimeout(() => {
    StaticCardList.scrollTo(cardPlayerDOM)
    StaticCardList.moveToEndIfReach(cardPlayerDOM)
  }, 300)

  Game.callAi()
}

export { init, getNextCardPosition, getNextPlayerPosition }
