import PubSub from 'pubsub-js';
import TOPIC from './topics';
import { 
  createElement,
  clearFields,
  removeChildren,
  clickOutsideElement
} from './utils';
import { Game } from './memoryCardController';
import init from './memoryCardController';

// Card DOM

function buildCard (topic, card) {
  let className = 'card';
  let parentNode = card.getParentNode();
  let id = card.getId();
  let imageSrc = card.getImageSrc();
  let cardDOM = createElement('div', className, parentNode);

  card.setDOM(cardDOM);
  cardDOM.setAttribute('data-id', id);
  card.setImage(imageSrc);
}

function buildFlippableCard (topic, card) {
  let className = 'card';
  let parentNode = card.getParentNode();
  let id = card.getId();
  let imageSrc = card.getImageSrc();
  let cardDOM = createElement('div', className, parentNode);

  card.setDOM(cardDOM);
  cardDOM.setAttribute('data-id', id);
  card.setImage(imageSrc);
  cardDOM.addEventListener('click', Game.flipCardEvent);
}

PubSub.subscribe(TOPIC.BUILD_CARD, buildCard);
PubSub.subscribe(TOPIC.BUILD_FLIPPABLE_CARD, buildFlippableCard);

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

PubSub.subscribe(TOPIC.BUILD_PLAYER, buildPlayer);

// Startup Form + Rules

const gameRules = document.getElementById('rules');
const rulesModal = document.querySelector('.modal');
const playerDisplay = document.getElementById('player-list');
const playerForm = document.getElementById('player-form');
const startupForm = document.getElementById('startup');
const errors = document.getElementById('errors');
const gameDisplay = document.getElementsByTagName('main')[0];

function submitPlayerForm (topic, data) {
  let { event, playerList } = data;
  let playerName = event.target.elements.playerName.value;
  let playerType = event.target.elements.playerType.checked;
  let playerIcon = event.target.elements.playerIcon.value;

  playerList.push({
      name: playerName,
      type: playerType,
      icon: playerIcon
  });

  createPlayerDOM(playerName, playerIcon, playerType);
  clearFields(event);
}

function createPlayerDOM (playerName, playerIcon, playerType) {
  let newPlayer = createElement('div', 'player-entry', playerDisplay);
  // This can be done better. It wasn't adding the elements with createElement for some reason
  let newPlayerName = createElement('p', null);
  let newPlayerIcon = createElement('img', null);
  let newPlayerType = createElement('p', null);
  let removePlayerButton = createElement('button', null);

  newPlayerName.textContent = playerName;
  newPlayerIcon.src = playerIcon;
  newPlayerType.textContent = playerType ? '(Bot)' : '';
  removePlayerButton.textContent = 'X';

  removePlayerButton.addEventListener('click', () => {
    newPlayer.remove();
  })

  newPlayer.appendChild(newPlayerIcon);
  newPlayer.appendChild(newPlayerName);
  newPlayer.appendChild(newPlayerType);
  newPlayer.appendChild(removePlayerButton);
}

const iconDisplay = document.getElementById('icon-choices');
const currentIcon = document.getElementById('current-icon');

function showIconChoices (topic) {
  iconDisplay.classList.toggle('hidden');
  document.body.addEventListener('click', (event) => {
    clickOutsideElement(event, [iconDisplay, currentIcon], iconDisplay);
  })
}

function startGame (topic, playerList) {
  removeChildren(errors);

  if (playerList.length < 2) { 
    let errorMessage = createElement('p', 'error', errors);
    errorMessage.textContent = 'You must have at least 2 players to play!';
    return;
  }

  gameDisplay.classList.remove('hidden');
  startupForm.classList.add('hidden');
  init(playerList);
}

function showRules (topic) {
  gameRules.classList.toggle('hidden');
  document.body.addEventListener('click', (event) => {
    clickOutsideElement(event, [rulesModal], gameRules);
  })
}

PubSub.subscribe(TOPIC.SUBMIT_PLAYER_FORM, submitPlayerForm);
PubSub.subscribe(TOPIC.START_GAME, startGame);
PubSub.subscribe(TOPIC.SHOW_RULES, showRules);
PubSub.subscribe(TOPIC.SHOW_ICON_CHOICES, showIconChoices);