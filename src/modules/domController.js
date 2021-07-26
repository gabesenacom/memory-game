import PubSub from 'pubsub-js'
import TOPIC from './topics'
import {
  createElement,
  clearFields,
  removeChildren,
  clickOutsideElement
} from './utils'
import { Game } from './Game'
import { init } from './memoryCardController'

// Card DOM

function buildCard (topic, card) {
  let className = 'card'
  let parentNode = card.getParentNode()
  let id = card.getId()
  let imageSrc = card.getImageSrc()
  let cardDOM = createElement('div', className, parentNode)

  card.setDOM(cardDOM)
  cardDOM.setAttribute('data-id', id)
  card.setImage(imageSrc)
}

function buildFlippableCard (topic, card) {
  let className = 'card'
  let parentNode = card.getParentNode()
  let id = card.getId()
  let imageSrc = card.getImageSrc()
  let cardDOM = createElement('div', className, parentNode)

  card.setDOM(cardDOM)
  cardDOM.setAttribute('data-id', id)
  card.setImage(imageSrc)
  cardDOM.addEventListener('click', Game.flipCardEvent)
}

// Player DOM

function buildPlayer (topic, data) {
  let player = {
    name: data.player.name,
    dom: createElement('img', 'player-image', data.card.getDOM()),
    id: data.player.id
  }
  player.dom.src = data.player.imageSrc
  data.card.buildPlayer(player)
}

PubSub.subscribe(TOPIC.BUILD_CARD, buildCard)
PubSub.subscribe(TOPIC.BUILD_FLIPPABLE_CARD, buildFlippableCard)
PubSub.subscribe(TOPIC.BUILD_PLAYER, buildPlayer)

// Startup Form + Rules

const gameRules = document.getElementById('rules')
const rulesModal = document.querySelector('.modal')
const playerDisplay = document.getElementById('player-list')
const startupForm = document.getElementById('startup')
const errors = document.getElementById('errors')
const gameDisplay = document.getElementsByTagName('main')[0]

function submitPlayerForm (topic, data) {
  let { event, playerList } = data

  let newPlayer = {
    name: event.target.elements.playerName.value,
    type: event.target.elements.playerType.checked,
    icon: event.target.elements.playerIcon.value
  }
  playerList.push(newPlayer)
  createPlayerDOM(newPlayer, playerList)
  event.target.reset()
}

function createPlayerDOM (newPlayer, playerList) {
  let newPlayerDOM = createElement('div', 'player-entry', playerDisplay)
  // This can be done better/cleaner. It wasn't adding the elements with createElement for some reason
  let newPlayerName = createElement('p', null)
  let newPlayerIcon = createElement('img', null)
  let newPlayerType = createElement('p', null)
  let removePlayerButton = createElement('button', null)

  newPlayerName.textContent = newPlayer.name
  newPlayerIcon.src = newPlayer.icon
  newPlayerType.textContent = newPlayer.type ? '(Bot)' : ''
  removePlayerButton.textContent = 'X'

  removePlayerButton.addEventListener('click', () => {
    let index = playerList.indexOf(newPlayer)
    playerList.splice(index, 1)
    newPlayerDOM.remove()
  })

  newPlayerDOM.appendChild(newPlayerIcon)
  newPlayerDOM.appendChild(newPlayerName)
  newPlayerDOM.appendChild(newPlayerType)
  newPlayerDOM.appendChild(removePlayerButton)
}

const iconDisplay = document.getElementById('icon-choices')
const currentIcon = document.getElementById('current-icon')

function showIconChoices (topic) {
  iconDisplay.classList.toggle('hidden')
  document.body.addEventListener('click', event => {
    clickOutsideElement(event, [iconDisplay, currentIcon], iconDisplay)
  })
}

function startGame (topic, playerList) {
  removeChildren(errors)

  if (playerList.length < 2) {
    let errorMessage = createElement('p', 'error', errors)
    errorMessage.textContent = 'You must have at least 2 players to play!'
    return
  }

  gameDisplay.classList.remove('hidden')
  startupForm.classList.add('hidden')
  init(playerList)
}

function showRules (topic) {
  gameRules.classList.remove('hidden')
  document.body.addEventListener('click', event => {
    clickOutsideElement(event, [rulesModal], gameRules)
  })
}

PubSub.subscribe(TOPIC.SUBMIT_PLAYER_FORM, submitPlayerForm)
PubSub.subscribe(TOPIC.START_GAME, startGame)
PubSub.subscribe(TOPIC.SHOW_RULES, showRules)
PubSub.subscribe(TOPIC.SHOW_ICON_CHOICES, showIconChoices)
