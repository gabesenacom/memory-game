import { createElement } from './utils'
import './domController'

const DEFAULT_BLANK_IMAGE = 'images/blank.png'

const Card = (imageSrc, parentNode, id) => {
  let image
  let player
  let cardDOM

  function build (className = 'card') {
    cardDOM = createElement('div', className, parentNode)
    cardDOM.setAttribute('data-id', id)
    setImage(imageSrc)
    return cardDOM
  }

  function setImage (imageSrc) {
    cardDOM.style.backgroundImage = `url('${imageSrc}')`
  }

  function buildPlayer (_player) {
    player = _player
  }

  function hasPlayer () {
    return player != null
  }

  function getPlayer () {
    return player
  }

  function removePlayer () {
    player.dom.remove()
    player = null
  }

  function getId () {
    return id
  }

  function getDOM () {
    return cardDOM
  }

  function setDOM (element) {
    cardDOM = element
  }

  function getImageSrc () {
    return imageSrc
  }

  function getParentNode () {
    return parentNode
  }

  return {
    build,
    setImage,
    buildPlayer,
    removePlayer,
    hasPlayer,
    getPlayer,
    getDOM,
    setDOM,
    getId,
    getImageSrc,
    getParentNode
  }
}

const FlippableCard = (
  originalImageSrc,
  parentNode,
  id,
  defaultBlankImage = DEFAULT_BLANK_IMAGE
) => {
  let {
    build,
    setImage,
    getDOM,
    setDOM,
    getId,
    getImageSrc,
    getParentNode
  } = Card(defaultBlankImage, parentNode, id)
  let flipped = false

  function flipImage () {
    flipped = !flipped
    setImage(flipped ? originalImageSrc : defaultBlankImage)
  }

  function isFlipped () {
    return flipped
  }

  function getRealImageSrc () {
    return originalImageSrc
  }

  return {
    build,
    setImage,
    flipImage,
    getDOM,
    setDOM,
    getId,
    getImageSrc,
    getRealImageSrc,
    getParentNode,
    isFlipped
  }
}

export { Card, FlippableCard }
