export const createElement = (tag, className, parentNode = null) => {
  let element = document.createElement(tag)
  element.className = className
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

export function sortRandomArray (array) {
  return array.sort(() => 0.5 - Math.random())
}

export function getNextItemPositionInArray (array, position) {
  let max = array.length - 1
  return position === max ? 0 : ++position
}
