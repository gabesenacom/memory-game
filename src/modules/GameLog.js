import PubSub from 'pubsub-js'
import TOPIC from './topics'

const _createLogDOMElement = () => {
  let element = document.createElement('p')
  element.classList.add('hidden')
  document.body.appendChild(element)
  return element
}

function _clickToHide() {
  this.classList.add('hidden')
}

function _showPlayAgainButton(logDOM) {
  let playAgainLink = document.createElement("a")
  playAgainLink.textContent = 'Play Again?'
  playAgainLink.href = "/"

  let playAgainButton = document.createElement("button")

  playAgainButton.appendChild(playAgainLink)
  logDOM.appendChild(playAgainLink)
}

const logDOM = _createLogDOMElement()

let pendingLogs = []

function sendLogMessage(logDOM, type, message) {
  clearPendingLogs()
  logDOM.classList.remove("hidden")
  logDOM.setAttribute("data-type", type)
  logDOM.setAttribute("id", 'log')
  logDOM.textContent = message

  if (type === "gameover") {
    _showPlayAgainButton(logDOM)
    logDOM.removeEventListener('click', _clickToHide)
    logDOM.classList.add('cursor-normal')
    return
  }

  let pendingLog = setTimeout(() => logDOM.classList.add("hidden"), 4000)
  logDOM.addEventListener('click', _clickToHide)
  pendingLogs.push(pendingLog)
}

function clearPendingLogs() {
  pendingLogs.forEach((pendingLog) => clearTimeout(pendingLog))
  pendingLogs = []
}

/* expect type structure
  type    = value
  info    = 1
  success = 2
  warning = 3
  error   = 4
*/

function convertTypeToStringType(type_num) {
  switch(type_num) {
    case 2:
      return 'success'
    case 3:
      return 'warning'
    case 4:
      return 'error'
    case 5:
      return 'gameover'
  }
  return 'info'
}

/* expect data structure
  {
    type: undefined(not set or undefined), 1, 2, 3, 4
    message: log message in strings: 'log message'
  }
*/
function handleLogMessage(topic, data) {
  let type = convertTypeToStringType(data.type)
  sendLogMessage(logDOM, type, data.message)
}


PubSub.subscribe(TOPIC.SEND_LOG, handleLogMessage)