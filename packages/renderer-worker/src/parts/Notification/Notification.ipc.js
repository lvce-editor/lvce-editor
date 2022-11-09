import * as Notification from './Notification.js'

export const name = 'Notification'

export const Commands = {
  create: Notification.create,
  dispose: Notification.dispose,
  handleClick: Notification.handleClick,
  showWithOptions: Notification.showWithOptions,
}
