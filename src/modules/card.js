import { createElement } from './utils'
import './domController'

const DEFAULT_BLANK_IMAGE = 'images/blank.png'

const Card = (imageSrc, parentNode, id, className = 'card') => {
  let image
  let player
  let cardDOM
  let imageDOM;

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

  function getClassName() {
    return className
  }

  return {
    buildPlayer,
    removePlayer,
    getClassName,
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
    getDOM,
    setDOM,
    getId,
    getImageSrc,
    getParentNode,
    getClassName
  } = Card(defaultBlankImage, parentNode, id, 'flippable card')
  let flipped = false

  function _setImage (imageSrc) {
    getDOM().style.backgroundImage = `url('${imageSrc}')`
  }

  function flipImage () {
    flipped = !flipped
    _setImage(flipped ? originalImageSrc : defaultBlankImage)
  }

  function isFlipped () {
    return flipped
  }

  function getRealImageSrc () {
    return originalImageSrc
  }

  return {
    flipImage,
    getDOM,
    setDOM,
    getId,
    getImageSrc,
    getRealImageSrc,
    getParentNode,
    getClassName,
    isFlipped
  }
}

export { Card, FlippableCard }
