import PubSub from 'pubsub-js';
import TOPIC from './topics';
import { createElement } from './utils';
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
const playerDisplay = document.getElementById('player-list');
const playerForm = document.getElementById('player-form');
const startupForm = document.getElementById('startup');
const errors = document.getElementById('errors');
const gameDisplay = document.getElementsByTagName('main')[0];

function submitPlayerForm (topic, data) {
  let { event, playerList } = data;
  let playerName = event.target.elements.playerName.value;
  let playerType = event.target.elements.playerType.checked ? 'Computer': 'Human';

  playerList.push({
      name: playerName,
      type: event.target.elements.playerType.checked
    });

  let newPlayer = createElement('p', 'player-name', playerDisplay);
  newPlayer.textContent = `Name: ${playerName} -- Type: ${playerType}`;

  clearFields(event);
}

function clearFields (event) {
  event.target.elements.playerName.value = '';
  event.target.elements.playerType.checked = false;
}

function removeChildren (element) {
  while (element.firstChild) { element.lastChild.remove() };
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
}

PubSub.subscribe(TOPIC.SUBMIT_PLAYER_FORM, submitPlayerForm);
PubSub.subscribe(TOPIC.START_GAME, startGame);
PubSub.subscribe(TOPIC.SHOW_RULES, showRules);