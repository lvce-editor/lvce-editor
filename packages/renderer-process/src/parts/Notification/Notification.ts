import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as Widget from '../Widget/Widget.ts'

const create$Notification = (message) => {
  const $Notification = document.createElement('div')
  $Notification.className = 'Notification'
  $Notification.textContent = message
  return $Notification
}

export const create = (type, message) => {
  // TODO this pattern might be also useful for activitybar, sidebar etc., creating elements as late as possible, only when actually needed
  const $Notification = create$Notification(message)
  Widget.append($Notification)
}

const findIndex = ($Child) => {
  const $Parent = $Child.parentNode
  for (let i = 0; i < $Parent.children.length; i++) {
    if ($Parent.children[i] === $Child) {
      return i
    }
  }
  return -1
}

const handleNotificationClick = (event) => {
  const $Target = event.target
  switch ($Target.className) {
    case 'NotificationOption':
      const index = findIndex($Target)
      RendererWorker.send(/* Notification.handleClick */ 'Notification.handleClick', /* index */ index)
      break
    default:
      break
  }
}

const create$NotificationWithOptions = (message, options) => {
  const $NotificationMessage = document.createElement('p')
  $NotificationMessage.className = 'NotificationMessage'
  $NotificationMessage.textContent = message
  const $NotificationOptions = document.createElement('div')
  $NotificationOptions.className = 'NotificationOptions'
  for (const option of options) {
    const $NotificationOption = document.createElement('button')
    $NotificationOption.className = 'NotificationOption'
    $NotificationOption.textContent = option
    $NotificationOptions.append($NotificationOption)
  }
  const $Notification = document.createElement('div')
  $Notification.className = 'Notification'
  $Notification.append($NotificationMessage, $NotificationOptions)
  $Notification.onclick = handleNotificationClick
  return $Notification
}

export const createWithOptions = (type, message, options) => {
  const $Notification = create$NotificationWithOptions(message, options)
  Widget.append($Notification)
}

export const dispose = (id) => {
  // const $Notification = state.$Notifications
}
