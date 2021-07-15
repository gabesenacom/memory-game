import {createElement} from './utils'

const DEFAULT_BLANK_IMAGE = 'images/blank.png'

const Card = (imageSrc, parentNode, id) => {
  let image;
  let player;
  let cardDOM;

  function build(className = 'card') {
    cardDOM = createElement('div', className, parentNode)
    cardDOM.setAttribute('data-id', id)
    setImage(imageSrc)
    return cardDOM
  }

  function setImage(imageSrc) {
    cardDOM.style.backgroundImage = `url('${imageSrc}')`
  }

  function buildPlayer(playerObject) {
    player = {
      'name': playerObject.name,
      'dom': createElement('img', 'player-image', cardDOM)
    }
    player.dom.src = playerObject.imageSrc
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

  function getId() {
    return id
  }

  function getDOM() {
    return cardDOM
  }

  function getImageSrc() {
    return imageSrc
  }

  return {build, setImage, buildPlayer, removePlayer, hasPlayer, getPlayer, getDOM, getId, getImageSrc}
}

const FlippableCard = (originalImageSrc, parentNode, id) => {
  let {build, setImage, getDOM, getId, getImageSrc} = Card(DEFAULT_BLANK_IMAGE, parentNode, id)
  let flipped = false

  function flip() {
    flipped = !flipped
    setImage(flipped ? originalImageSrc : DEFAULT_BLANK_IMAGE)
  }

  function getRealImageSrc() {
    return originalImageSrc
  }

  return {build, setImage, flip, getDOM, getId, getRealImageSrc}
}

export {Card, FlippableCard}