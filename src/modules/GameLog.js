import PubSub from 'pubsub-js'
import TOPIC from './topics'

const _createLogDOMElement = () => {
  let element = document.createElement('p')
  element.classList.add('hidden')
  document.body.appendChild(element)
  return element
}


function _clickToHide(logDOM) {
  logDOM.addEventListener('click', () => logDOM.classList.add('hidden'))
}

const logDOM = _createLogDOMElement()

let pendingLogs = []

function sendLogMessage(logDOM, type, message) {
  clearPendingLogs()
  logDOM.classList.remove("hidden")
  logDOM.setAttribute("data-type", type)
  logDOM.setAttribute("id", 'log')
  logDOM.textContent = message
  let pendingLog = setTimeout(() => logDOM.classList.add("hidden"), 4000)
  _clickToHide(logDOM, pendingLog)
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