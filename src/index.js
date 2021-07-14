import './assets/stylesheets/main.scss';
import {addPlayer} from './modules/memoryCard';
import {createPlayer} from './modules/Player';

let player1 = createPlayer('England', 'https://picsum.photos/150')
addPlayer(player1)

let player2 = createPlayer('France', 'https://picsum.photos/200')
addPlayer(player2)

let player3 = createPlayer('Paris', 'https://picsum.photos/250')
addPlayer(player3)