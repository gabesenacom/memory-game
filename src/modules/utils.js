import Icon1 from '../assets/images/characters/char-head-1.png'

export const createElement = (tag, className, parentNode = null) => {
  let element = document.createElement(tag)
  if(className) element.className = className
  if (parentNode) parentNode.appendChild(element)
  return element
}

export function removeChildren (element) {
  while (element.firstChild) {
    element.lastChild.remove()
  }
}

export function clickOutsideElement (event, elementList, elementToHide) {
  if (!elementList.includes(event.target)) {
    elementToHide.classList.add('hidden')
  }
}

export function getValidParentNode(target, validator, depth) {
  if(validator(target)) return target
  if(depth > 10) return target
  return getValidParentNode(target.parentNode, validator, ++depth)
}

export function sortRandomArray (array) {
  return array.sort(() => 0.5 - Math.random())
}

export function getNextItemPositionInArray (array, position) {
  let max = array.length - 1
  return position === max ? 0 : ++position
}

export function moveFirstChildToEnd(parentNode) {
  let first = parentNode.children[0]
  parentNode.removeChild(first)
  parentNode.appendChild(first)
}

export function resetForm(form, icon) {
  form.reset()
  icon.src = Icon1
}