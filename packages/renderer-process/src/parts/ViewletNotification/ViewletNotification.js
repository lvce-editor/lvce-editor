import * as NotificationEvents from './ViewletNotificationEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Notification'
  $Viewlet.onclick = NotificationEvents.handleClick
  return {
    $Viewlet,
  }
}

export const setText = (state, text) => {
  const { $Viewlet } = state
  $Viewlet.textContent = text
}
