import PubSub from 'pubsub-js'
import TOPIC from './topics'
import './domController'

const showRulesButton = document.querySelector('.show-rules')
const addPlayerButton = document.getElementById('add-player')
const cancelPlayerButton = document.getElementById('cancel-player')
const playerForm = document.getElementById('player-form')
const currentIcon = document.getElementById('current-icon')
const selectedIcon = document.getElementById('playerIcon')
const iconChoices = document.querySelectorAll('.icon-choice')
const startButton = document.getElementById('start-game')
const playerList = []

export function homePageInit () {
  addPlayerButton.addEventListener('click', () => {
    PubSub.publish(TOPIC.SHOW_PLAYER_FORM, {
      playerList: playerList,
      form: playerForm,
      addButton: addPlayerButton,
      cancelButton: cancelPlayerButton
    })
  })

  cancelPlayerButton.addEventListener('click', (event) => {
    event.preventDefault()
    PubSub.publish(TOPIC.HIDE_PLAYER_FORM, {
      form: playerForm,
      addButton: addPlayerButton
    })
  })

  playerForm.reset()
  playerForm.addEventListener('submit', event => {
    event.preventDefault()
    let data = {
      event: event,
      playerList: playerList,
      addButton: addPlayerButton
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
