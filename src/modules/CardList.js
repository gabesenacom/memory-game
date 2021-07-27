import {createElement, moveFirstChildToEnd} from "./utils"

const mainDOM = document.querySelector("main")

const _createCardList = (id) => {
  let dom = document.getElementById(id)
  if(dom == null ){
    dom = createElement('ul', null, mainDOM)
    dom.setAttribute('id', id)
  }
  return {dom}
}

const StaticCardList = (() => {
  const {dom} = _createCardList('card-list')

  function _isReachedEnd(cardDOM) {
    let index = [...dom.children].indexOf(cardDOM) + 1
    return index === dom.children.length
  }

  function scrollTo(cardDOM) {
    if(_isReachedEnd(cardDOM)) moveFirstChildToEnd(dom)

    let {right} = cardDOM.getBoundingClientRect()
    dom.scrollTo(right, 0)
  }

  return {dom, scrollTo};
})()

const FlippableCardList = (() => {
  const {dom} = _createCardList('flippable-card-list')

  return {dom};
})()

export {StaticCardList, FlippableCardList}