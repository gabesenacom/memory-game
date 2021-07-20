import { memoryCard } from './memoryCard'
import { getNextCardPosition } from './memoryCardController'

function getPlayerById (array, id) {
  return array.filter(player => player.id === id)[0]
}

const Player = (name, imageSrc, id, ai = false) => {
  return { name, imageSrc, id, finish_line: 2, ai }
}

const ComputerPlayer = (name, imageSrc, id) => {
  const prototype = Player(name, imageSrc, id, true)
  let images = []

  function memorize (cardImage, position) {
    let memory = { cardImage, position }
    let alwaysExists =
      images.filter(
        image => image.cardImage == cardImage && image.position == position
      ).length > 0
    if (alwaysExists) return
    images.push(memory)
  }

  function _getSameImage (anotherImage) {
    return images.filter(image => image.cardImage == anotherImage)[0]
  }

  function _getBetterRandomImage () {
    let rdn = 0
    let flippableCardsSize = memoryCard.getFlippableCards().length
    while (true) {
      let foundSameImage =
        images.filter(image => image.position == rdn).length > 0
      if (!foundSameImage) {
        break
      }
      rdn = Math.round(Math.random() * (flippableCardsSize - 1))
    }
    return rdn
  }

  function selectBestChoice (currentCard) {
    let cardPlayerTurnPosition = memoryCard.getCardPosition(currentCard)
    let nextCardPosition = getNextCardPosition(cardPlayerTurnPosition)
    let nextCard = memoryCard.getCard(nextCardPosition)
    let nextCardImage = nextCard.getImageSrc()
    let sameImage = _getSameImage(nextCardImage)

    if (sameImage) {
      return memoryCard.getFlippableCard(sameImage.position)
    } else {
      return memoryCard.getFlippableCard(_getBetterRandomImage())
    }
  }

  return Object.assign(prototype, { memorize, selectBestChoice })
}

export { Player, ComputerPlayer, getPlayerById }
