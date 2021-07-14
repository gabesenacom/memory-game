import {memoryCard} from './modules/memoryCard';
import {FlippableCard} from './modules/memorycard';

const cardArray = []
for(let i = 1; i <= 7; i++) {
  //addFlippableCard()
  cardArray.push(FlippableCard(`images/animal${i}.png`))
}
cardArray = cardArray.sort(() => 0.5 - Math.random())

for(let card of cardArray) {
  memoryCard.addFlippableCard(card)
}