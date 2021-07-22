import './assets/stylesheets/main.scss';

// +++++++++++++++++++++ Testing form stuff +++++++++++++++++++++++

import PubSub from 'pubsub-js';
import TOPIC from './modules/topics';
import './modules/domController';

const playerForm = document.getElementById('player-form');
const startButton = document.getElementById('start-game');
const toggleRulesButtons = document.querySelectorAll('.toggle-rules');
const playerList = [];

playerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let data = {
    event: event,
    playerList: playerList
  }
  PubSub.publish(TOPIC.SUBMIT_PLAYER_FORM, data);
})

startButton.addEventListener('click', () => {
  PubSub.publish(TOPIC.START_GAME, playerList);
})

toggleRulesButtons.forEach((button) => {
  button.addEventListener('click', () => {
    PubSub.publish(TOPIC.SHOW_RULES);
  })
})