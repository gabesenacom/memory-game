import PubSub from 'pubsub-js'
import TOPIC from './topics'
import { GameActions } from './GameActions'
import { memoryCard } from './memoryCard'
import { getNextCardPosition } from './memoryCardController'

export const Game = (() => {
  let playerTurn = null
  let players = []
  let blockFlip = false

  function flip (targetCard, targetCardIndex) {
    blockFlip = true
    targetCard.flipImage()
    setTimeout(() => {
      targetCard.flipImage()
      blockFlip = false
    }, 1000)
    players
      .filter(player => player.ai)
      .forEach(player =>
        player.memorize(targetCard.getRealImageSrc(), targetCardIndex)
      )
  }

  function flipCardEvent (event) {
    if (playerTurn.ai) return
    let cardId = Number.parseInt(event.target.getAttribute('data-id'))
    let targetCard = memoryCard.getFlippableCardById(cardId)
    flipCard(targetCard)
  }

  function flipCard (targetCard) {
    if (!targetCard) {
      GameActions.skipToNextPlayer()
      return
    }
    if (blockFlip && !playerTurn.ai) return
    let targetCardIndex = memoryCard.getFlippableCards().indexOf(targetCard)
    if (targetCard.isFlipped()) return
    flip(targetCard, targetCardIndex)

    let cardPlayerTurn = memoryCard.getCardPlayer(Game.getPlayerTurn())
    let cardPlayerTurnPosition = memoryCard.getCardPosition(cardPlayerTurn)
    let nextCardPosition = getNextCardPosition(cardPlayerTurnPosition)
    let nextCard = memoryCard.getCard(nextCardPosition)

    if (targetCard.getRealImageSrc() === nextCard.getImageSrc()) {
      GameActions.clickedAtSameImage(cardPlayerTurn, nextCard, nextCardPosition)
    } else {
      GameActions.skipToNextPlayer()
    }

    let winner = getWinner()
    if (winner != null) {
      return GameActions.wonTheGame(winner)
    }

    if (playerTurn.ai) {
      setTimeout(() => callAi(), 1100)
    }
  }

  function getWinner () {
    let withPoints = players.filter(player => player.finish_line > 0)
    if (withPoints.length > 1) {
      return null
    } else if (withPoints.length === 1) {
      return withPoints[0]
    }
    return null
  }

  function setPlayerTurn (_playerTurn) {
    playerTurn = _playerTurn
    PubSub.publish(TOPIC.HIGHLIGHT_PLAYER_TURN, {
      playerTurn: playerTurn, playerList: players
    })
  }

  function getPlayerTurn () {
    return playerTurn
  }

  function callAi () {
    if (playerTurn.ai) {
      let cardPlayerTurn = memoryCard.getCardPlayer(playerTurn)
      let choiceCard = playerTurn.selectBestChoice(cardPlayerTurn)
      return flipCard(choiceCard)
    }
  }

  return {
    setPlayerTurn,
    getPlayerTurn,
    flipCard,
    flipCardEvent,
    players,
    callAi
  }
})()
