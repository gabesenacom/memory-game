import { memoryCard, flippableCardListDOM } from './memoryCard'
import { FlippableCard } from './card'

let cardFlippeds = []
let cardArray = [1, 2, 3, 4, 5, 6, 7]
let score = {
  scoreDisplay: document.getElementById('simple-memory-card-score'),
  logDisplay: document.getElementById('simple-memory-card-log'),
  points: 0
}

function buildFlippableCards () {
  addCardsOnArray()
  addCardsOnArray()
}

function addCardsOnArray () {
  cardArray = cardArray.sort(() => 0.5 - Math.random())
  for (let i of cardArray) {
    let card = FlippableCard(
      `images/animal${i}.png`,
      flippableCardListDOM,
      memoryCard.getFlippableCards().length + 1
    )
    memoryCard.addFlippableCard(card)
    card.getDOM().addEventListener('click', flipCard)
  }
}

function flipCard (event) {
  let target = event.target
  let cardId = Number.parseInt(target.getAttribute('data-id'))
  let card = memoryCard
    .getFlippableCards()
    .filter(card => card.getId() === cardId)[0]
  card.flip()
  cardFlippeds.push(card)
  if (cardFlippeds.length >= 2) setTimeout(checkForMatch, 500)
}

function checkForMatch () {
  const optionOne = cardFlippeds[0]
  const optionTwo = cardFlippeds[1]

  if (optionOne.getId() === optionTwo.getId()) {
    cardFlippeds.forEach(card => card.flip())
    score.logDisplay.textContent = 'You have clicked the same image!'
  } else if (optionOne.getRealImageSrc() === optionTwo.getRealImageSrc()) {
    cardFlippeds.forEach(card => memoryCard.removeFlippableCard(card))
    score.points += 1
    score.scoreDisplay.textContent = `Score: ${score.points}`
    score.logDisplay.textContent = 'You found a match'
  } else {
    score.logDisplay.textContent = 'Sorry, try again!'
    cardFlippeds.forEach(card => card.flip())
  }

  cardFlippeds = []
  if (score.points === cardArray.length) {
    score.logDisplay.textContent = 'Congratulations! You found them all!'
  }
}

buildFlippableCards()
console.log('simple memory card loaded.')
