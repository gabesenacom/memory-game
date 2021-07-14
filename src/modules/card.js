import {createElement} from './utils'

const Card = (imageSrc, parentNode) => {
  let image;
  let player;
  let cardDOM;

  function build(className = 'card') {
    cardDOM = createElement('div', className, parentNode)
    setImage(imageSrc)
    return cardDOM
  }

  function setImage(imageSrc) {
    cardDOM.style.backgroundImage = `url('${imageSrc}')`
    console.log(">>", cardDOM.style.backgroundImage)
  }

  function buildPlayer(playerObject) {
    player = {
      'name': playerObject.name,
      'dom': createElement('img', 'player-image', cardDOM)
    }
    player.dom.src = playerObject.imageSrc

    console.log("building player", playerObject, "player card", player)
  }

  function hasPlayer() {
    return player != null
  }

  function getPlayer() {
    return player
  }

  function removePlayer() {
    player.dom.remove()
    player = null
  }

  function getDOM() {
    return cardDOM
  }

  return {build, setImage, buildPlayer, removePlayer, hasPlayer, getPlayer, getDOM}
}

const FlippableCard = (hiddenImageSrc, originalImageSrc, parentNode) => {
  let {build, setImage, getDOM} = Card(hiddenImageSrc, parentNode)
  let flipped = false

  function flip() {
    flipped = !flipped
    setImage(flipped ? originalImageSrc : hiddenImageSrc)
  }

  return {build, setImage, flip}
}

export {Card, FlippableCard}