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

function buildPlayer (topic, data) {
  let player = {
    name: data.player.name,
    dom: createElement('img', 'player-image', data.card.getDOM()),
    id: data.player.id
  }
  player.dom.src = data.player.imageSrc
  data.card.buildPlayer(player)
}

PubSub.subscribe(TOPIC.BUILD_CARD, buildCard);
PubSub.subscribe(TOPIC.BUILD_FLIPPABLE_CARD, buildFlippableCard);
PubSub.subscribe(TOPIC.BUILD_PLAYER, buildPlayer);