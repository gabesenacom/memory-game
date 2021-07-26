import PubSub from 'pubsub-js'
import TOPIC from './topics'
import { Game } from './Game'
import { getPlayerById } from './Player'
import {
  getNextCardPosition,
  getNextPlayerPosition
} from './memoryCardController'
import { memoryCard } from './memoryCard'

export const GameActions = (() => {
  function clickedAtSameImage (cardPlayerTurn, nextCard, nextCardPosition) {
    while (nextCard.hasPlayer()) {
      PubSub.publish(TOPIC.SEND_LOG, {
        type: 0,
        text: `${Game.getPlayerTurn().name} found the correct image`
      })
      let opponent = nextCard.getPlayer()
      opponent = getPlayerById(Game.players, opponent.id)
      if (opponent.finish_line > 0) {
        opponent.finish_line -= 1
        // send ping TOPIC.LOST_ONE_FINISH_LINE
      }

      Game.getPlayerTurn().finish_line += 1
      // send ping TOPIC.PICK_ONE_FINISH_LINE
      if (nextCard.hasPlayer() && opponent.id == Game.getPlayerTurn().id) break
      if (nextCard.hasPlayer()) {
        nextCardPosition = getNextCardPosition(nextCardPosition)
        nextCard = memoryCard.getCard(nextCardPosition)
      }
    }
    cardPlayerTurn.removePlayer()
    PubSub.publishSync(TOPIC.BUILD_PLAYER, {
      card: nextCard,
      player: Game.getPlayerTurn()
    })
  }

  function skipToNextPlayer () {
    let index = Game.players.indexOf(Game.getPlayerTurn())
    Game.setPlayerTurn(Game.players[getNextPlayerPosition(index)])
    PubSub.publish(TOPIC.SEND_LOG, {
      type: 3,
      text: `Wrong choose. Now ${Game.getPlayerTurn().name}'s turn`
    })
    //showPlayerTurnIcon() send ping TOPIC.NEW_PLAYER_TURN
  }

  function wonTheGame (winner) {
    memoryCard
      .getFlippableCards()
      .forEach(card =>
        card.getDOM().removeEventListener('click', Game.flipCardEvent)
      )
    // send ping TOPIC.WON_THE_GAME
  }

  return { clickedAtSameImage, skipToNextPlayer, wonTheGame }
})()
