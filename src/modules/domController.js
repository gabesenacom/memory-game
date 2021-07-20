import PubSub from 'pubsub-js';
import TOPIC from './topics';
import { createElement } from './utils';
import { Game } from './memoryCardController';

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

function buildPlayer (topic, card, playerObject) {
  player = {
    name: playerObject.name,
    dom: createElement('img', 'player-image', card.getDOM()),
    id: playerObject.id
  }
  player.dom.src = playerObject.imageSrc
}

PubSub.subscribe(TOPIC.BUILD_CARD, buildCard);
PubSub.subscribe(TOPIC.BUILD_FLIPPABLE_CARD, buildFlippableCard);
PubSub.subscribe(TOPIC.BUILD_PLAYER, buildPlayer);