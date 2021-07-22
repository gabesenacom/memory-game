import PubSub from 'pubsub-js';
import TOPIC from './topics';
import './domController';

const playerForm = document.getElementById('player-form');
const startButton = document.getElementById('start-game');
const toggleRulesButtons = document.querySelectorAll('.toggle-rules');
const currentIcon = document.getElementById('current-icon');
const selectedIcon = document.getElementById('playerIcon');
const iconChoices = document.querySelectorAll('.icon-choice');
const playerList = [];

export function homePageInit () {
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

  currentIcon.addEventListener('click', () => {
    PubSub.publish(TOPIC.SHOW_ICON_CHOICES);
  })
  
  iconChoices.forEach((choice) => {
    choice.addEventListener('click', () => {
      currentIcon.src = choice.src;
      selectedIcon.value = choice.src;
    })
  })
}