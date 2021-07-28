import PubSub from 'pubsub-js'
import TOPIC from './topics'
import './domController'

const playerForm = document.getElementById('player-form')
const startButton = document.getElementById('start-game')
const showRulesButton = document.querySelector('.show-rules')
const currentIcon = document.getElementById('current-icon')
const selectedIcon = document.getElementById('playerIcon')
const iconChoices = document.querySelectorAll('.icon-choice')
const playerList = []

export function homePageInit () {
  playerForm.reset()
  playerForm.addEventListener('submit', event => {
    event.preventDefault()
    if (playerList.length >= 4) {
      PubSub.publish(TOPIC.SEND_LOG, {
        type: 4,
        message: 'Sorry, the max players is 4.'
      })
      return
    }

    let data = {
      event: event,
      playerList: playerList
    }
    PubSub.publish(TOPIC.SUBMIT_PLAYER_FORM, data)
  })

  startButton.addEventListener('click', () => {
    PubSub.publish(TOPIC.START_GAME, playerList)
  })

  showRulesButton.addEventListener('click', () => {
    PubSub.publish(TOPIC.SHOW_RULES)
  })

  currentIcon.addEventListener('click', () => {
    PubSub.publish(TOPIC.SHOW_ICON_CHOICES)
  })

  iconChoices.forEach(choice => {
    choice.addEventListener('click', () => {
      currentIcon.src = choice.src
      selectedIcon.value = choice.src
    })
  })
}
