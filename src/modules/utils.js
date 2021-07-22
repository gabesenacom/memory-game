export const createElement = (tag, className, parentNode = null) => {
  let element = document.createElement(tag)
  element.className = className
  if(parentNode)
    parentNode.appendChild(element)
  return element
}

export function clearFields (event) {
  event.target.elements.playerName.value = '';
  event.target.elements.playerType.checked = false;
}

export function removeChildren (element) {
  while (element.firstChild) { element.lastChild.remove() };
}

export function clickOutsideElement (event, elementList, elementToHide) {
  if (!elementList.includes(event.target)) {
    elementToHide.classList.add('hidden');
  }
}