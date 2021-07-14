export const createElement = (tag, className, parentNode = null) => {
  let element = document.createElement(tag)
  element.className = className
  if(parentNode)
    parentNode.appendChild(element)
  return element
}