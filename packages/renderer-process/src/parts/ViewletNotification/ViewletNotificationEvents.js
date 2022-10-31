import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const findIndex = ($Child) => {
  const $Parent = $Child.parentNode
  for (let i = 0; i < $Parent.children.length; i++) {
    if ($Parent.children[i] === $Child) {
      return i
    }
  }
  return -1
}

export const handleClick = (event) => {
  const $Target = event.target
  switch ($Target.className) {
    case 'NotificationOption':
      const index = findIndex($Target)
      RendererWorker.send(
        /* Notification.handleClick */ 'Notification.handleClick',
        /* index */ index
      )
      break
    default:
      break
  }
}
