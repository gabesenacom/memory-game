import PubSub from 'pubsub-js'
import TOPIC from './topics'
import { Game } from './Game'
import { getPlayerById } from './Player'
import {
  getNextCardPosition,
  getNextPlayerPosition
} from './memoryCardController'
import { memoryCard } from './memoryCard'
import {StaticCardList} from "./CardList"

export const GameActions = (() => {
  function clickedAtSameImage (cardPlayerTurn, nextCard, nextCardPosition) {
        PubSub.publish(TOPIC.SEND_LOG, {
        type: 2,
        message: `${Game.getPlayerTurn().name} found the correct image!`
      })
    while (nextCard.hasPlayer()) {
      let opponent = nextCard.getPlayer()
      opponent = getPlayerById(Game.players, opponent.id)
      if (opponent.finish_line > 0) {
        opponent.finish_line -= 1
        PubSub.publish(TOPIC.UPDATE_FINISH_LINE, opponent)
      }

      // Add SEND_LOG here

      Game.getPlayerTurn().finish_line += 1
      PubSub.publish(TOPIC.UPDATE_FINISH_LINE, Game.getPlayerTurn())
      if (nextCard.hasPlayer() && opponent.id == Game.getPlayerTurn().id) break
      if (nextCard.hasPlayer()) {
        nextCardPosition = getNextCardPosition(nextCardPosition)
        nextCard = memoryCard.getCard(nextCardPosition)
      }
    }

    StaticCardList.scrollTo(nextCard.getDOM())
    StaticCardList.moveToEndIfReach(nextCard.getDOM())

    cardPlayerTurn.removePlayer()
    PubSub.publishSync(TOPIC.BUILD_PLAYER, {
      card: nextCard,
      player: Game.getPlayerTurn()
    })
  }

  function skipToNextPlayer () {
    let previousPlayer = Game.getPlayerTurn()
    let index = Game.players.indexOf(Game.getPlayerTurn())
    Game.setPlayerTurn(Game.players[getNextPlayerPosition(index)])
    console.log("player turn now", Game.getPlayerTurn().name)
    PubSub.publish(TOPIC.SEND_LOG, {
      type: 3,
      message: `${previousPlayer.name} chose wrong. Now it's ${Game.getPlayerTurn().name}'s turn.`
    })

    let cardPlayer = memoryCard.getCardPlayer(Game.getPlayerTurn())
    
    StaticCardList.scrollTo(cardPlayer.getDOM())
    StaticCardList.moveToEndIfReach(cardPlayer.getDOM())
  }

  function wonTheGame (winner) {
    memoryCard
      .getFlippableCards()
      .forEach(card =>
        card.getDOM().removeEventListener('click', Game.flipCardEvent)
      )
    PubSub.publish(TOPIC.WON_THE_GAME, {winner})
    PubSub.publish(TOPIC.SEND_LOG, {
      type: 2,
      message: `${winner.name} wins the game!`
    })
  }

  return { clickedAtSameImage, skipToNextPlayer, wonTheGame }
})()
