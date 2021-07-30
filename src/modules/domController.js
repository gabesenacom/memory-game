import PubSub from 'pubsub-js'
import TOPIC from './topics'
import "./GameLog"
import {
  createElement,
  removeChildren,
  clickOutsideElement,
  resetForm
} from './utils'
import { Game } from './Game'
import { init } from './memoryCardController'

// Card DOM
/* expect data structure
  {
    card: card object
  }
*/
function buildCard (topic, card) {
  let className = card.getClassName()
  let imageSrc = card.getImageSrc()
  let cardDOM = createElement('div', className, card.getParentNode())
  card.setDOM(cardDOM)
  cardDOM.setAttribute('data-id', card.getId())
  buildCardImage(cardDOM, className, imageSrc)
  if(isFlippableCard(className)) {
    cardDOM.addEventListener('click', Game.flipCardEvent)
  }
}

function isFlippableCard(className) {
  return className.includes('flippable card')
}

function buildCardImage(cardDOM, className, image) {
  if(isFlippableCard(className)) {
    cardDOM.style.backgroundImage = `url('${image}')`
    return
  }

  let imageDOM = createElement('img', 'card-image', cardDOM)
  imageDOM.src = image
}

// Player DOM

function buildPlayer (topic, data) {
  let card = data.card
  let player = {
    name: data.player.name,
    iconSrc: data.player.iconSrc,
    characterSrc: data.player.characterSrc,
    dom: createElement('img', 'player-image highlighted', null),
    id: data.player.id
  }
  player.dom.src = data.player.characterSrc
  player.dom.setAttribute('data-id', player.id)
  let firstChild = card.getDOM().children[0]
  card.getDOM().insertBefore(player.dom, firstChild)
  card.buildPlayer(player)
}

PubSub.subscribe(TOPIC.BUILD_CARD, buildCard)
PubSub.subscribe(TOPIC.BUILD_PLAYER, buildPlayer)

// Startup Form + Rules

const gameRules = document.getElementById('rules')
const rulesModal = document.querySelector('.modal')
const playerListDisplay = document.getElementById('players')
const startupForm = document.getElementById('startup')
const gameDisplay = document.getElementsByTagName('main')[0]

function _isSameIcon(playerList, icon) {
  return playerList.some((player) => player.icon === icon)
}

function _checkFormValidity (event, playerList, newPlayer) {
  if (playerList.length >= 4) {
    PubSub.publish(TOPIC.SEND_LOG, {
      type: 4,
      message: 'Sorry, the max players is 4.'
    })
    return false
  }

  if (!event.target.elements.playerName.validity.valid) {
    PubSub.publish(TOPIC.SEND_LOG, {
      type: 4,
      message: 'Player name cannot be blank.'
    })
    return false
  }

  if(_isSameIcon(playerList, newPlayer.icon)) {
    PubSub.publish(TOPIC.SEND_LOG, {
        type: 4,
        message: 'Sorry, you should to select another icon. This icon already selected.'
      })
    return false
  }
  return true
}

function showPlayerForm(topic, data) {
  let { form, addButton, cancelButton } = data

  form.classList.remove('hidden')
  addButton.classList.add('hidden')
  cancelButton.classList.remove('hidden')
}

function hidePlayerForm(topic, data) {
  let { form, addButton } = data

  resetForm(form, currentIcon)
  form.classList.add('hidden')
  addButton.classList.remove('hidden')
}

function submitPlayerForm (topic, data) {
  let { event, playerList, addButton } = data

  let newPlayer = {
    name: event.target.elements.playerName.value,
    type: event.target.elements.playerType.checked,
    icon: event.target.elements.playerIcon.value
  }
  
  if (!_checkFormValidity(event, playerList, newPlayer)) return

  playerList.push(newPlayer)
  _createPlayerListDOM(newPlayer, playerList, addButton)
  resetForm(event.target, currentIcon)
  event.target.classList.add('hidden')
  if (playerList.length < 4) addButton.classList.remove('hidden')
}

