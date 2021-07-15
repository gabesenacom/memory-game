import './assets/stylesheets/main.scss';
import {addPlayer} from './modules/memoryCard';
import {createPlayer} from './modules/Player';
import './modules/simpleMemoryCard';

let player1 = createPlayer('England', 'https://wpicsum.photos/150')
addPlayer(player1)

let player2 = createPlayer('France', 'https://wpicsum.photos/200')
addPlayer(player2)

let player3 = createPlayer('Paris', 'https://wpicsum.photos/250')
addPlayer(player3)