function _createPlayerListDOM (newPlayer, playerList, addButton) {
  let newPlayerDOM = createElement('div', 'player-entry', playerListDisplay)
  let newPlayerName = createElement('p', null)
  let newPlayerIcon = createElement('img', null)
  let newPlayerType = createElement('p', null)
  let removePlayerButton = createElement('i', 'fas fa-ban')

  newPlayerName.textContent = newPlayer.name
  newPlayerIcon.src = newPlayer.icon
  newPlayerType.textContent = newPlayer.type ? '(Bot)' : ''

  removePlayerButton.addEventListener('click', () => {
    let index = playerList.indexOf(newPlayer)
    playerList.splice(index, 1)
    newPlayerDOM.remove()
    if (playerList.length < 4) addButton.classList.remove('hidden')
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
  if (playerList.length < 2) {
    PubSub.publish(TOPIC.SEND_LOG, {
        type: 4,
        message: 'You must have at least 2 players to play!'
      })
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

PubSub.subscribe(TOPIC.SHOW_PLAYER_FORM, showPlayerForm)
PubSub.subscribe(TOPIC.HIDE_PLAYER_FORM, hidePlayerForm)
PubSub.subscribe(TOPIC.SUBMIT_PLAYER_FORM, submitPlayerForm)
PubSub.subscribe(TOPIC.START_GAME, startGame)
PubSub.subscribe(TOPIC.SHOW_RULES, showRules)
PubSub.subscribe(TOPIC.SHOW_ICON_CHOICES, showIconChoices)

// Player display

const cardList = document.getElementById('card-list')
const playerDisplay = document.getElementById('player-display');

function _createPlayerDisplayDOM (player) {
  let playerCard = createElement('div', 'player-card', playerDisplay)
  playerCard.setAttribute('data-id', player.id)

  let playerInfo = createElement('div', 'player-info', playerCard)
  let playerName = createElement('p', null)
  let playerIcon = createElement('img', null)
  let playerType = createElement('p', null)
  let playerLives = createElement('div', 'player-lives')
  _createPlayerLivesDOM(playerLives)

  playerName.textContent = player.name
  playerIcon.src = player.iconSrc
  playerType.textContent = player.ai ? '(Bot)' : ''
  
  playerInfo.appendChild(playerIcon)
  playerInfo.appendChild(playerName)
  playerInfo.appendChild(playerType)

  playerCard.appendChild(playerInfo)
  playerCard.appendChild(playerLives)
}

function _createPlayerLivesDOM (playerLives) {
  let lifeOne = createElement('div', 'life', playerLives)
  let lifeTwo = createElement('div', 'life', playerLives)
  let lifeThree = createElement('div', 'life', playerLives)
  let lifeFour = createElement('div', 'life', playerLives)

  lifeOne.setAttribute('data-id', 1)
  lifeTwo.setAttribute('data-id', 2)
  lifeThree.setAttribute('data-id', 3)
  lifeFour.setAttribute('data-id', 4)

  lifeOne.classList.add('filled')
}

function _removePlayerHighlights(playerList) {
  playerList.forEach(player => {
    let targetPlayer = _getTargetPlayer(player.id)
    let targetPlayerImage = _getTargetPlayerImage(player.id)
    targetPlayer.classList.remove('highlighted')
    targetPlayerImage.classList.remove('highlighted')
  })
}

function _getTargetPlayer (id) {
  return playerDisplay.querySelector(`.player-card[data-id='${id}']`)
}

function _getTargetPlayerImage (id) {
  return cardList.querySelector(`.player-image[data-id='${id}']`)
}

function highlightPlayerTurn (topic, data) {
  let { playerTurn, playerList } = data;
  _removePlayerHighlights(playerList);
  let targetPlayer = _getTargetPlayer(playerTurn.id)
  let targetPlayerImage = _getTargetPlayerImage(playerTurn.id)
  targetPlayer.classList.add('highlighted')
  targetPlayerImage.classList.add('highlighted')
}

function createPlayerDisplay (topic, playerList) {
  playerList.forEach(player => {
    _createPlayerDisplayDOM(player)
  })
}

function updateFinishLine (topic, player) {
  let targetPlayer = _getTargetPlayer(player.id)
  let playerLives = targetPlayer.querySelector('.player-lives')
  _clearLives(playerLives)
  _addLives(playerLives, player.finish_line)
}

function _clearLives (playerLives) {
  let livesToClear = playerLives.querySelectorAll('div')
  livesToClear.forEach(life => life.classList.remove('filled'))
}

function _addLives (playerLives, finish_line) {
  if (finish_line === 0) return
  for(let i = 1; i < finish_line+1; i++) {
    let lifeToFill = playerLives.querySelector(`div[data-id='${i}']`)
    lifeToFill.classList.add('filled')
  }
}

PubSub.subscribe(TOPIC.CREATE_PLAYER_DISPLAY, createPlayerDisplay)
PubSub.subscribe(TOPIC.HIGHLIGHT_PLAYER_TURN, highlightPlayerTurn)
PubSub.subscribe(TOPIC.UPDATE_FINISH_LINE, updateFinishLine)